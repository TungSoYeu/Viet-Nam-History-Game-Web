// backend/middleware/authMiddleware.js
const User = require('../models/User');

exports.isAdmin = async (req, res, next) => {
    const userId = req.headers['user-id']; // Lấy ID người dùng từ Frontend gửi lên
    if (!userId) return res.status(401).json({ message: "Không tìm thấy thông tin xác thực!" });

    try {
        // Truy vấn trực tiếp vào Database để lấy quyền (role) thực sự
        const user = await User.findById(userId);
        
        if (user && user.role === 'admin') {
            next(); // Quyền chuẩn Admin -> Cho phép đi tiếp vào route
        } else {
            // Nếu role là 'user' hoặc ID giả mạo -> Chặn lại
            res.status(403).json({ message: "Quyền truy cập bị từ chối. Chỉ dành cho Quản trị viên (Admin)." });
        }
    } catch (err) {
        res.status(500).json({ message: "Lỗi hệ thống xác thực", error: err });
    }
};