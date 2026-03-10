const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  // Câu hỏi này thuộc về triều đại (Bài học) nào?
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
  // Loại câu hỏi: 'trac-nghiem', 'ghep-the', 'sap-xep'
  questionType: { type: String, required: true },
  // Nội dung câu hỏi (Ví dụ: Ai đánh thắng quân Nam Hán trên sông Bạch Đằng?)
  content: { type: String, required: true },
  // Các lựa chọn đáp án (dành cho dạng trắc nghiệm)
  options: [{ type: String }],
  // Đáp án đúng để "bộ não" máy chủ kiểm tra đối chiếu
  correctAnswer: { type: mongoose.Schema.Types.Mixed, required: true }
});

module.exports = mongoose.model('Question', questionSchema);