const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, default: '' },
  dateOfBirth: { type: Date, default: null },
  school: { type: String, default: '' },
  avatar: { type: String, default: 'default_general.png' },
  // Điểm kinh nghiệm (XP)
  experience: { type: Number, default: 0 },
  // Chuỗi ngày đăng nhập/chơi liên tục
  streak: { type: Number, default: 0 },
  // Các triều đại đã mở khóa (Mode 1)
  unlockedDynasties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  // Danh hiệu/Huy hiệu đạt được
  badges: [{ 
    dynastyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
    tier: { type: String, enum: ['bronze', 'silver', 'gold'], default: 'bronze' }
  }],
  unlockedTerritories: [{ type: String }],
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
