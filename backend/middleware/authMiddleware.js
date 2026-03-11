const User = require('../models/User');

exports.isAdmin = async (req, res, next) => {
    const userId = req.headers['user-id']; // Đơn giản hóa auth qua header cho prototype
    if (!userId) return res.status(401).json({ message: "Không tìm thấy thông tin đăng nhập" });

    try {
        const user = await User.findById(userId);
        if (user && user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: "Quyền truy cập bị từ chối. Chỉ dành cho Admin." });
        }
    } catch (err) {
        res.status(500).json({ message: "Lỗi hệ thống", error: err });
    }
};
