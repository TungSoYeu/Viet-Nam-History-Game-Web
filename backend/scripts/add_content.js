const mongoose = require('mongoose');
const Question = require('../models/Question');
const Lesson = require('../models/Lesson');
const Matching = require('../models/Matching');
require('dotenv').config({ path: './backend/.env' });

const addContent = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/history-game';
    await mongoose.connect(mongoUri);
    console.log("🚀 Đang kết nối Database để nạp thêm dữ liệu...");

    // Lấy danh sách Lesson để gắn ID
    const lessons = await Lesson.find();
    if (lessons.length === 0) {
        console.error("❌ Chưa có dữ liệu Lesson. Vui lòng chạy seed.js trước!");
        process.exit(1);
    }

    const getLid = (name) => {
        const l = lessons.find(lx => lx.title.includes(name));
        return l ? l._id : lessons[0]._id;
    };

    const newQuestions = [
      { content: "Lê Lợi phất cờ khởi nghĩa Lam Sơn tại tỉnh nào?", options: ["Thanh Hóa", "Nghệ An", "Hà Tĩnh", "Ninh Bình"], correctAnswer: "Thanh Hóa", explanation: "Khởi nghĩa Lam Sơn nổ ra năm 1418 tại vùng núi Lam Sơn, Thanh Hóa.", lessonId: getLid("Hồ & Hậu Lê"), difficulty: 2 },
      { content: "Ai là người soạn thảo bản 'Bình Ngô Đại Cáo'?", options: ["Lê Lợi", "Nguyễn Trãi", "Trần Nguyên Hãn", "Lê Văn Hưu"], correctAnswer: "Nguyễn Trãi", explanation: "Nguyễn Trãi thay lời Lê Lợi viết Bình Ngô Đại Cáo năm 1428.", lessonId: getLid("Hồ & Hậu Lê"), difficulty: 1 },
      { content: "Triều đại nào tồn tại ngắn nhất trong lịch sử Việt Nam?", options: ["Nhà Hồ", "Nhà Tây Sơn", "Nhà Mạc", "Nhà Ngô"], correctAnswer: "Nhà Hồ", explanation: "Nhà Hồ chỉ tồn tại 7 năm (1400-1407).", lessonId: getLid("Hồ & Hậu Lê"), difficulty: 2 },
      { content: "Ai là người đã dâng 'Thất trảm sớ' đòi chém 7 nịnh thần?", options: ["Chu Văn An", "Nguyễn Bỉnh Khiêm", "Tô Hiến Thành", "Mạc Đĩnh Chi"], correctAnswer: "Chu Văn An", explanation: "Chu Văn An dâng sớ dưới thời vua Trần Dụ Tông.", lessonId: getLid("Nhà Trần"), difficulty: 2 },
      { content: "Trận Rạch Gầm - Xoài Mút (1785) đánh bại quân xâm lược nào?", options: ["Quân Xiêm", "Quân Thanh", "Quân Minh", "Quân Nguyên"], correctAnswer: "Quân Xiêm", explanation: "Nguyễn Huệ đã dùng hỏa công tiêu diệt 5 vạn quân Xiêm.", lessonId: getLid("Nhà Tây Sơn"), difficulty: 2 },
      { content: "Ai là vị vua cuối cùng của triều đại nhà Lý?", options: ["Lý Chiêu Hoàng", "Lý Huệ Tông", "Lý Cao Tông", "Lý Anh Tông"], correctAnswer: "Lý Chiêu Hoàng", explanation: "Lý Chiêu Hoàng nhường ngôi cho Trần Cảnh năm 1225.", lessonId: getLid("Nhà Lý"), difficulty: 1 },
      { content: "Tên gọi nước ta dưới thời vua Minh Mạng từ năm 1838 là gì?", options: ["Đại Nam", "Việt Nam", "Đại Việt", "An Nam"], correctAnswer: "Đại Nam", explanation: "Năm 1838, Minh Mạng đổi quốc hiệu thành Đại Nam.", lessonId: getLid("Nhà Nguyễn"), difficulty: 2 },
      { content: "Vị trạng nguyên nào nổi tiếng với tài 'Đối đáp' khi đi sứ phương Bắc?", options: ["Mạc Đĩnh Chi", "Nguyễn Hiền", "Lương Thế Vinh", "Phạm Đôn Lễ"], correctAnswer: "Mạc Đĩnh Chi", explanation: "Mạc Đĩnh Chi được phong là 'Lưỡng quốc Trạng nguyên'.", lessonId: getLid("Nhà Trần"), difficulty: 3 },
      { content: "Chiến thắng Điện Biên Phủ kết thúc vào ngày tháng năm nào?", options: ["7/5/1954", "30/4/1975", "2/9/1945", "19/5/1954"], correctAnswer: "7/5/1954", explanation: "Lá cờ quyết chiến quyết thắng tung bay trên nóc hầm De Castries lúc 17h30 ngày 7/5/1954.", lessonId: getLid("Kháng chiến"), difficulty: 1 },
      { content: "Ai là người chỉ huy chiến dịch Hồ Chí Minh năm 1975?", options: ["Văn Tiến Dũng", "Võ Nguyên Giáp", "Trần Văn Trà", "Lê Duẩn"], correctAnswer: "Văn Tiến Dũng", explanation: "Đại tướng Văn Tiến Dũng là Tư lệnh chiến dịch Hồ Chí Minh.", lessonId: getLid("Kháng chiến"), difficulty: 2 },
      { content: "Nhà nước Vạn Xuân do ai thành lập?", options: ["Lý Bí", "Triệu Quang Phục", "Mai Thúc Loan", "Khúc Thừa Dụ"], correctAnswer: "Lý Bí", explanation: "Lý Bí (Lý Nam Đế) thành lập nước Vạn Xuân năm 544.", lessonId: getLid("Bắc thuộc"), difficulty: 2 },
      { content: "Lý Thường Kiệt đánh bại quân Tống tại phòng tuyến sông nào?", options: ["Sông Như Nguyệt", "Sông Bạch Đằng", "Sông Gianh", "Sông Hồng"], correctAnswer: "Sông Như Nguyệt", explanation: "Phòng tuyến sông Như Nguyệt (sông Cầu) ngăn chặn quân Tống xâm lược.", lessonId: getLid("Nhà Lý"), difficulty: 1 },
      { content: "Ai là người dời đô từ Hoa Lư về Thăng Long?", options: ["Lý Thái Tổ", "Lý Thái Tông", "Đinh Tiên Hoàng", "Lê Đại Hạnh"], correctAnswer: "Lý Thái Tổ", explanation: "Lý Công Uẩn dời đô năm 1010.", lessonId: getLid("Nhà Lý"), difficulty: 1 },
      { content: "Trận Ngọc Hồi - Đống Đa đại phá quân xâm lược nào?", options: ["Quân Thanh", "Quân Minh", "Quân Tống", "Quân Nguyên"], correctAnswer: "Quân Thanh", explanation: "Vua Quang Trung đại phá 29 vạn quân Thanh vào mùa xuân 1789.", lessonId: getLid("Nhà Tây Sơn"), difficulty: 1 },
      { content: "Bác Hồ đọc bản Tuyên ngôn Độc lập tại đâu?", options: ["Quảng trường Ba Đình", "Dinh Độc Lập", "Nhà hát Lớn", "Kinh thành Huế"], correctAnswer: "Quảng trường Ba Đình", explanation: "Ngày 2/9/1945 tại Quảng trường Ba Đình, Hà Nội.", lessonId: getLid("Pháp thuộc"), difficulty: 1 },
      { content: "Vị vua nào có thời gian trị vì lâu nhất trong lịch sử Việt Nam?", options: ["Lý Nhân Tông", "Lê Thánh Tông", "Tự Đức", "Gia Long"], correctAnswer: "Lý Nhân Tông", explanation: "Vua Lý Nhân Tông trị vì 56 năm (1072-1127).", lessonId: getLid("Nhà Lý"), difficulty: 3 },
      { content: "Chiến thắng Bạch Đằng của Ngô Quyền diễn ra năm nào?", options: ["938", "981", "1288", "1077"], correctAnswer: "938", explanation: "Năm 938, Ngô Quyền đánh bại quân Nam Hán, kết thúc 1000 năm Bắc thuộc.", lessonId: getLid("Bắc thuộc"), difficulty: 1 },
      { content: "Dưới triều vua nào, nước ta có tên gọi là Đại Việt đầu tiên?", options: ["Lý Thánh Tông", "Lý Thái Tổ", "Đinh Tiên Hoàng", "Lê Thánh Tông"], correctAnswer: "Lý Thánh Tông", explanation: "Năm 1054, vua Lý Thánh Tông đổi tên nước thành Đại Việt.", lessonId: getLid("Nhà Lý"), difficulty: 2 },
      { content: "Ai là người lãnh đạo cuộc khởi nghĩa Yên Thế?", options: ["Hoàng Hoa Thám", "Phan Đình Phùng", "Nguyễn Thiện Thuật", "Phan Bội Châu"], correctAnswer: "Hoàng Hoa Thám", explanation: "Hoàng Hoa Thám (Đề Thám) lãnh đạo cuộc khởi nghĩa chống Pháp ở Yên Thế.", lessonId: getLid("Pháp thuộc"), difficulty: 2 },
      { content: "Nhân vật lịch sử nào được tôn là 'Vạn Thắng Vương'?", options: ["Đinh Bộ Lĩnh", "Lê Hoàn", "Ngô Quyền", "Lý Công Uẩn"], correctAnswer: "Đinh Bộ Lĩnh", explanation: "Đinh Bộ Lĩnh dẹp loạn 12 sứ quân, được tôn là Vạn Thắng Vương.", lessonId: getLid("Nhà Ngô"), difficulty: 2 }
    ];

    await Question.insertMany(newQuestions);
    console.log(`✅ Đã nạp thêm ${newQuestions.length} câu hỏi mới vào Question collection.`);

    const newMatchings = [
      {
        title: "Nối Thành Tựu với Triều Đại",
        type: "Custom",
        pairs: [
          { left: "Xây dựng Văn Miếu", right: "Nhà Lý" },
          { left: "Ba lần thắng Nguyên Mông", right: "Nhà Trần" },
          { left: "Ban hành Luật Hồng Đức", right: "Nhà Lê" },
          { left: "Dời đô về Huế", right: "Nhà Nguyễn" }
        ]
      },
      {
        title: "Nối Tên Hiệu với Nhân Vật",
        type: "Character-Dynasty",
        pairs: [
          { left: "Mai Hắc Đế", right: "Mai Thúc Loan" },
          { left: "Bố Cái Đại Vương", right: "Phùng Hưng" },
          { left: "Lý Nam Đế", right: "Lý Bí" },
          { left: "Tiên Điền nhân sĩ", right: "Nguyễn Du" }
        ]
      },
      {
        title: "Nối Câu Nói với Nhân Vật",
        type: "Custom",
        pairs: [
          { left: "Đầu thần chưa rơi xuống đất...", right: "Trần Thủ Độ" },
          { left: "Ta thà làm ma nước Nam...", right: "Trần Bình Trọng" },
          { left: "Bao giờ người Tây nhổ hết cỏ...", right: "Nguyễn Trung Trực" },
          { left: "Không có gì quý hơn độc lập tự do", right: "Hồ Chí Minh" }
        ]
      }
    ];

    await Matching.insertMany(newMatchings);
    console.log(`✅ Đã nạp thêm ${newMatchings.length} bộ Nối Chữ vào Matching collection.`);

    console.log("✨ Dữ liệu đã được lưu vĩnh viễn vào MongoDB.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Lỗi: ", err);
    process.exit(1);
  }
};

addContent();
