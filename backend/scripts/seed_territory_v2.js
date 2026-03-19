const mongoose = require('mongoose');
const Question = require('../models/Question');
require('dotenv').config({ path: './.env' });

const dbUrl = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/history_game';

const territoryQuestions = [
  // DienBienPhu
  {
    content: "Chiến dịch Điện Biên Phủ kết thúc vào ngày tháng năm nào?",
    options: ["07/05/1954", "30/04/1954", "13/03/1954", "19/05/1954"],
    correctAnswer: "07/05/1954",
    explanation: "Chiến dịch Điện Biên Phủ kết thúc thắng lợi vào chiều ngày 7/5/1954.",
    type: "territory",
    location: "DienBienPhu",
    difficulty: "easy"
  },
  {
    content: "Ai là Tổng chỉ huy chiến dịch Điện Biên Phủ?",
    options: ["Võ Nguyên Giáp", "Văn Tiến Dũng", "Phạm Văn Đồng", "Hồ Chí Minh"],
    correctAnswer: "Võ Nguyên Giáp",
    explanation: "Đại tướng Võ Nguyên Giáp là Tổng tư lệnh kiêm Chỉ huy trưởng chiến dịch.",
    type: "territory",
    location: "DienBienPhu",
    difficulty: "easy"
  },
  {
    content: "Phương châm tác chiến của ta trong chiến dịch Điện Biên Phủ đã thay đổi như thế nào?",
    options: ["Đánh nhanh thắng nhanh sang Đánh chắc tiến chắc", "Đánh chắc tiến chắc sang Đánh nhanh thắng nhanh", "Phòng ngự sang Tấn công", "Du kích sang Chính quy"],
    correctAnswer: "Đánh nhanh thắng nhanh sang Đánh chắc tiến chắc",
    explanation: "Đại tướng Võ Nguyên Giáp đã quyết định thay đổi phương châm từ 'Đánh nhanh thắng nhanh' sang 'Đánh chắc tiến chắc'.",
    type: "territory",
    location: "DienBienPhu",
    difficulty: "medium"
  },

  // ChiLang
  {
    content: "Ải Chi Lăng nổi tiếng với chiến thắng quân xâm lược nào vào năm 1427?",
    options: ["Quân Minh", "Quân Nguyên", "Quân Thanh", "Quân Tống"],
    correctAnswer: "Quân Minh",
    explanation: "Trận Chi Lăng năm 1427 tiêu diệt viện binh nhà Minh do Liễu Thăng chỉ huy.",
    type: "territory",
    location: "ChiLang",
    difficulty: "easy"
  },
  {
    content: "Tướng giặc nào bị chém đầu tại núi Mã Yên (Chi Lăng) năm 1427?",
    options: ["Liễu Thăng", "Thoát Hoan", "Ô Mã Nhi", "Tôn Sĩ Nghị"],
    correctAnswer: "Liễu Thăng",
    explanation: "Liễu Thăng bị nghĩa quân Lam Sơn phục kích và chém đầu tại núi Mã Yên.",
    type: "territory",
    location: "ChiLang",
    difficulty: "medium"
  },

  // ThangLong
  {
    content: "Ai là người ban 'Chiếu dời đô' về Thăng Long?",
    options: ["Lý Thái Tổ", "Lý Thánh Tông", "Lý Nhân Tông", "Lý Thái Tông"],
    correctAnswer: "Lý Thái Tổ",
    explanation: "Năm 1010, Lý Thái Tổ (Lý Công Uẩn) viết Chiếu dời đô từ Hoa Lư về Đại La, đổi tên là Thăng Long.",
    type: "territory",
    location: "ThangLong",
    difficulty: "easy"
  },
  {
    content: "Tên gọi Thăng Long có nghĩa là gì?",
    options: ["Rồng bay lên", "Rồng đậu", "Rồng vàng", "Đất rồng"],
    correctAnswer: "Rồng bay lên",
    explanation: "Khi dời đô đến Đại La, Lý Công Uẩn thấy rồng vàng bay lên nên đặt tên là Thăng Long (Rồng bay lên).",
    type: "territory",
    location: "ThangLong",
    difficulty: "easy"
  },

  // BachDang
  {
    content: "Trận Bạch Đằng năm 938 do ai chỉ huy đánh tan quân Nam Hán?",
    options: ["Ngô Quyền", "Lê Hoàn", "Trần Hưng Đạo", "Lý Thường Kiệt"],
    correctAnswer: "Ngô Quyền",
    explanation: "Ngô Quyền đã dùng kế cắm cọc gỗ đầu bịt sắt trên sông Bạch Đằng để đánh tan quân Nam Hán.",
    type: "territory",
    location: "BachDang",
    difficulty: "easy"
  },
  {
    content: "Trận Bạch Đằng năm 1288 đánh tan quân xâm lược nào?",
    options: ["Quân Nguyên Mông", "Quân Minh", "Quân Tống", "Quân Thanh"],
    correctAnswer: "Quân Nguyên Mông",
    explanation: "Trần Hưng Đạo đã lãnh đạo nhân dân đánh tan quân Nguyên Mông lần thứ 3 trên sông Bạch Đằng năm 1288.",
    type: "territory",
    location: "BachDang",
    difficulty: "easy"
  },

  // LamSon
  {
    content: "Cuộc khởi nghĩa Lam Sơn do ai lãnh đạo?",
    options: ["Lê Lợi", "Nguyễn Trãi", "Lê Lai", "Trần Nguyên Hãn"],
    correctAnswer: "Lê Lợi",
    explanation: "Lê Lợi khởi nghĩa tại Lam Sơn (Thanh Hóa) năm 1418 để đánh đuổi quân Minh.",
    type: "territory",
    location: "LamSon",
    difficulty: "easy"
  },
  {
    content: "Người anh hùng nào đã 'liều mình cứu chúa' cho Lê Lợi tại núi Chí Linh?",
    options: ["Lê Lai", "Nguyễn Trãi", "Lê Khôi", "Trần Nguyên Hãn"],
    correctAnswer: "Lê Lai",
    explanation: "Lê Lai đã đóng giả Lê Lợi để nhử quân địch, giúp chủ tướng thoát vây.",
    type: "territory",
    location: "LamSon",
    difficulty: "medium"
  },

  // PhuXuan
  {
    content: "Phú Xuân (Huế) trở thành kinh đô của triều đại nào lâu nhất?",
    options: ["Nhà Nguyễn", "Nhà Tây Sơn", "Nhà Lê", "Nhà Mạc"],
    correctAnswer: "Nhà Nguyễn",
    explanation: "Nhà Nguyễn chọn Phú Xuân (Huế) làm kinh đô từ năm 1802 đến 1945.",
    type: "territory",
    location: "PhuXuan",
    difficulty: "easy"
  },

  // DaNang
  {
    content: "Năm 1858, liên quân Pháp - Tây Ban Nha nổ súng tấn công cửa biển nào mở đầu cuộc xâm lược Việt Nam?",
    options: ["Đà Nẵng", "Vũng Tàu", "Cần Giờ", "Thuận An"],
    correctAnswer: "Đà Nẵng",
    explanation: "Chiều ngày 31/8/1858, liên quân Pháp - Tây Ban Nha nổ súng tấn công bán đảo Sơn Trà (Đà Nẵng).",
    type: "territory",
    location: "DaNang",
    difficulty: "easy"
  },

  // ThiNai
  {
    content: "Đầm Thị Nại nổi tiếng với trận thủy chiến giữa triều đại nào với quân Tây Sơn?",
    options: ["Nhà Nguyễn (Nguyễn Ánh)", "Nhà Lê", "Quân Xiêm", "Quân Thanh"],
    correctAnswer: "Nhà Nguyễn (Nguyễn Ánh)",
    explanation: "Trận thủy chiến đầm Thị Nại (1801) là chiến thắng quyết định của Nguyễn Ánh trước quân Tây Sơn.",
    type: "territory",
    location: "ThiNai",
    difficulty: "medium"
  },

  // GiaDinh
  {
    content: "Thành Gia Định bị quân Pháp chiếm vào năm nào?",
    options: ["1859", "1860", "1861", "1862"],
    correctAnswer: "1859",
    explanation: "Sau khi thất bại tại Đà Nẵng, quân Pháp chuyển hướng tấn công và chiếm thành Gia Định năm 1859.",
    type: "territory",
    location: "GiaDinh",
    difficulty: "medium"
  },

  // RachGam
  {
    content: "Chiến thắng Rạch Gầm - Xoài Mút tiêu diệt quân xâm lược nào?",
    options: ["Quân Xiêm", "Quân Thanh", "Quân Pháp", "Quân Minh"],
    correctAnswer: "Quân Xiêm",
    explanation: "Năm 1785, Nguyễn Huệ chỉ huy quân Tây Sơn đánh tan 5 vạn quân Xiêm tại Rạch Gầm - Xoài Mút.",
    type: "territory",
    location: "RachGam",
    difficulty: "easy"
  },

  // ConDao
  {
    content: "Người nữ anh hùng nào đã hy sinh tại nhà tù Côn Đảo?",
    options: ["Võ Thị Sáu", "Nguyễn Thị Minh Khai", "Lê Thị Hồng Gấm", "Đặng Thùy Trâm"],
    correctAnswer: "Võ Thị Sáu",
    explanation: "Chị Võ Thị Sáu hy sinh tại Côn Đảo vào ngày 23/1/1952.",
    type: "territory",
    location: "ConDao",
    difficulty: "easy"
  }
];

async function seedTerritory() {
  try {
    await mongoose.connect(dbUrl);
    console.log('Connected to MongoDB');

    // Xóa các câu hỏi territory cũ nếu cần (tùy chọn)
    // await Question.deleteMany({ type: 'territory' });

    await Question.insertMany(territoryQuestions);
    console.log('Successfully seeded territory questions!');
    process.exit();
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
}

seedTerritory();
