// backend/routes/api.js
const crypto = require('crypto');
const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const path = require('path');
const { OAuth2Client } = require('google-auth-library');
const { put } = require('@vercel/blob');

const router = express.Router();
const gameController = require('../controller/gameController');
const theme4Controller = require('../controllers/theme4Controller');
const Chronological = require('../models/Chronological');
const Classroom = require('../models/Classroom');
const GuessCharacter = require('../models/GuessCharacter');
const Lesson = require('../models/Lesson');
const Matching = require('../models/Matching');
const Question = require('../models/Question');
const RevealPicture = require('../models/RevealPicture');
const TelemetryEvent = require('../models/TelemetryEvent');
const User = require('../models/User');
const {
    isTeacher,
    resolveOptionalUser,
    verifyToken,
} = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { getTheme4Content } = require('../services/theme4ContentService');
const { normalizeRole } = require('../utils/roleUtils');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const SAFE_USER_SELECT =
    '_id username email role fullName dateOfBirth school province city avatar experience streak lastLoginDate createdAt updatedAt';

const CONTENT_MODELS = {
    questions: Question,
    lessons: Lesson,
    matching: Matching,
    chronological: Chronological,
    'guess-character': GuessCharacter,
    'reveal-picture': RevealPicture,
};

const TEACHER_SECRET_CODE =
    process.env.TEACHER_SECRET_CODE ||
    process.env.ADMIN_SECRET_CODE ||
    'HISTORY_ADMIN_2024';

function createHttpError(statusCode, message) {
    return Object.assign(new Error(message), { statusCode });
}

function sendError(res, error) {
    return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Đã xảy ra lỗi.',
    });
}

async function ensureNormalizedUserRole(user) {
    const normalizedRole = normalizeRole(user.role);
    if (user.role !== normalizedRole) {
        user.role = normalizedRole;
        await user.save();
    }
    return normalizedRole;
}

function createAuthToken(user) {
    return jwt.sign(
        { userId: user._id, role: normalizeRole(user.role) },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
}

function safeUserPayload(user, token) {
    const source = user?.toObject ? user.toObject() : (user || {});
    return {
        _id: source._id,
        username: source.username,
        email: source.email || '',
        role: normalizeRole(source.role),
        fullName: source.fullName || '',
        dateOfBirth: source.dateOfBirth || null,
        school: source.school || '',
        province: source.province || '',
        city: source.city || '',
        avatar: source.avatar || null,
        experience: Number(source.experience || 0),
        streak: Number(source.streak || 0),
        lastLoginDate: source.lastLoginDate || null,
        createdAt: source.createdAt || null,
        updatedAt: source.updatedAt || null,
        token,
    };
}

async function createUniqueUsername(email) {
    const baseUsername = String(email || 'hocvien')
        .split('@')[0]
        .replace(/[^a-zA-Z0-9_]/g, '')
        .trim() || 'hocvien';

    let uniqueUsername = baseUsername;
    let counter = 1;

    while (await User.findOne({ username: uniqueUsername })) {
        uniqueUsername = `${baseUsername}${counter}`;
        counter += 1;
    }

    return uniqueUsername;
}

function getRequestedClassroomId(req) {
    return String(
        req.query.classroomId ||
        req.body?.classroomId ||
        req.headers['x-classroom-id'] ||
        ''
    ).trim();
}

function isValidObjectId(value) {
    return Boolean(value) && mongoose.Types.ObjectId.isValid(String(value));
}

function toObjectId(value) {
    return new mongoose.Types.ObjectId(String(value));
}

function buildScopedFilter(classroomId) {
    const globalClauses = [
        { visibilityScope: { $exists: false } },
        { visibilityScope: null },
        { visibilityScope: 'global' },
        { classroomId: null, visibilityScope: { $ne: 'class' } },
    ];

    if (!classroomId) {
        return { $or: globalClauses };
    }

    return {
        $or: [
            ...globalClauses,
            { visibilityScope: 'class', classroomId: toObjectId(classroomId) },
        ],
    };
}

function mergeFilters(baseFilter = {}, scopeFilter = {}) {
    if (!Object.keys(baseFilter).length) return scopeFilter;
    if (!Object.keys(scopeFilter).length) return baseFilter;
    return { $and: [baseFilter, scopeFilter] };
}

async function loadRequestedClassroomAccess(req, options = {}) {
    const classroomId = options.classroomId || getRequestedClassroomId(req);

    if (!classroomId) {
        if (options.required) {
            throw createHttpError(400, 'Vui lòng chọn lớp học trước khi thực hiện thao tác này.');
        }
        return null;
    }

    if (!isValidObjectId(classroomId)) {
        throw createHttpError(400, 'Mã lớp học không hợp lệ.');
    }

    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
        throw createHttpError(404, 'Không tìm thấy lớp học.');
    }

    const user = req.user || await resolveOptionalUser(req);
    const userId = user?._id?.toString() || '';
    const isOwner = Boolean(userId && classroom.teacherId?.toString() === userId);
    const isMember =
        isOwner ||
        (classroom.students || []).some((studentId) => studentId?.toString() === userId);

    if (options.requireMembership && !isMember) {
        throw createHttpError(403, 'Bạn không có quyền truy cập dữ liệu của lớp học này.');
    }

    if (options.requireTeacherOwner && !isOwner) {
        throw createHttpError(403, 'Chỉ giáo viên sở hữu lớp mới được thao tác nội dung này.');
    }

    return {
        classroom,
        classroomId: classroom._id.toString(),
        isOwner,
        isMember,
    };
}

