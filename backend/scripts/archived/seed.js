const mongoose = require('mongoose');
const Question = require('../models/Question');
const Lesson = require('../models/Lesson');
const Matching = require('../models/Matching');
require('dotenv').config({ path: './backend/.env' });

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/history_game';
    await mongoose.connect(mongoUri);
    console.log("🚀 Đang kết nối Database để làm mới hệ thống...");

    await Lesson.deleteMany({});
    await Question.deleteMany({});
    await Matching.deleteMany({});
    console.log("🧹 Đã dọn dẹp dữ liệu cũ.");

    const lessonData = [
      { 
        title: "Văn Lang & Âu Lạc", 
        description: "Thời kỳ Hùng Vương và An Dương Vương, cội nguồn dân tộc.", 
        order: 1,
        wiki: {
          content: "# Thời kỳ Hồng Bàng\nNước Việt Nam có lịch sử hàng ngàn năm văn hiến. Bắt đầu từ thời đại **Hùng Vương** với nước Văn Lang, đóng đô ở Phong Châu. Sau đó là thời **An Dương Vương** với nước Âu Lạc và tòa thành Cổ Loa độc đáo.\n\n### Các cột mốc chính:\n- **2879 TCN**: Nhà nước Văn Lang ra đời.\n- **258 TCN**: Thục Phán An Dương Vương lập nước Âu Lạc.\n- **179 TCN**: Triệu Đà xâm lược, bắt đầu thời kỳ Bắc thuộc.",
          images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Hùng_Vương.jpg/300px-Hùng_Vương.jpg"]
        },
        flashcards: [
          { front: "Lạc Long Quân & Âu Cơ", back: "Truyền thuyết Con Rồng Cháu Tiên, đẻ ra bọc trăm trứng." },
          { front: "Nỏ Liên Châu", back: "Vũ khí thần kỳ của An Dương Vương giúp bảo vệ thành Cổ Loa." }
        ]
      },
      { title: "Thời Bắc Thuộc", description: "Hơn một ngàn năm đấu tranh giành độc lập.", order: 2 },
      { title: "Nhà Ngô - Đinh - Tiền Lê", description: "Thời kỳ phục hưng và thống nhất đất nước.", order: 3 },
      { 
        title: "Nhà Lý", 
        description: "Dời đô về Thăng Long, phát triển văn hóa rực rỡ.", 
        order: 4,
        wiki: {
          content: "# Nhà Lý (1009 - 1225)\nNăm 1010, **Lý Thái Tổ** ban 'Chiếu dời đô', chuyển kinh đô từ Hoa Lư về Thăng Long, mở ra thời kỳ phát triển huy hoàng của quốc gia Đại Việt.\n\n### Thành tựu:\n- Xây dựng **Văn Miếu - Quốc Tử Giám**.\n- Đánh bại quân Tống xâm lược trên sông Như Nguyệt.\n- Phật giáo trở thành quốc giáo.",
        },
        flashcards: [
          { front: "Lý Thường Kiệt", back: "Tác giả bài thơ thần 'Nam quốc sơn hà', vị tướng bách chiến bách thắng." },
          { front: "Hình Thư", back: "Bộ luật thành văn đầu tiên của nước ta ban hành năm 1042." }
        ]
      },
      { title: "Nhà Trần", description: "Hào khí Đông A, ba lần đánh bại quân Nguyên Mông.", order: 5 },
      { title: "Nhà Hồ & Hậu Lê", description: "Kháng chiến chống Minh và thời kỳ cực thịnh phong kiến.", order: 6 },
      { title: "Nhà Tây Sơn", description: "Quang Trung đại phá quân Thanh, thống nhất đất nước.", order: 7 },
      { title: "Nhà Nguyễn", description: "Triều đại phong kiến cuối cùng của Việt Nam.", order: 8 },
      { title: "Thời Pháp Thuộc & Kháng Chiến", description: "Cuộc đấu tranh giải phóng dân tộc hiện đại.", order: 9 },
    ];

    const createdLessons = await Lesson.insertMany(lessonData);
    console.log("✅ Đã nạp các thời kỳ lịch sử (kèm Wiki & Flashcards).");

    const findId = (title) => {
        const lesson = createdLessons.find(l => l.title.includes(title));
        return lesson ? lesson._id : createdLessons[0]._id;
    };

    const questionsData = [
      {
        content: "Ai là vị vua đầu tiên của nước Văn Lang?",
        options: ["Kinh Dương Vương", "Hùng Vương", "An Dương Vương", "Lạc Long Quân"],
        correctAnswer: "Kinh Dương Vương",
        explanation: "Kinh Dương Vương là thủy tổ của dân tộc, cha của Lạc Long Quân.",
        lessonId: findId("Văn Lang"),
        difficulty: 1
      },
      {
        content: "Ai là người chỉ huy cuộc kháng chiến chống Tống (1075-1077)?",
        options: ["Lý Thái Tông", "Lý Thường Kiệt", "Trần Hưng Đạo", "Lê Lợi"],
        correctAnswer: "Lý Thường Kiệt",
        explanation: "Ông nổi tiếng với chiến lược 'Tiên phát chế nhân' và bài thơ Nam Quốc Sơn Hà.",
        lessonId: findId("Nhà Lý"),
        difficulty: 1
      },
      {
        content: "Nữ vương duy nhất trong lịch sử phong kiến Việt Nam là ai?",
        options: ["Lý Chiêu Hoàng", "Trưng Trắc", "Bà Triệu", "Thái hậu Dương Vân Nga"],
        correctAnswer: "Lý Chiêu Hoàng",
        explanation: "Bà là vị vua cuối cùng của triều Lý trước khi nhường ngôi cho Trần Cảnh.",
        lessonId: findId("Nhà Lý"),
        difficulty: 1
      },
      {
        content: "Ngô Quyền đánh bại quân Nam Hán trên sông nào vào năm 938?",
        options: ["Sông Hồng", "Sông Bạch Đằng", "Sông Gianh", "Sông Như Nguyệt"],
        correctAnswer: "Sông Bạch Đằng",
        explanation: "Chiến thắng Bạch Đằng năm 938 kết thúc 1000 năm Bắc thuộc.",
        lessonId: findId("Nhà Ngô"),
        difficulty: 1
      }
    ];

    await Question.insertMany(questionsData);
    console.log(`✅ Đã nạp ${questionsData.length} câu hỏi mẫu.`);

    await Matching.create([
      {
        title: "Nối Danh Tướng với Triều Đại",
        type: "Character-Dynasty",
        pairs: [
          { left: "Ngô Quyền", right: "Nhà Ngô" },
          { left: "Lý Thường Kiệt", right: "Nhà Lý" },
          { left: "Trần Hưng Đạo", right: "Nhà Trần" },
          { left: "Lê Lợi", right: "Nhà Hậu Lê" },
          { left: "Quang Trung", right: "Nhà Tây Sơn" }
        ]
      }
    ]);
    console.log("✅ Đã nạp dữ liệu Nối Dữ Kiện.");

    console.log("✨ HỆ THỐNG ĐÃ SẴN SÀNG!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Lỗi: ", err);
    process.exit(1);
  }
};

seedDB();
