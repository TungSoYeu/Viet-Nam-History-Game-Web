const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true, sparse: true },
  googleId: { type: String, unique: true, sparse: true },
  password: { type: String, required: function() { return !this.googleId; } },
  fullName: { type: String, default: '' },
  dateOfBirth: { type: Date, default: null },
  school: { type: String, default: '' },
  province: { type: String, default: '' },
  city: { type: String, default: '' },
  avatar: { type: String, default: null },
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
