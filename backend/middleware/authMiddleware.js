// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// General auth middleware: verifies JWT and attaches userId to req
exports.verifyToken = (req, res, next) => {
    // Support both 'Authorization: Bearer <token>' header and legacy 'user-id' header
    const authHeader = req.headers['authorization'];
    const legacyUserId = req.headers['user-id'];

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decoded.userId;
            req.userRole = decoded.role;
            return next();
        } catch (err) {
            return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
        }
    }

    // Fallback: accept legacy user-id header for backward compatibility
    if (legacyUserId) {
        req.userId = legacyUserId;
        return next();
    }

    return res.status(401).json({ message: "Không tìm thấy thông tin xác thực!" });
};

// Admin-only middleware
exports.isAdmin = async (req, res, next) => {
    // First, run verifyToken logic
    const authHeader = req.headers['authorization'];
    const legacyUserId = req.headers['user-id'];
    let userId = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.userId;
        } catch (err) {
            return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
        }
    } else if (legacyUserId) {
        userId = legacyUserId;
    }

    if (!userId) return res.status(401).json({ message: "Không tìm thấy thông tin xác thực!" });

    try {
        const user = await User.findById(userId);
        
        if (user && user.role === 'admin') {
            req.userId = userId;
            next();
        } else {
            res.status(403).json({ message: "Quyền truy cập bị từ chối. Chỉ dành cho Quản trị viên (Admin)." });
        }
    } catch (err) {
        res.status(500).json({ message: "Lỗi hệ thống xác thực", error: err });
    }
};