function mapUserSummary(user) {
    if (!user) return null;
    const source = user?.toObject ? user.toObject() : user;
    return {
        _id: source._id,
        username: source.username,
        fullName: source.fullName || '',
        avatar: source.avatar || null,
        role: normalizeRole(source.role),
        school: source.school || '',
        province: source.province || '',
        city: source.city || '',
        experience: Number(source.experience || 0),
    };
}

function mapClassroomSummary(classroom, options = {}) {
    if (!classroom) return null;

    const teacherSource =
        classroom.teacherId && typeof classroom.teacherId === 'object'
            ? classroom.teacherId
            : null;
    const studentSources = Array.isArray(classroom.students)
        ? classroom.students.filter((item) => item && typeof item === 'object')
        : [];

    return {
        _id: classroom._id,
        name: classroom.name,
        description: classroom.description || '',
        teacherId: teacherSource?._id || classroom.teacherId,
        teacher: teacherSource ? mapUserSummary(teacherSource) : null,
        joinCode: classroom.joinCode,
        joinToken: classroom.joinToken,
        joinPath: `/courses?joinToken=${classroom.joinToken}`,
        studentsCount: Array.isArray(classroom.students) ? classroom.students.length : 0,
        createdAt: classroom.createdAt,
        updatedAt: classroom.updatedAt,
        students: options.includeStudents
            ? studentSources.map((student) => mapUserSummary(student))
            : undefined,
    };
}

async function generateUniqueJoinCode() {
    for (let attempt = 0; attempt < 10; attempt += 1) {
        const joinCode = crypto.randomBytes(3).toString('hex').toUpperCase();
        const existing = await Classroom.findOne({ joinCode }).lean();
        if (!existing) return joinCode;
    }

    throw createHttpError(500, 'Không thể tạo mã lớp. Vui lòng thử lại.');
}

async function generateUniqueJoinToken() {
    for (let attempt = 0; attempt < 10; attempt += 1) {
        const joinToken = crypto.randomBytes(16).toString('hex');
        const existing = await Classroom.findOne({ joinToken }).lean();
        if (!existing) return joinToken;
    }

    throw createHttpError(500, 'Không thể tạo liên kết tham gia. Vui lòng thử lại.');
}

