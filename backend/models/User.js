const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: 'default_general.png' },
  // Điểm kinh nghiệm (XP)
  experience: { type: Number, default: 0 },
  // Số ngọn nến (thể lực/lives)
  lives: { type: Number, default: 5, max: 5 },
  // Thời điểm cập nhật nến gần nhất để hồi phục tự động (vd: 1 nến/30p)
  lastCandleUpdate: { type: Date, default: Date.now },
  // Chuỗi ngày đăng nhập/chơi liên tục
  streak: { type: Number, default: 0 },
  // Các triều đại đã mở khóa (Mode 1)
  unlockedDynasties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  // Danh hiệu/Huy hiệu đạt được
  badges: [{ 
    dynastyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
    tier: { type: String, enum: ['bronze', 'silver', 'gold'], default: 'bronze' }
  }],
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
