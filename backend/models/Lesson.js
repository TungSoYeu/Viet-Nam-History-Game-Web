const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  order: { type: Number, required: true },
  imageUrl: { type: String },
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
  },
  
  // Khu vực Học tập (Royal Library)
  wiki: {
    content: { type: String }, // Nội dung chi tiết (Markdown/HTML)
    images: [{ type: String }], // Danh sách ảnh tư liệu
    maps: [{ type: String }],   // Bản đồ lãnh thổ
    videoUrl: { type: String }  // Video tóm tắt
  },
  
  // Flashcards để học nhanh
  flashcards: [{
    front: { type: String, required: true }, // Nhân vật/Sự kiện
    back: { type: String, required: true },  // Thành tựu/Chi tiết
    image: { type: String }
  }]
});

module.exports = mongoose.model('Lesson', lessonSchema);
