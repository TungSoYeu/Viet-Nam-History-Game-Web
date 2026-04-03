// backend/routes/api.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const gameController = require('../controller/gameController');
const theme4Controller = require('../controllers/theme4Controller');
const { put } = require('@vercel/blob');
const fs = require('fs');
const path = require('path');

const Lesson = require('../models/Lesson');
const Question = require('../models/Question');
const User = require('../models/User');
const Matching = require('../models/Matching');
const Chronological = require('../models/Chronological');
const GuessCharacter = require('../models/GuessCharacter');
const RevealPicture = require('../models/RevealPicture');
const TelemetryEvent = require('../models/TelemetryEvent');
const { getTheme4Content } = require('../services/theme4ContentService');
const { isAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Mã bí mật để tạo tài khoản Admin (lấy từ biến môi trường)
const ADMIN_SECRET_CODE = process.env.ADMIN_SECRET_CODE || 'HISTORY_ADMIN_2024';

// Đường dẫn đăng ký người chơi mới & Admin
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google-login', async (req, res) => {
    const { tokenId } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { sub, email, name, picture } = payload;

        let user = await User.findOne({ $or: [{ googleId: sub }, { email: email }] });

        if (!user) {
            // Tạo user mới nếu chưa tồn tại
            // Username mặc định là email hoặc phần trước @ của email
            const baseUsername = email.split('@')[0];
            let uniqueUsername = baseUsername;
            let counter = 1;
            while (await User.findOne({ username: uniqueUsername })) {
                uniqueUsername = `${baseUsername}${counter}`;
                counter++;
            }

            user = new User({
                username: uniqueUsername,
                email: email,
                googleId: sub,
                fullName: name,
                avatar: picture,
                // password không cần thiết cho google login
            });
            await user.save();
        } else if (!user.googleId) {
            // Nếu user đã có tài khoản thường bằng email này, liên kết với Google
            user.googleId = sub;
            if (!user.avatar) user.avatar = picture;
            await user.save();
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            _id: user._id,
            username: user.username,
            role: user.role,
            fullName: user.fullName,
            avatar: user.avatar,
            token
        });
    } catch (error) {
        console.error("Google Login Error:", error);
        res.status(400).json({ message: "Xác thực Google thất bại" });
    }
});

router.post('/register', async (req, res) => {
  const { username, password, email, adminCode, fullName, dateOfBirth, school, province, city } = req.body;
  console.log("Registering user:", username);
  
  if (!username || !password) return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin!" });

  try {
    const safeEmail = email && email.trim() !== '' ? email.trim() : undefined;

    const orConditions = [{ username }];
    if (safeEmail) {
        orConditions.push({ email: safeEmail });
    }

    let existingUser = await User.findOne({ $or: orConditions });
    if (existingUser) {
        if (existingUser.username === username) {
            return res.status(400).json({ message: "Tên đăng nhập đã tồn tại!" });
        } else {
            return res.status(400).json({ message: "Email này đã được sử dụng!" });
        }
    }

    // Phân quyền rõ ràng trước khi lưu vào Database
    let role = 'user';
    if (adminCode && adminCode.trim() !== '') {
        if (adminCode.trim() === ADMIN_SECRET_CODE) {
            role = 'admin';
        } else {
            return res.status(400).json({ message: "Mã Quản trị viên không hợp lệ!" });
        }
    }

    // Lưu vào database với role đã được xác định
    const user = new User({ 
      username, 
      password, 
      email: safeEmail,
      role,
      fullName: fullName || '',
      dateOfBirth: dateOfBirth || null,
      school: school || '',
      province: province || '',
      city: city || ''
    });
    // Nếu là admin, có thể cho thêm đặc quyền mặc định (ví dụ: nhiều XP)
    if (role === 'admin') {
        user.experience = 9999;
    }

    await user.save();
    console.log("User registered successfully:", user._id);
    res.json({ success: true, message: "Đăng ký thành công!", role });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Lỗi đăng ký", error: err.message || "Unknown error" });
  }
});

// Đường dẫn đăng nhập
router.post('/login', async (req, res) => {
  const { username, password } = req.body; // username can be username or email
  console.log("Login attempt:", username);
  
  if (!username || !password) return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });

  try {
    // Cho phép đăng nhập bằng cả username hoặc email
    const user = await User.findOne({ 
        $or: [
            { username: username },
            { email: username }
        ]
    });

    if (!user) {
      return res.status(401).json({ message: "Tài khoản không tồn tại!" });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu không chính xác!" });
    }

    console.log("Login successful:", user.username);
    const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
    res.json({ ...user.toObject(), token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Lỗi khi đăng nhập", error: err.message });
  }
});