function applyClassroomOwnership(body, req, classroomId) {
    return {
        ...body,
        visibilityScope: 'class',
        classroomId: toObjectId(classroomId),
        ownerId: toObjectId(req.userId),
    };
}

async function loadTeacherManagedItem(Model, itemId, req, classroomId) {
    if (!isValidObjectId(itemId)) {
        throw createHttpError(400, 'Mã bản ghi không hợp lệ.');
    }

    const item = await Model.findById(itemId);
    if (!item) {
        throw createHttpError(404, 'Không tìm thấy dữ liệu cần chỉnh sửa.');
    }

    const itemClassroomId = item.classroomId?.toString() || '';
    if (item.visibilityScope !== 'class' || itemClassroomId !== classroomId) {
        throw createHttpError(403, 'Bạn chỉ có thể chỉnh sửa dữ liệu thuộc lớp học của mình.');
    }

    if (item.ownerId && item.ownerId.toString() !== req.userId) {
        throw createHttpError(403, 'Bản ghi này thuộc về giáo viên khác trong lớp học.');
    }

    return item;
}

async function withOptionalClassroomAccess(req, res, next) {
    try {
        const classroomId = getRequestedClassroomId(req);
        if (!classroomId) {
            req.theme4Options = {};
            return next();
        }

        const access = await loadRequestedClassroomAccess(req, {
            requireMembership: true,
        });
        req.classroomAccess = access;
        req.theme4Options = { classroomId: access.classroomId };
        return next();
    } catch (error) {
        return sendError(res, error);
    }
}

async function requireOwnedClassroom(req, res, next) {
    try {
        const access = await loadRequestedClassroomAccess(req, {
            required: true,
            requireTeacherOwner: true,
        });
        req.classroomAccess = access;
        req.theme4Options = {
            classroomId: access.classroomId,
            teacherId: req.userId,
        };
        return next();
    } catch (error) {
        return sendError(res, error);
    }
}

async function fetchScopedRecords(Model, req, baseFilter = {}, sort = {}) {
    const classroomId = getRequestedClassroomId(req);
    if (classroomId) {
        await loadRequestedClassroomAccess(req, { requireMembership: true });
    }

    const filter = mergeFilters(baseFilter, buildScopedFilter(classroomId));
    return Model.find(filter).sort(sort);
}

router.post('/google-login', async (req, res) => {
    const { tokenId } = req.body || {};
    if (!tokenId) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu thông tin xác thực Google.',
        });
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { sub, email, name, picture } = payload;

        let user = await User.findOne({ $or: [{ googleId: sub }, { email }] });

        if (!user) {
            user = new User({
                username: await createUniqueUsername(email),
                email,
                googleId: sub,
                fullName: name || '',
                avatar: picture || null,
                role: 'student',
            });
            await user.save();
        } else {
            user.googleId = sub;
            if (!user.avatar) user.avatar = picture || null;
            if (!user.fullName && name) user.fullName = name;
            await ensureNormalizedUserRole(user);
            await user.save();
        }

        const role = await ensureNormalizedUserRole(user);
        const token = createAuthToken({ ...user.toObject(), role });

        return res.json(safeUserPayload({ ...user.toObject(), role }, token));
    } catch (error) {
        console.error('Google Login Error:', error);
        return res.status(400).json({
            success: false,
            message: 'Xác thực Google thất bại',
        });
    }
});

