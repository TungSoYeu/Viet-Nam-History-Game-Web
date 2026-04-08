const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { normalizeRole } = require('../utils/roleUtils');

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const TEACHER_SECRET_CODE =
    process.env.TEACHER_SECRET_CODE ||
    process.env.ADMIN_SECRET_CODE ||
    'HISTORY_ADMIN_2024';

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
        lastLoginDate: source.lastLoginDate || null,
        createdAt: source.createdAt || null,
        updatedAt: source.updatedAt || null,
        token,
    };
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
      fullName: fullName ? fullName.trim() : '',
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      school: school ? school.trim() : '',
      province: province ? province.trim() : '',
      city: city ? city.trim() : '',
    });
    
    await user.save();
    return res.status(201).json({ success: true, message: "Đăng ký thành công!" });
  } catch (err) {
    console.error("Register err:", err);
    return res.status(500).json({ success: false, message: "Lỗi hệ thống đăng ký.", error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin đăng nhập." });
  }

  try {
      const user = await User.findOne({ username: username.trim() });
      if (!user) {
          return res.status(400).json({ success: false, message: "Tên đăng nhập không tồn tại!" });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
          return res.status(400).json({ success: false, message: "Mật khẩu không đúng!" });
      }

      const role = await ensureNormalizedUserRole(user);
      const token = createAuthToken({ ...user.toObject(), role });

      user.lastLoginDate = new Date();
      await user.save();

      return res.json(safeUserPayload({ ...user.toObject(), role }, token));
  } catch (err) {
      console.error("Login Error:", err);
      return res.status(500).json({ success: false, message: "Lỗi hệ thống đăng nhập." });
  }
});

module.exports = router;
