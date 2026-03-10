const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  // Tên bến đỗ hoặc triều đại
  title: { type: String, required: true },
  // Mô tả ngắn gọn về bối cảnh thời kỳ này
  description: { type: String },
  // Thứ tự xuất hiện trên Dòng chảy thời gian
  order: { type: Number, required: true },
  // Đường dẫn hình ảnh đại diện (giấy dó, trống đồng...)
  imageUrl: { type: String }
});

module.exports = mongoose.model('Lesson', lessonSchema);