router.post('/register', async (req, res) => {
  const {
    username,
    password,
    email,
    role,
    teacherCode,
    fullName,
    dateOfBirth,
    school,
    province,
    city,
  } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng điền đầy đủ thông tin!',
    });
  }

  try {
    const safeEmail = email && email.trim() !== '' ? email.trim() : undefined;
    const normalizedRole = normalizeRole(role);

    if (normalizedRole === 'teacher') {
      if (!teacherCode || !String(teacherCode).trim()) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng nhập mã giáo viên để đăng ký tài khoản giáo viên.',
        });
      }

      if (String(teacherCode).trim() !== TEACHER_SECRET_CODE) {
        return res.status(400).json({
          success: false,
          message: 'Mã giáo viên không hợp lệ.',
        });
      }
    }

    const orConditions = [{ username: username.trim() }];
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

    const user = new User({ 
      username: username.trim(), 
      password, 
      email: safeEmail,
      role: normalizedRole,
      fullName: fullName || '',
      dateOfBirth: dateOfBirth || null,
      school: school || '',
      province: province || '',
      city: city || ''
    });

    await user.save();
    res.json({ success: true, message: "Đăng ký thành công!", role: normalizedRole });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Lỗi đăng ký', error: err.message || 'Unknown error' });
  }
});

// Đường dẫn đăng nhập
router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin!' });
  }

  try {
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

    const role = await ensureNormalizedUserRole(user);
    const token = createAuthToken({ ...user.toObject(), role });
    res.json(safeUserPayload({ ...user.toObject(), role }, token));
  } catch (err) {
    console.error('Login error:', err);
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
        await ensureNormalizedUserRole(user);
        await user.save();
        res.json({
            success: true,
            message: "Liên kết Google thành công!",
            user: safeUserPayload(user),
        });
    } catch (error) {
        res.status(400).json({ message: "Liên kết Google thất bại", error: error.message });
    }
});

// Diagnostic route
router.get('/ping', (req, res) => res.json({ message: "API is working", time: new Date() }));

