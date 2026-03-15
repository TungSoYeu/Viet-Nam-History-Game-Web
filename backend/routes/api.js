// backend/routes/api.js
const express = require('express');
const router = express.Router();
const gameController = require('../controller/gameController');

const Lesson = require('../models/Lesson');
const Question = require('../models/Question');
const User = require('../models/User');
const Matching = require('../models/Matching');
const Chronological = require('../models/Chronological');
const GuessCharacter = require('../models/GuessCharacter');
const RevealPicture = require('../models/RevealPicture');
const { isAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Mã bí mật để tạo tài khoản Admin (Bạn có thể đổi mã này thành bất kỳ chuỗi nào)
const ADMIN_SECRET_CODE = "HISTORY_ADMIN_2024"; 

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

        res.json({
            _id: user._id,
            username: user.username,
            role: user.role,
            fullName: user.fullName,
            avatar: user.avatar
        });
    } catch (error) {
        console.error("Google Login Error:", error);
        res.status(400).json({ message: "Xác thực Google thất bại" });
    }
});

router.post('/register', async (req, res) => {
  const { username, password, adminCode, fullName, dateOfBirth, school, province, city } = req.body;
  console.log("Registering user:", username);
  
  if (!username || !password) return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin!" });

  try {
    let existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "Tên đăng nhập đã tồn tại!" });

    // Phân quyền rõ ràng trước khi lưu vào Database
    let role = 'user';
    if (adminCode) {
        if (adminCode === ADMIN_SECRET_CODE) {
            role = 'admin';
        } else {
            return res.status(400).json({ message: "Mã Quản trị viên không hợp lệ!" });
        }
    }

    // Lưu vào database với role đã được xác định
    const user = new User({ 
      username, 
      password, 
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
    res.status(500).json({ message: "Lỗi khi đăng ký", error: err.message });
  }
});

// Đường dẫn đăng nhập
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log("Login attempt:", username);
  
  if (!username || !password) return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Tên đăng nhập không tồn tại!" });
    }
    
    if (user.password !== password) {
      return res.status(401).json({ message: "Mật khẩu không chính xác!" });
    }

    console.log("Login successful:", user.username);
    res.json(user);
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
        
        if (user.password !== oldPassword) {
            return res.status(400).json({ message: "Mật khẩu cũ không chính xác" });
        }
        
        user.password = newPassword;
        await user.save();
        res.json({ success: true, message: "Đổi mật khẩu thành công" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Diagnostic route
router.get('/ping', (req, res) => res.json({ message: "API is working", time: new Date() }));

// Đường dẫn cập nhật Avatar
router.patch('/user/update-avatar', upload.single('avatar'), async (req, res) => {
    const userId = req.body.userId;
    console.log("Avatar update requested for userId:", userId);
    
    if (!req.file) {
        return res.status(400).json({ message: "Vui lòng chọn ảnh để tải lên!" });
    }

    try {
        const avatarPath = `/uploads/avatars/${req.file.filename}`;
        const user = await User.findByIdAndUpdate(
            userId, 
            { avatar: avatarPath }, 
            { new: true }
        );

        if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });

        res.json({ success: true, message: "Cập nhật ảnh đại diện thành công!", user });
    } catch (err) {
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
        const Chronological = require('../models/Chronological');
        const chrono = new Chronological(req.body);
        await chrono.save();
        res.json({ success: true, chrono });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/admin/chronological/:id', isAdmin, async (req, res) => {
    try {
        const Chronological = require('../models/Chronological');
        const chrono = await Chronological.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, chrono });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/admin/guess-character', isAdmin, async (req, res) => {
    try {
        const GuessCharacter = require('../models/GuessCharacter');
        const character = new GuessCharacter(req.body);
        await character.save();
        res.json({ success: true, character });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/admin/guess-character/:id', isAdmin, async (req, res) => {
    try {
        const GuessCharacter = require('../models/GuessCharacter');
        const character = await GuessCharacter.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, character });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/admin/reveal-picture', isAdmin, async (req, res) => {
    try {
        const RevealPicture = require('../models/RevealPicture');
        const reveal = new RevealPicture(req.body);
        await reveal.save();
        res.json({ success: true, reveal });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/admin/reveal-picture/:id', isAdmin, async (req, res) => {
    try {
        const RevealPicture = require('../models/RevealPicture');
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
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/chronological/all', async (req, res) => {
    try {
        const Chronological = require('../models/Chronological');
        const data = await Chronological.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/guess-character/all', async (req, res) => {
    try {
        const GuessCharacter = require('../models/GuessCharacter');
        const data = await GuessCharacter.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/reveal-picture/all', async (req, res) => {
    try {
        const RevealPicture = require('../models/RevealPicture');
        const data = await RevealPicture.find();
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