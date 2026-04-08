const express = require('express');
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');
const upload = require('../middleware/uploadMiddleware');
const { verifyToken } = require('../middleware/authMiddleware');
const { normalizeRole } = require('../utils/roleUtils');
const { put } = require('@vercel/blob');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function safeUserPayload(user) {
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
        lastLoginDate: source.lastLoginDate || null,
        createdAt: source.createdAt || null,
        updatedAt: source.updatedAt || null,
    };
}

async function ensureNormalizedUserRole(user) {
    const normalizedRole = normalizeRole(user.role);
    if (user.role !== normalizedRole) {
        user.role = normalizedRole;
        await user.save();
    }
    return normalizedRole;
}

const SAFE_USER_SELECT = '_id username email role fullName dateOfBirth school province city avatar experience lastLoginDate createdAt updatedAt';

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select(SAFE_USER_SELECT);
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }
        res.json(user);
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ error: err.message });
    }
});

router.patch('/change-password', verifyToken, async (req, res) => {
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

router.post('/link-google', async (req, res) => {
    const { userId, tokenId } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { sub, email, picture } = payload;

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

router.patch('/update-avatar', verifyToken, upload.single('avatar'), async (req, res) => {
    const userId = req.body.userId;
    
    if (!req.file) {
        return res.status(400).json({ message: "Vui lòng chọn ảnh để tải lên!" });
    }

    try {
        let avatarPath;
        const ext = req.file.originalname.split('.').pop();
        const filename = `avatar-${userId}-${Date.now()}.${ext}`;

        if (process.env.VERCEL || process.env.BLOB_READ_WRITE_TOKEN) {
            const blob = await put(`avatars/${filename}`, req.file.buffer, { 
                access: 'public',
                contentType: req.file.mimetype 
            });
            avatarPath = blob.url;
        } else {
            const uploadDir = path.join(__dirname, '..', 'uploads', 'avatars');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            const localPath = path.join(uploadDir, filename);
            fs.writeFileSync(localPath, req.file.buffer);
            avatarPath = `/uploads/avatars/${filename}`;
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });

        user.avatar = avatarPath;
        await user.save();
        res.json({ success: true, avatar: avatarPath });
    } catch (err) {
        console.error('Lỗi khi tải ảnh(Vercel Blob):', err);
        res.status(500).json({ error: err.message });
    }
});

router.patch('/update-info', verifyToken, async (req, res) => {
    const { userId, email, fullName, dateOfBirth, school, province, city } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });

        if (email !== undefined) user.email = email;
        if (fullName !== undefined) user.fullName = fullName;
        if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
        if (school !== undefined) user.school = school;
        if (province !== undefined) user.province = province;
        if (city !== undefined) user.city = city;

        await ensureNormalizedUserRole(user);
        await user.save();
        res.json({ success: true, message: "Cập nhật thông tin thành công!", user: safeUserPayload(user) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update XP
router.post('/update-xp', verifyToken, async (req, res) => {
    try {
        const { userId, xp } = req.body;
        if (!userId || xp === undefined) {
            return res.status(400).json({ success: false, message: "Thiếu tham số" });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "Ngưi dùng không tn tại" });

        user.experience = (user.experience || 0) + Number(xp);
        
        // Remove streak completely
        await ensureNormalizedUserRole(user);
        await user.save();

        res.json({ success: true, experience: user.experience });
    } catch (err) {
        console.error("XP Error:", err);
        res.status(500).json({ success: false, message: "Lỗi cập nhật XP" });
    }
});

module.exports = router;