// Theme 4 public content routes
router.get('/theme4/content', withOptionalClassroomAccess, theme4Controller.getTheme4Content);
router.get('/theme4/modes', withOptionalClassroomAccess, theme4Controller.getTheme4Modes);
router.get('/theme4/modes/:modeId', withOptionalClassroomAccess, theme4Controller.getTheme4Mode);

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

        await ensureNormalizedUserRole(user);
        res.json({
            success: true,
            message: "Cập nhật ảnh đại diện thành công!",
            user: safeUserPayload(user),
        });
    } catch (err) {
        console.error("Avatar upload error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Đường dẫn cập nhật thông tin cá nhân
router.patch('/user/update-info', async (req, res) => {
    const { userId, fullName, email, dateOfBirth, school, province, city } = req.body;
    console.log("Updating info for userId:", userId);
    
    try {
        const updateData = {};
        if (fullName !== undefined) updateData.fullName = fullName;
        if (email !== undefined) updateData.email = email;
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
        await ensureNormalizedUserRole(user);
        res.json({
            success: true,
            message: "Cập nhật thông tin thành công!",
            user: safeUserPayload(user),
        });
    } catch (err) {
        console.error("Update-info error:", err);
        res.status(500).json({ error: err.message });
    }
});

router.post('/classrooms', isTeacher, async (req, res) => {
    try {
        const { name, description = '' } = req.body || {};
        if (!name || !String(name).trim()) {
            return res.status(400).json({
                success: false,
                message: 'Tên lớp học là bắt buộc.',
            });
        }

        const classroom = await Classroom.create({
            name: String(name).trim(),
            description: String(description || '').trim(),
            teacherId: req.user._id,
            students: [],
            joinCode: await generateUniqueJoinCode(),
            joinToken: await generateUniqueJoinToken(),
        });

        const populated = await Classroom.findById(classroom._id)
            .populate('teacherId', SAFE_USER_SELECT)
            .populate('students', SAFE_USER_SELECT);

        return res.json({
            success: true,
            classroom: mapClassroomSummary(populated, { includeStudents: true }),
        });
    } catch (error) {
        return sendError(res, error);
    }
});

router.get('/classrooms/my', verifyToken, async (req, res) => {
    try {
        const [owned, joined] = await Promise.all([
            Classroom.find({ teacherId: req.user._id })
                .sort({ createdAt: -1 })
                .populate('teacherId', SAFE_USER_SELECT)
                .populate('students', SAFE_USER_SELECT),
            Classroom.find({ students: req.user._id })
                .sort({ createdAt: -1 })
                .populate('teacherId', SAFE_USER_SELECT)
                .populate('students', SAFE_USER_SELECT),
        ]);

        const ownedIds = new Set(owned.map((classroom) => classroom._id.toString()));
        const all = [
            ...owned,
            ...joined.filter((classroom) => !ownedIds.has(classroom._id.toString())),
        ];

        return res.json({
            success: true,
            owned: owned.map((classroom) =>
                mapClassroomSummary(classroom, { includeStudents: true })
            ),
            joined: joined.map((classroom) =>
                mapClassroomSummary(classroom, { includeStudents: true })
            ),
            all: all.map((classroom) =>
                mapClassroomSummary(classroom, { includeStudents: true })
            ),
        });
    } catch (error) {
        return sendError(res, error);
    }
});

router.get('/classrooms/join/:token', async (req, res) => {
    try {
        const classroom = await Classroom.findOne({
            joinToken: String(req.params.token || '').trim(),
        }).populate('teacherId', SAFE_USER_SELECT);

        if (!classroom) {
            return res.status(404).json({
                success: false,
                message: 'Liên kết lớp học không tồn tại hoặc đã hết hạn.',
            });
        }

        return res.json({
            success: true,
            classroom: {
                _id: classroom._id,
                name: classroom.name,
                description: classroom.description || '',
                joinCode: classroom.joinCode,
                teacher: mapUserSummary(classroom.teacherId),
            },
        });
    } catch (error) {
        return sendError(res, error);
    }
});

router.post('/classrooms/join', verifyToken, async (req, res) => {
    try {
        const joinCode = String(req.body?.joinCode || '').trim().toUpperCase();
        const joinToken = String(req.body?.joinToken || '').trim();

        if (!joinCode && !joinToken) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập mã lớp hoặc đường link tham gia.',
            });
        }

        const classroom = await Classroom.findOne(
            joinToken ? { joinToken } : { joinCode }
        )
            .populate('teacherId', SAFE_USER_SELECT)
            .populate('students', SAFE_USER_SELECT);

        if (!classroom) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy lớp học tương ứng.',
            });
        }

        const userId = req.user._id.toString();
        const isOwner = classroom.teacherId?._id?.toString() === userId;
        const alreadyJoined = classroom.students.some(
            (student) => student._id?.toString() === userId
        );

        if (!isOwner && !alreadyJoined) {
            await Classroom.updateOne(
                { _id: classroom._id },
                { $addToSet: { students: req.user._id } }
            );
        }

        const refreshed = await Classroom.findById(classroom._id)
            .populate('teacherId', SAFE_USER_SELECT)
            .populate('students', SAFE_USER_SELECT);

        return res.json({
            success: true,
            classroom: mapClassroomSummary(refreshed, { includeStudents: true }),
        });
    } catch (error) {
        return sendError(res, error);
    }
});

router.get('/classrooms/:id', verifyToken, async (req, res) => {
    try {
        const access = await loadRequestedClassroomAccess(req, {
            classroomId: req.params.id,
            requireMembership: true,
        });
        const classroom = await Classroom.findById(access.classroom._id)
            .populate('teacherId', SAFE_USER_SELECT)
            .populate('students', SAFE_USER_SELECT);

        return res.json({
            success: true,
            classroom: mapClassroomSummary(classroom, { includeStudents: true }),
        });
    } catch (error) {
        return sendError(res, error);
    }
});

