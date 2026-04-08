const express = require('express');
const { isTeacher, verifyToken } = require('../middleware/authMiddleware');
const Classroom = require('../models/Classroom');
const crypto = require('crypto');
const mongoose = require('mongoose');
const { normalizeRole } = require('../utils/roleUtils');

const router = express.Router();

const SAFE_USER_SELECT = '_id username email role fullName dateOfBirth school province city avatar experience lastLoginDate createdAt updatedAt';

function toObjectId(value) {
    return new mongoose.Types.ObjectId(String(value));
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
    throw new Error('Không thể tạo mã lớp. Vui lòng thử lại.');
}

async function generateUniqueJoinToken() {
    for (let attempt = 0; attempt < 10; attempt += 1) {
        const joinToken = crypto.randomBytes(16).toString('hex');
        const existing = await Classroom.findOne({ joinToken }).lean();
        if (!existing) return joinToken;
    }
    throw new Error('Không thể tạo liên kết tham gia. Vui lòng thử lại.');
}

function sendError(res, error) {
    return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Đã xảy ra lỗi.',
    });
}

router.post('/', isTeacher, async (req, res) => {
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

router.get('/my', verifyToken, async (req, res) => {
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
            owned: owned.map((classroom) => mapClassroomSummary(classroom, { includeStudents: true })),
            joined: joined.map((classroom) => mapClassroomSummary(classroom, { includeStudents: true })),
            all: all.map((classroom) => mapClassroomSummary(classroom, { includeStudents: true })),
        });
    } catch (error) {
        return sendError(res, error);
    }
});

router.get('/join/:token', async (req, res) => {
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

router.post('/join', verifyToken, async (req, res) => {
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
        const teacherId = classroom.teacherId?._id?.toString() || classroom.teacherId?.toString();

        if (teacherId === userId) {
            return res.status(400).json({
                success: false,
                message: 'Bạn là giáo viên của lớp học này.',
            });
        }

        const isAlreadyJoined = classroom.students.some(
            (student) => (student?._id?.toString() || student.toString()) === userId
        );

        if (isAlreadyJoined) {
            return res.status(400).json({
                success: false,
                message: 'Bạn đã tham gia lớp học này rồi.',
            });
        }

        classroom.students.push(req.user._id);
        await classroom.save();

        const updatedClassroom = await Classroom.findById(classroom._id)
            .populate('teacherId', SAFE_USER_SELECT)
            .populate('students', SAFE_USER_SELECT);

        return res.json({
            success: true,
            message: 'Tham gia lớp học thành công!',
            classroom: mapClassroomSummary(updatedClassroom, { includeStudents: true }),
        });
    } catch (error) {
        return sendError(res, error);
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    try {
        const classroom = await Classroom.findById(req.params.id)
            .populate('teacherId', SAFE_USER_SELECT)
            .populate('students', SAFE_USER_SELECT);

        if (!classroom) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy lớp học.',
            });
        }

        const userId = req.user._id.toString();
        const teacherId = classroom.teacherId?._id?.toString() || classroom.teacherId?.toString();
        const isStudent = classroom.students.some(
            (student) => (student?._id?.toString() || student.toString()) === userId
        );

        if (teacherId !== userId && !isStudent) {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền truy cập lớp học này.',
            });
        }

        return res.json({
            success: true,
            classroom: mapClassroomSummary(classroom, { includeStudents: true }),
        });
    } catch (error) {
        return sendError(res, error);
    }
});

router.put('/:id', isTeacher, async (req, res) => {
    try {
        const { name, description } = req.body || {};
        const classroom = await Classroom.findOne({
            _id: req.params.id,
            teacherId: req.user._id,
        });

        if (!classroom) {
            return res.status(404).json({
                success: false,
                message: 'Lớp học không tồn tại hoặc bạn không có quyền sở hữu.',
            });
        }

        if (name && String(name).trim()) {
            classroom.name = String(name).trim();
        }
        if (description !== undefined) {
            classroom.description = String(description).trim();
        }

        await classroom.save();

        const populated = await Classroom.findById(classroom._id)
            .populate('teacherId', SAFE_USER_SELECT)
            .populate('students', SAFE_USER_SELECT);

        return res.json({
            success: true,
            message: 'Cập nhật thông tin lớp học thành công.',
            classroom: mapClassroomSummary(populated, { includeStudents: true }),
        });
    } catch (error) {
        return sendError(res, error);
    }
});

router.delete('/:id', isTeacher, async (req, res) => {
    try {
        const classroom = await Classroom.findOne({
            _id: req.params.id,
            teacherId: req.user._id,
        });

        if (!classroom) {
            return res.status(404).json({
                success: false,
                message: 'Lớp học không tồn tại hoặc bạn không có quyền xóa.',
            });
        }

        await require('../models/Score').deleteMany({ classroomId: classroom._id });
        const CONTENT_MODELS = {
            questions: require('../models/Question'),
            lessons: require('../models/Lesson'),
            matching: require('../models/Matching'),
            chronological: require('../models/Chronological'),
            'guess-character': require('../models/GuessCharacter'),
            'reveal-picture': require('../models/RevealPicture'),
        };

        for (const Model of Object.values(CONTENT_MODELS)) {
            await Model.deleteMany({ classroomId: classroom._id, visibilityScope: 'class' });
        }

        await Classroom.findByIdAndDelete(classroom._id);

        return res.json({
            success: true,
            message: 'Xóa lớp học và toàn bộ dữ liệu liên quan thành công.',
        });
    } catch (error) {
        return sendError(res, error);
    }
});

module.exports = router;
