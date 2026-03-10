const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Điểm kinh nghiệm để đua top Bảng phong thần
  experience: { type: Number, default: 0 },
  // Số mạng sống (ví dụ: tối đa 5 ngọn nến)
  lives: { type: Number, default: 5 },
  // Chuỗi ngày đăng nhập liên tục (ngọn đuốc lịch sử)
  streak: { type: Number, default: 0 },
  // Lưu lại các bài học (triều đại) đã vượt qua
  completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }]
});

module.exports = mongoose.model('User', userSchema);