router.get('/classrooms/:id/leaderboard', verifyToken, async (req, res) => {
    try {
        const access = await loadRequestedClassroomAccess(req, {
            classroomId: req.params.id,
            requireMembership: true,
        });

        const classroom = await Classroom.findById(access.classroom._id)
            .populate({
                path: 'students',
                select: SAFE_USER_SELECT,
                options: { sort: { experience: -1, updatedAt: 1 } },
            })
            .populate('teacherId', SAFE_USER_SELECT);

        const users = (classroom.students || [])
            .map((student) => mapUserSummary(student))
            .sort((left, right) => right.experience - left.experience);

        return res.json({
            success: true,
            classroom: mapClassroomSummary(classroom),
            users,
        });
    } catch (error) {
        return sendError(res, error);
    }
});

// --- TEACHER ROUTES ---
['/teacher/theme4', '/admin/theme4'].forEach((prefix) => {
    router.get(`${prefix}/content`, isTeacher, requireOwnedClassroom, theme4Controller.getTheme4Content);
    router.put(`${prefix}/content`, isTeacher, requireOwnedClassroom, theme4Controller.replaceTheme4Content);
    router.post(`${prefix}/sync-default`, isTeacher, requireOwnedClassroom, theme4Controller.syncTheme4Defaults);
    router.get(`${prefix}/modes/:modeId/items`, isTeacher, requireOwnedClassroom, theme4Controller.getTheme4ModeItems);
    router.post(`${prefix}/modes/:modeId/items`, isTeacher, requireOwnedClassroom, theme4Controller.createTheme4ModeItem);
    router.put(`${prefix}/modes/:modeId/items/:itemId`, isTeacher, requireOwnedClassroom, theme4Controller.updateTheme4ModeItem);
    router.delete(`${prefix}/modes/:modeId/items/:itemId`, isTeacher, requireOwnedClassroom, theme4Controller.deleteTheme4ModeItem);
    router.post(
        `${prefix}/uploads/image`,
        isTeacher,
        requireOwnedClassroom,
        upload.single('image'),
        theme4Controller.uploadTheme4Image
    );
});

