const multer = require('multer');
const path = require('path');

// Use memory storage for Vercel (serverless has no persistent filesystem)
// The file buffer will be uploaded to Vercel Blob in the route handler
const storage = multer.memoryStorage();

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
