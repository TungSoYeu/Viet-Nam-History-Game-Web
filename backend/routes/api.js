// backend/routes/api.js
const express = require('express');
const router = express.Router();
const gameController = require('../controller/gameController');

// Đường dẫn lấy danh sách các triều đại
router.get('/lessons', (req, res) => {
  res.json({ message: "Đây là danh sách các triều đại: Đinh, Tiền Lê, Lý..." });
});

// Đường dẫn gửi câu trả lời, sử dụng controller
router.post('/submit-answer', gameController.checkAnswer);

module.exports = router;