router.get('/teacher/telemetry/summary', isTeacher, async (req, res) => {
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

router.get('/admin/telemetry/summary', isTeacher, async (req, res) => {
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

['/teacher', '/admin'].forEach((prefix) => {
    router.post(`${prefix}/questions`, isTeacher, requireOwnedClassroom, async (req, res) => {
        try {
            const question = await Question.create(
                applyClassroomOwnership(req.body || {}, req, req.classroomAccess.classroomId)
            );
            return res.json({ success: true, question });
        } catch (error) {
            return sendError(res, error);
        }
    });

    router.put(`${prefix}/questions/:id`, isTeacher, requireOwnedClassroom, async (req, res) => {
        try {
            await loadTeacherManagedItem(
                Question,
                req.params.id,
                req,
                req.classroomAccess.classroomId
            );
            const question = await Question.findByIdAndUpdate(
                req.params.id,
                applyClassroomOwnership(req.body || {}, req, req.classroomAccess.classroomId),
                { new: true }
            );
            return res.json({ success: true, question });
        } catch (error) {
            return sendError(res, error);
        }
    });

    router.post(`${prefix}/lessons`, isTeacher, requireOwnedClassroom, async (req, res) => {
        try {
            const lesson = await Lesson.create(
                applyClassroomOwnership(req.body || {}, req, req.classroomAccess.classroomId)
            );
            return res.json({ success: true, lesson });
        } catch (error) {
            return sendError(res, error);
        }
    });

    router.put(`${prefix}/lessons/:id`, isTeacher, requireOwnedClassroom, async (req, res) => {
        try {
            await loadTeacherManagedItem(
                Lesson,
                req.params.id,
                req,
                req.classroomAccess.classroomId
            );
            const lesson = await Lesson.findByIdAndUpdate(
                req.params.id,
                applyClassroomOwnership(req.body || {}, req, req.classroomAccess.classroomId),
                { new: true }
            );
            return res.json({ success: true, lesson });
        } catch (error) {
            return sendError(res, error);
        }
    });

    router.post(`${prefix}/matching`, isTeacher, requireOwnedClassroom, async (req, res) => {
        try {
            const matching = await Matching.create(
                applyClassroomOwnership(req.body || {}, req, req.classroomAccess.classroomId)
            );
            return res.json({ success: true, matching });
        } catch (error) {
            return sendError(res, error);
        }
    });

    router.put(`${prefix}/matching/:id`, isTeacher, requireOwnedClassroom, async (req, res) => {
        try {
            await loadTeacherManagedItem(
                Matching,
                req.params.id,
                req,
                req.classroomAccess.classroomId
            );
            const matching = await Matching.findByIdAndUpdate(
                req.params.id,
                applyClassroomOwnership(req.body || {}, req, req.classroomAccess.classroomId),
                { new: true }
            );
            return res.json({ success: true, matching });
        } catch (error) {
            return sendError(res, error);
        }
    });

    router.post(`${prefix}/chronological`, isTeacher, requireOwnedClassroom, async (req, res) => {
        try {
            const chrono = await Chronological.create(
                applyClassroomOwnership(req.body || {}, req, req.classroomAccess.classroomId)
            );
            return res.json({ success: true, chrono });
        } catch (error) {
            return sendError(res, error);
        }
    });

    router.put(`${prefix}/chronological/:id`, isTeacher, requireOwnedClassroom, async (req, res) => {
        try {
            await loadTeacherManagedItem(
                Chronological,
                req.params.id,
                req,
                req.classroomAccess.classroomId
            );
            const chrono = await Chronological.findByIdAndUpdate(
                req.params.id,
                applyClassroomOwnership(req.body || {}, req, req.classroomAccess.classroomId),
                { new: true }
            );
            return res.json({ success: true, chrono });
        } catch (error) {
            return sendError(res, error);
        }
    });

    router.post(`${prefix}/guess-character`, isTeacher, requireOwnedClassroom, async (req, res) => {
        try {
            const character = await GuessCharacter.create(
                applyClassroomOwnership(req.body || {}, req, req.classroomAccess.classroomId)
            );
            return res.json({ success: true, character });
        } catch (error) {
            return sendError(res, error);
        }
    });

    router.put(`${prefix}/guess-character/:id`, isTeacher, requireOwnedClassroom, async (req, res) => {
        try {
            await loadTeacherManagedItem(
                GuessCharacter,
                req.params.id,
                req,
                req.classroomAccess.classroomId
            );
            const character = await GuessCharacter.findByIdAndUpdate(
                req.params.id,
                applyClassroomOwnership(req.body || {}, req, req.classroomAccess.classroomId),
                { new: true }
            );
            return res.json({ success: true, character });
        } catch (error) {
            return sendError(res, error);
        }
    });

    router.post(`${prefix}/reveal-picture`, isTeacher, requireOwnedClassroom, async (req, res) => {
        try {
            const reveal = await RevealPicture.create(
                applyClassroomOwnership(req.body || {}, req, req.classroomAccess.classroomId)
            );
            return res.json({ success: true, reveal });
        } catch (error) {
            return sendError(res, error);
        }
    });

    router.put(`${prefix}/reveal-picture/:id`, isTeacher, requireOwnedClassroom, async (req, res) => {
        try {
            await loadTeacherManagedItem(
                RevealPicture,
                req.params.id,
                req,
                req.classroomAccess.classroomId
            );
            const reveal = await RevealPicture.findByIdAndUpdate(
                req.params.id,
                applyClassroomOwnership(req.body || {}, req, req.classroomAccess.classroomId),
                { new: true }
            );
            return res.json({ success: true, reveal });
        } catch (error) {
            return sendError(res, error);
        }
    });

    router.delete(`${prefix}/:model/:id`, isTeacher, requireOwnedClassroom, async (req, res) => {
        try {
            const TargetModel = CONTENT_MODELS[req.params.model];
            if (!TargetModel) {
                throw createHttpError(404, 'Loại dữ liệu không tồn tại.');
            }

            await loadTeacherManagedItem(
                TargetModel,
                req.params.id,
                req,
                req.classroomAccess.classroomId
            );
            await TargetModel.findByIdAndDelete(req.params.id);

            return res.json({ success: true });
        } catch (error) {
            return sendError(res, error);
        }
    });
});

// --- CÁC ROUTE CỦA GAME (PUBLIC/USERS) ---
router.get('/lessons', async (req, res) => {
  try {
    const lessons = await fetchScopedRecords(Lesson, req, {}, { order: 1, createdAt: 1 });
    res.json(lessons);
  } catch (error) {
    return sendError(res, error);
  }
});

router.get('/leaderboard', async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 50));
    const topUsers = await User.find()
      .select(SAFE_USER_SELECT)
      .sort({ experience: -1, updatedAt: 1 })
      .limit(limit);
    res.json(topUsers.map((user) => safeUserPayload(user)));
  } catch (error) {
    return sendError(res, error);
  }
});

