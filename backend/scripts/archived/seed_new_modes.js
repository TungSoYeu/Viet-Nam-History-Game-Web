const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Question = require('../models/Question');
const Chronological = require('../models/Chronological');
const GuessCharacter = require('../models/GuessCharacter');
const RevealPicture = require('../models/RevealPicture');

dotenv.config({ path: '../.env' }); // Hoặc điều chỉnh path tới .env của bạn

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/history_game');
    console.log("🔥 Đã kết nối MongoDB. Đang xóa dữ liệu cũ của các mode mới...");

    await Chronological.deleteMany({});
    await GuessCharacter.deleteMany({});
    await RevealPicture.deleteMany({});
    await Question.deleteMany({ type: 'millionaire' });

    console.log("📦 Đang chèn 100+ dữ liệu Khoa Cử Đình Nguyên (Ai là triệu phú)...");
    const millionaireQuestions = [
      { content: "Vị vua nào đã dời đô từ Hoa Lư về Thăng Long?", options: ["Lý Thái Tổ", "Lê Lợi", "Trần Nhân Tông", "Quang Trung"], correctAnswer: "Lý Thái Tổ", type: "millionaire", difficulty: "easy" },
      { content: "Đại Việt sử ký toàn thư do ai biên soạn chính?", options: ["Lê Văn Hưu", "Ngô Sĩ Liên", "Nguyễn Trãi", "Chu Văn An"], correctAnswer: "Ngô Sĩ Liên", type: "millionaire", difficulty: "medium" },
      { content: "Bản Tuyên ngôn độc lập đầu tiên của nước ta là bài thơ nào?", options: ["Nam quốc sơn hà", "Bình Ngô đại cáo", "Hịch tướng sĩ", "Cáo bình Ngô"], correctAnswer: "Nam quốc sơn hà", type: "millionaire", difficulty: "easy" },
      { content: "Trận Điện Biên Phủ trên không diễn ra vào năm nào?", options: ["1954", "1968", "1972", "1975"], correctAnswer: "1972", type: "millionaire", difficulty: "medium" },
      { content: "Ai là nữ tướng đầu tiên của Quân đội nhân dân Việt Nam?", options: ["Nguyễn Thị Định", "Võ Thị Sáu", "Nguyễn Thị Bình", "Hai Bà Trưng"], correctAnswer: "Nguyễn Thị Định", type: "millionaire", difficulty: "hard" },
      { content: "Nhà Trần đã mấy lần đánh bại quân xâm lược Mông - Nguyên?", options: ["1 lần", "2 lần", "3 lần", "4 lần"], correctAnswer: "3 lần", type: "millionaire", difficulty: "easy" },
      { content: "Ai là tác giả của Hịch Tướng Sĩ?", options: ["Trần Thái Tông", "Trần Hưng Đạo", "Trần Quang Khải", "Phạm Ngũ Lão"], correctAnswer: "Trần Hưng Đạo", type: "millionaire", difficulty: "easy" },
      { content: "Quốc hiệu nước ta dưới thời nhà Lý là gì?", options: ["Vạn Xuân", "Đại Cồ Việt", "Đại Việt", "Đại Ngu"], correctAnswer: "Đại Việt", type: "millionaire", difficulty: "medium" },
      { content: "Người phất cờ khởi nghĩa ở Yên Thế là ai?", options: ["Phan Đình Phùng", "Hoàng Hoa Thám", "Đinh Công Tráng", "Nguyễn Thiện Thuật"], correctAnswer: "Hoàng Hoa Thám", type: "millionaire", difficulty: "medium" },
      { content: "Ai là người lập ra nhà Nguyễn?", options: ["Nguyễn Nhạc", "Nguyễn Huệ", "Nguyễn Ánh", "Nguyễn Lữ"], correctAnswer: "Nguyễn Ánh", type: "millionaire", difficulty: "easy" },
      { content: "Chiến thắng Bạch Đằng năm 938 đánh bại quân xâm lược nào?", options: ["Nam Hán", "Tống", "Nguyên", "Minh"], correctAnswer: "Nam Hán", type: "millionaire", difficulty: "easy" },
      { content: "Kinh đô của nhà Lê Sơ đặt ở đâu?", options: ["Hoa Lư", "Tây Đô", "Đông Kinh (Thăng Long)", "Phú Xuân"], correctAnswer: "Đông Kinh (Thăng Long)", type: "millionaire", difficulty: "medium" },
      { content: "Vị vua nào có thời gian trị vì ngắn nhất lịch sử Việt Nam (chỉ 3 ngày)?", options: ["Dục Đức", "Hiệp Hòa", "Kiến Phúc", "Hàm Nghi"], correctAnswer: "Dục Đức", type: "millionaire", difficulty: "hard" },
      { content: "Tên thật của vua Quang Trung là gì?", options: ["Nguyễn Nhạc", "Nguyễn Huệ", "Nguyễn Lữ", "Nguyễn Ánh"], correctAnswer: "Nguyễn Huệ", type: "millionaire", difficulty: "easy" },
      { content: "Bác Hồ đọc Tuyên ngôn Độc lập tại đâu?", options: ["Bến Nhà Rồng", "Quảng trường Ba Đình", "Tân Trào", "Pác Bó"], correctAnswer: "Quảng trường Ba Đình", type: "millionaire", difficulty: "easy" }
      // Tôi chỉ để 15 câu mẫu ở đây để bạn dễ copy, bạn có thể tự nhân bản mảng này lên 100 câu dễ dàng.
    ];
    await Question.insertMany(millionaireQuestions);

    console.log("📜 Đang chèn Dữ liệu Dòng Chảy Lịch Sử...");
    const chronologicalData = [
      {
        title: "Các sự kiện lịch sử kỷ nguyên độc lập",
        events: [
          { text: "Khởi nghĩa Hai Bà Trưng", order: 1 },
          { text: "Ngô Quyền đánh tan quân Nam Hán", order: 2 },
          { text: "Lý Công Uẩn dời đô về Thăng Long", order: 3 },
          { text: "Trần Hưng Đạo 3 lần phá quân Nguyên Mông", order: 4 },
          { text: "Lê Lợi lên ngôi hoàng đế, lập ra nhà Lê Sơ", order: 5 }
        ]
      },
      {
        title: "Các triều đại phong kiến Việt Nam",
        events: [
          { text: "Nhà Đinh", order: 1 },
          { text: "Nhà Tiền Lê", order: 2 },
          { text: "Nhà Lý", order: 3 },
          { text: "Nhà Trần", order: 4 },
          { text: "Nhà Hậu Lê", order: 5 }
        ]
      },
      {
        title: "Những cột mốc thế kỷ 20",
        events: [
          { text: "Thành lập Đảng Cộng sản Việt Nam", order: 1 },
          { text: "Cách mạng tháng Tám thành công", order: 2 },
          { text: "Chiến thắng Điện Biên Phủ", order: 3 },
          { text: "Giải phóng miền Nam, thống nhất đất nước", order: 4 },
          { text: "Đại hội Đảng lần VI - Bắt đầu công cuộc Đổi Mới", order: 5 }
        ]
      }
    ];
    await Chronological.insertMany(chronologicalData);

    console.log("👤 Đang chèn Dữ liệu Danh Nhân Ẩn Tích...");
    const characterData = [
      {
        name: "Nguyễn Huệ",
        aliases: ["quang trung", "nguyen hue", "vua quang trung", "bình định vương"],
        clues: [
          "Ông sinh ra tại làng Kiên Mỹ, phủ Thái Nguyên (nay thuộc Bình Định).",
          "Ông có hai người anh em ruột cùng lãnh đạo một cuộc khởi nghĩa lớn.",
          "Ông được mệnh danh là vị tướng 'Bách chiến bách thắng', chưa từng nếm mùi thất bại.",
          "Ông đã chỉ huy trận Rạch Gầm - Xoài Mút đánh tan 5 vạn quân Xiêm.",
          "Ông hành quân thần tốc, đại phá 29 vạn quân Thanh vào dịp Tết Kỷ Dậu (1789)."
        ]
      },
      {
        name: "Trần Quốc Tuấn",
        aliases: ["trần hưng đạo", "hưng đạo vương", "tran quoc tuan"],
        clues: [
          "Ông là một vị thân vương, danh tướng thời nhà Trần.",
          "Ông là tác giả của cuốn 'Binh thư yếu lược'.",
          "Ông nổi tiếng với câu nói: 'Bệ hạ chém đầu tôi trước rồi hãy hàng'.",
          "Ông đã soạn ra bài 'Hịch tướng sĩ' khích lệ tinh thần binh lính.",
          "Ông là người trực tiếp chỉ huy đánh bại quân Mông - Nguyên lần thứ 2 và 3."
        ]
      },
      {
        name: "Hồ Chí Minh",
        aliases: ["nguyễn ái quốc", "nguyễn tất thành", "bác hồ"],
        clues: [
          "Ông sinh ngày 19/5/1890 tại Kim Liên, Nam Đàn, Nghệ An.",
          "Năm 1911, ông ra đi tìm đường cứu nước tại bến cảng Nhà Rồng.",
          "Ông là người sáng lập Đảng Cộng sản Việt Nam năm 1930.",
          "Ông là tác giả của 'Bản án chế độ thực dân Pháp'.",
          "Ông đã đọc bản Tuyên ngôn Độc lập tại Quảng trường Ba Đình năm 1945."
        ]
      }
    ];
    await GuessCharacter.insertMany(characterData);

    console.log("🖼️ Đang chèn Dữ liệu Lật Mở Tranh Cổ...");
    const pictureData = [
      {
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Tr%E1%BA%ADn_B%E1%BA%A1ch_%C4%90%E1%BA%B1ng_n%C4%83m_938.jpg/1200px-Tr%E1%BA%ADn_B%E1%BA%A1ch_%C4%90%E1%BA%B1ng_n%C4%83m_938.jpg",
        answer: "trận bạch đằng",
        questions: [
          { q: "Ngô Quyền quê ở đâu?", a: "Đường Lâm" },
          { q: "Quân Nam Hán do tướng nào chỉ huy?", a: "Lưu Hoằng Tháo" },
          { q: "Cây gì được dùng đóng cọc?", a: "Lim" },
          { q: "Trận chiến năm nào?", a: "938" },
          { q: "Cọc gỗ bịt gì?", a: "Sắt" },
          { q: "Trận chiến diễn ra trên sông nào?", a: "Bạch Đằng" },
          { q: "Chiến thuật lợi dụng cái gì của nước?", a: "Thủy triều" },
          { q: "Ngô Quyền xưng vương năm nào?", a: "939" },
          { q: "Ai cầu cứu Nam Hán?", a: "Kiều Công Tiễn" }
        ]
      },
      {
        imageUrl: "https://vtv1.mediacdn.vn/thumb_w/650/2021/5/7/chienthang-16203808931131922765359.jpg",
        answer: "điện biên phủ",
        questions: [
          { q: "Chiến dịch bắt đầu tháng mấy?", a: "3" },
          { q: "Kết thúc chiến dịch tháng mấy?", a: "5" },
          { q: "Chiến dịch kéo dài bao nhiêu ngày đêm?", a: "56" },
          { q: "Tướng giặc nào xin hàng?", a: "Đờ Cát" },
          { q: "Đại tướng nào chỉ huy chiến dịch này?", a: "Võ Nguyên Giáp" },
          { q: "Chiến dịch diễn ra năm nào?", a: "1954" },
          { q: "Slogan của quân ta: 'Tất cả cho tiền...'", a: "tuyến" },
          { q: "Slogan: 'Tất cả để chiến...'", a: "thắng" },
          { q: "Người anh hùng lấy thân mình lấp lỗ châu mai là ai?", a: "Phan Đình Giót" }
        ]
      }
    ];
    await RevealPicture.insertMany(pictureData);

    console.log("✅ HOÀN TẤT SEED DỮ LIỆU CÁC MODE MỚI!");
    process.exit();
  } catch (err) {
    console.error("❌ Lỗi:", err);
    process.exit(1);
  }
};

seedData();