// Đường dẫn đổi mật khẩu
router.patch('/user/change-password', async (req, res) => {
    const { userId, oldPassword, newPassword } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });
        
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            return res.status(400).json({ message: "Mật khẩu cũ không chính xác" });
        }
        
        user.password = newPassword;
        await user.save();
        res.json({ success: true, message: "Đổi mật khẩu thành công" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Đường dẫn liên kết Google cho user đã đăng nhập
router.post('/user/link-google', async (req, res) => {
    const { userId, tokenId } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { sub, email, picture } = payload;

        // Kiểm tra xem GoogleId này đã bị ai khác chiếm chưa
        const existingGoogleUser = await User.findOne({ googleId: sub });
        if (existingGoogleUser && existingGoogleUser._id.toString() !== userId) {
            return res.status(400).json({ message: "Tài khoản Google này đã được liên kết với một người dùng khác!" });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });

        user.googleId = sub;
        if (!user.email) user.email = email;
        if (!user.avatar) user.avatar = picture;
        
        await user.save();
        res.json({ success: true, message: "Liên kết Google thành công!", user });
    } catch (error) {
        res.status(400).json({ message: "Liên kết Google thất bại", error: error.message });
    }
});

// Diagnostic route
router.get('/ping', (req, res) => res.json({ message: "API is working", time: new Date() }));

// Theme 4 public content routes
router.get('/theme4/content', theme4Controller.getTheme4Content);
router.get('/theme4/modes', theme4Controller.getTheme4Modes);
router.get('/theme4/modes/:modeId', theme4Controller.getTheme4Mode);