router.get('/questions/all', async (req, res) => {
  try {
    const questions = await fetchScopedRecords(Question, req, {}, { createdAt: -1 });
    res.json(questions);
  } catch (error) {
    return sendError(res, error);
  }
});

router.get('/questions/:lessonId', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.lessonId)) {
        return res.json([]);
    }

    const questions = await fetchScopedRecords(
        Question,
        req,
        { lessonId: toObjectId(req.params.lessonId) },
        { createdAt: -1 }
    );
    res.json(questions);
  } catch (error) {
    return sendError(res, error);
  }
});

router.post('/submit-answer', gameController.checkAnswer);

// User Profile Routes
router.get('/user/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select(SAFE_USER_SELECT);
        if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });
        res.json(safeUserPayload(user));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/matching/all', async (req, res) => {
  try {
    const classroomId = getRequestedClassroomId(req);
    const games = await fetchScopedRecords(Matching, req, {}, { createdAt: -1 });
    if (games.length === 0) {
      const theme4Content = await getTheme4Content(
        classroomId ? { classroomId } : {}
      );
      return res.json(theme4Content?.gameData?.connectingHistoryRounds || []);
    }
    res.json(games);
  } catch (error) {
    return sendError(res, error);
  }
});

router.get('/chronological/all', async (req, res) => {
    try {
        const classroomId = getRequestedClassroomId(req);
        const data = await fetchScopedRecords(Chronological, req, {}, { createdAt: -1 });
        if (data.length === 0) {
            const theme4Content = await getTheme4Content(
                classroomId ? { classroomId } : {}
            );
            const flows = Array.isArray(theme4Content?.gameData?.historicalFlowSets)
                ? theme4Content.gameData.historicalFlowSets
                : theme4Content?.gameData?.historicalFlowSet
                    ? [theme4Content.gameData.historicalFlowSet]
                    : [];
            return res.json(flows);
        }
        res.json(data);
    } catch (error) {
        return sendError(res, error);
    }
});

router.get('/guess-character/all', async (req, res) => {
    try {
        const classroomId = getRequestedClassroomId(req);
        const data = await fetchScopedRecords(GuessCharacter, req, {}, { createdAt: -1 });
        if (data.length === 0) {
            const theme4Content = await getTheme4Content(
                classroomId ? { classroomId } : {}
            );
            return res.json(theme4Content?.gameData?.historicalRecognitionItems || []);
        }
        res.json(data);
    } catch (error) {
        return sendError(res, error);
    }
});

router.get('/reveal-picture/all', async (req, res) => {
    try {
        const classroomId = getRequestedClassroomId(req);
        const data = await fetchScopedRecords(RevealPicture, req, {}, { createdAt: -1 });
        if (data.length === 0) {
            const theme4Content = await getTheme4Content(
                classroomId ? { classroomId } : {}
            );
            return res.json(theme4Content?.gameData?.revealPictureSets || []);
        }
        res.json(data);
    } catch (error) {
        return sendError(res, error);
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
