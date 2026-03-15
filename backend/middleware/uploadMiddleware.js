const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create upload directory if it doesn't exist
const uploadDir = 'uploads/avatars';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Set storage engine
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        // Filename: userId-timestamp.ext
        const ext = path.extname(file.originalname);
        const userId = req.body.userId || 'temp'; // Usually comes from body or auth middleware
        cb(null, `avatar-${userId}-${Date.now()}${ext}`);
    }
});

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Chỉ chấp nhận file ảnh (jpeg, jpg, png, webp)!'));
    }
}

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
});

module.exports = upload;
