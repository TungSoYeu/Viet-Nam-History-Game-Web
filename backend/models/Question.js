// file: backend/models/Question.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  content: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  explanation: { type: String, default: '' },
  
  // Liên kết với triều đại/thời kỳ
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: false
  },

  // Phân loại chế độ chơi
  type: { 
    type: String, 
    enum: ['general', 'survival', 'time-attack', 'territory', 'millionaire'], 
    default: 'general' 
  },
  
  // Dành riêng cho mode "Mở Mang Bờ Cõi" (Lưu mã cứ điểm hoặc tên cứ điểm)
  location: { type: String, default: null }, // Ví dụ: 'ChiLang', 'BachDang', 'DienBienPhu'
  
  // Độ khó (tùy chọn)
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  visibilityScope: {
    type: String,
    enum: ['global', 'class'],
    default: 'global'
  },
  classroomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classroom',
    default: null,
    index: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
