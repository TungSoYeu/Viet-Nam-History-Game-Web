const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  // Người gửi lời thách đấu
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  creatorScore: { type: Number, default: 0 },
  creatorTime: { type: Number, default: 0 },
  
  // Người nhận lời thách đấu (Có thể để trống để ai cũng có thể nhận)
  challenger: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  challengerScore: { type: Number, default: 0 },
  challengerTime: { type: Number, default: 0 },
  
  // Danh sách 10 câu hỏi chung cho cả 2
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  
  // Trạng thái: pending (chưa ai nhận), active (đang đấu), completed (xong)
  status: { type: String, enum: ['pending', 'active', 'completed'], default: 'pending' },
  
  // Kết quả cuối cùng
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Challenge', challengeSchema);