// Telemetry public route
router.post('/telemetry/events', async (req, res) => {
    try {
        const { userId, modeId, eventType, sessionId = '', payload = {} } = req.body || {};
        if (!modeId || !eventType) {
            return res.status(400).json({ success: false, message: 'modeId và eventType là bắt buộc.' });
        }

        const doc = await TelemetryEvent.create({
            userId: userId || null,
            modeId: String(modeId).trim(),
            eventType: String(eventType).trim(),
            sessionId: String(sessionId || '').trim(),
            payload: payload && typeof payload === 'object' ? payload : {},
        });

        return res.json({ success: true, id: doc._id });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

// Đường dẫn cập nhật Avatar
router.patch('/user/update-avatar', upload.single('avatar'), async (req, res) => {
    const userId = req.body.userId;
    console.log("Avatar update requested for userId:", userId);
    
    if (!req.file) {
        return res.status(400).json({ message: "Vui lòng chọn ảnh để tải lên!" });
    }

    try {
        let avatarPath;
        const ext = req.file.originalname.split('.').pop();
        const filename = `avatar-${userId}-${Date.now()}.${ext}`;

        // If running on Vercel or having token, use Vercel Blob
        if (process.env.VERCEL || process.env.BLOB_READ_WRITE_TOKEN) {
            const blob = await put(
                `avatars/${filename}`,
                req.file.buffer,
                {
                    access: 'public',
                    contentType: req.file.mimetype,
                }
            );
            avatarPath = blob.url; // Full public URL from Vercel Blob
        } else {
            // Local fallback
            const uploadDir = path.join(__dirname, '..', 'uploads', 'avatars');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            const localPath = path.join(uploadDir, filename);
            fs.writeFileSync(localPath, req.file.buffer);
            avatarPath = `/uploads/avatars/${filename}`;
        }
        
        const user = await User.findByIdAndUpdate(
            userId, 
            { avatar: avatarPath }, 
            { new: true }
        );

        if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });

        res.json({ success: true, message: "Cập nhật ảnh đại diện thành công!", user });
    } catch (err) {
        console.error("Avatar upload error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Đường dẫn cập nhật thông tin cá nhân
router.patch('/user/update-info', async (req, res) => {
    const { userId, fullName, dateOfBirth, school, province, city } = req.body;
    console.log("Updating info for userId:", userId);
    
    try {
        const updateData = {};
        if (fullName !== undefined) updateData.fullName = fullName;
        if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
        if (school !== undefined) updateData.school = school;
        if (province !== undefined) updateData.province = province;
        if (city !== undefined) updateData.city = city;

        const user = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        );

        if (!user) {
            console.log("User not found for update:", userId);
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        console.log("Update success for:", user.username);
        res.json({ success: true, message: "Cập nhật thông tin thành công!", user });
    } catch (err) {
        console.error("Update-info error:", err);
        res.status(500).json({ error: err.message });
    }
});

// --- ADMIN ROUTES (Được bảo vệ bởi Middleware kiểm tra quyền) ---
router.get('/admin/theme4/content', isAdmin, theme4Controller.getTheme4Content);
router.put('/admin/theme4/content', isAdmin, theme4Controller.replaceTheme4Content);
router.post('/admin/theme4/sync-default', isAdmin, theme4Controller.syncTheme4Defaults);
router.get('/admin/theme4/modes/:modeId/items', isAdmin, theme4Controller.getTheme4ModeItems);
router.post('/admin/theme4/modes/:modeId/items', isAdmin, theme4Controller.createTheme4ModeItem);
router.put('/admin/theme4/modes/:modeId/items/:itemId', isAdmin, theme4Controller.updateTheme4ModeItem);
router.delete('/admin/theme4/modes/:modeId/items/:itemId', isAdmin, theme4Controller.deleteTheme4ModeItem);
router.post('/admin/theme4/uploads/image', isAdmin, upload.single('image'), theme4Controller.uploadTheme4Image);

router.get('/admin/telemetry/summary', isAdmin, async (req, res) => {
    try {
        const days = Math.max(1, Number(req.query.days) || 7);
        const modeId = req.query.modeId ? String(req.query.modeId).trim() : '';
        const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

        const match = { createdAt: { $gte: startDate } };
        if (modeId) match.modeId = modeId;

        const [eventCounts, answerAccuracy, sessionDurations] = await Promise.all([
            TelemetryEvent.aggregate([
                { $match: match },
                {
                    $group: {
                        _id: { modeId: '$modeId', eventType: '$eventType' },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { '_id.modeId': 1, '_id.eventType': 1 } },
            ]),
            TelemetryEvent.aggregate([
                { $match: { ...match, eventType: 'answer_submitted' } },
                {
                    $group: {
                        _id: '$modeId',
                        total: { $sum: 1 },
                        correct: {
                            $sum: {
                                $cond: [{ $eq: ['$payload.correct', true] }, 1, 0],
                            },
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        modeId: '$_id',
                        total: 1,
                        correct: 1,
                        accuracy: {
                            $cond: [
                                { $eq: ['$total', 0] },
                                0,
                                { $round: [{ $multiply: [{ $divide: ['$correct', '$total'] }, 100] }, 2] },
                            ],
                        },
                    },
                },
                { $sort: { modeId: 1 } },
            ]),
            TelemetryEvent.aggregate([
                { $match: { ...match, eventType: 'session_end' } },
                {
                    $group: {
                        _id: '$modeId',
                        sessions: { $sum: 1 },
                        avgDurationMs: { $avg: '$payload.durationMs' },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        modeId: '$_id',
                        sessions: 1,
                        avgDurationMs: { $round: ['$avgDurationMs', 0] },
                    },
                },
                { $sort: { modeId: 1 } },
            ]),
        ]);

        return res.json({
            success: true,
            windowDays: days,
            modeFilter: modeId || null,
            eventCounts,
            answerAccuracy,
            sessionDurations,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

// Thêm mới
router.post('/admin/questions', isAdmin, async (req, res) => {
    try {
        const question = new Question(req.body);
        await question.save();
        res.json({ success: true, question });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Cập nhật
router.put('/admin/questions/:id', isAdmin, async (req, res) => {
    try {
        const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, question });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/admin/lessons', isAdmin, async (req, res) => {
    try {
        const lesson = new Lesson(req.body);
        await lesson.save();
        res.json({ success: true, lesson });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/admin/lessons/:id', isAdmin, async (req, res) => {
    try {
        const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, lesson });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/admin/matching', isAdmin, async (req, res) => {
    try {
        const matching = new Matching(req.body);
        await matching.save();
        res.json({ success: true, matching });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/admin/matching/:id', isAdmin, async (req, res) => {
    try {
        const matching = await Matching.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, matching });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/admin/chronological', isAdmin, async (req, res) => {
    try {
        const chrono = new Chronological(req.body);
        await chrono.save();
        res.json({ success: true, chrono });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/admin/chronological/:id', isAdmin, async (req, res) => {
    try {
        const chrono = await Chronological.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, chrono });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/admin/guess-character', isAdmin, async (req, res) => {
    try {
        const character = new GuessCharacter(req.body);
        await character.save();
        res.json({ success: true, character });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/admin/guess-character/:id', isAdmin, async (req, res) => {
    try {
        const character = await GuessCharacter.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, character });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/admin/reveal-picture', isAdmin, async (req, res) => {
    try {
        const reveal = new RevealPicture(req.body);
        await reveal.save();
        res.json({ success: true, reveal });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/admin/reveal-picture/:id', isAdmin, async (req, res) => {
    try {
        const reveal = await RevealPicture.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, reveal });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Xóa (Admin generic)
router.delete('/admin/:model/:id', isAdmin, async (req, res) => {
    try {
        const modelName = req.params.model; // e.g. 'questions', 'lessons'
        let TargetModel;
        switch(modelName) {
            case 'questions': TargetModel = require('../models/Question'); break;
            case 'lessons': TargetModel = require('../models/Lesson'); break;
            case 'matching': TargetModel = require('../models/Matching'); break;
            case 'chronological': TargetModel = require('../models/Chronological'); break;
            case 'guess-character': TargetModel = require('../models/GuessCharacter'); break;
            case 'reveal-picture': TargetModel = require('../models/RevealPicture'); break;
            default: throw new Error("Model not found");
        }
        await TargetModel.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- CÁC ROUTE CỦA GAME (PUBLIC/USERS) ---
router.get('/lessons', async (req, res) => {
  try {
    const lessons = await Lesson.find().sort({ order: 1 });
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách", error: err });
  }
});

router.get('/leaderboard', async (req, res) => {
  try {
    const topUsers = await User.find().sort({ experience: -1 }).limit(10);
    res.json(topUsers);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy bảng xếp hạng", error: err });
  }
});

router.get('/questions/all', async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: "Lỗi", error: err });
  }
});

router.get('/questions/:lessonId', async (req, res) => {
  try {
    const questions = await Question.find({ lessonId: req.params.lessonId });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: "Lỗi", error: err });
  }
});

router.post('/submit-answer', gameController.checkAnswer);

// User Profile Routes
router.get('/user/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/matching/all', async (req, res) => {
  try {
    const games = await Matching.find();
    if (games.length === 0) {
      const theme4Content = await getTheme4Content();
      return res.json(theme4Content?.gameData?.connectingHistoryRounds || []);
    }
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/chronological/all', async (req, res) => {
    try {
        const Chronological = require('../models/Chronological');
        const data = await Chronological.find();
        if (data.length === 0) {
            const theme4Content = await getTheme4Content();
            const flow = theme4Content?.gameData?.historicalFlowSet;
            return res.json(flow ? [flow] : []);
        }
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/guess-character/all', async (req, res) => {
    try {
        const GuessCharacter = require('../models/GuessCharacter');
        const data = await GuessCharacter.find();
        if (data.length === 0) {
            const theme4Content = await getTheme4Content();
            return res.json(theme4Content?.gameData?.historicalRecognitionItems || []);
        }
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/reveal-picture/all', async (req, res) => {
    try {
        const RevealPicture = require('../models/RevealPicture');
        const data = await RevealPicture.find();
        if (data.length === 0) {
            const theme4Content = await getTheme4Content();
            return res.json(theme4Content?.gameData?.revealPictureSets || []);
        }
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/matching/random', gameController.getRandomMatching);
router.post('/pvp/create', gameController.createPvPChallenge);
router.post('/pvp/submit', gameController.submitPvPResult);
router.get('/pvp/challenges/:userId', gameController.getMyChallenges);
router.get('/pvp/pending', gameController.getPendingChallenges);

// Territory Map Routes
router.get('/territory/questions/:location', gameController.getQuestionsByLocation);
router.post('/territory/unlock', gameController.unlockTerritory);

// User Experience Route
router.post('/user/add-xp', gameController.addExperience);

// New Modes Routes
router.get('/chronological/random', gameController.getRandomChronological);
router.get('/millionaire/random', gameController.getRandomMillionaire);
router.get('/guess-character/random', gameController.getRandomGuessCharacter);
router.get('/reveal-picture/random', gameController.getRandomRevealPicture);

module.exports = router;
