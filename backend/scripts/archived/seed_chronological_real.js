const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Chronological = require('../models/Chronological');

dotenv.config({ path: '../.env' });

const seedRealChronologicalData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/history_game');
    console.log("🔥 Đã kết nối MongoDB. Đang xóa dữ liệu Dòng Chảy Lịch Sử cũ...");

    // Xóa dữ liệu cũ của riêng mode này
    await Chronological.deleteMany({});

    console.log("📜 Đang chèn bộ dữ liệu Lịch sử Việt Nam thật...");
    
    // Bộ dữ liệu 20 thử thách (100 sự kiện lịch sử thật)
    const realData = [
      {
        title: "Kỷ nguyên dựng nước và Bắc thuộc",
        events: [
          { text: "Nước Văn Lang ra đời", order: 1 },
          { text: "Khởi nghĩa Hai Bà Trưng", order: 2 },
          { text: "Khởi nghĩa Lý Bí, lập nước Vạn Xuân", order: 3 },
          { text: "Mai Thúc Loan khởi nghĩa", order: 4 },
          { text: "Ngô Quyền đại phá quân Nam Hán trên sông Bạch Đằng", order: 5 }
        ]
      },
      {
        title: "Bước ngoặt thế kỷ 10 - 11",
        events: [
          { text: "Đinh Bộ Lĩnh dẹp loạn 12 sứ quân, lập nước Đại Cồ Việt", order: 1 },
          { text: "Lê Hoàn lên ngôi, đánh tan quân Tống lần 1", order: 2 },
          { text: "Lý Công Uẩn dời đô từ Hoa Lư về Thăng Long", order: 3 },
          { text: "Xây dựng Văn Miếu - Quốc Tử Giám", order: 4 },
          { text: "Lý Thường Kiệt đọc bài thơ Nam Quốc Sơn Hà bên sông Như Nguyệt", order: 5 }
        ]
      },
      {
        title: "Hào khí Đông A - Thời Trần",
        events: [
          { text: "Thái sư Trần Thủ Độ ép Lý Chiêu Hoàng nhường ngôi cho Trần Cảnh", order: 1 },
          { text: "Trần Quốc Tuấn viết Hịch Tướng Sĩ", order: 2 },
          { text: "Hội nghị Diên Hồng", order: 3 },
          { text: "Chiến thắng Bạch Đằng đánh tan quân Nguyên Mông lần 3", order: 4 },
          { text: "Trần Nhân Tông lên núi Yên Tử lập ra Thiền phái Trúc Lâm", order: 5 }
        ]
      },
      {
        title: "Thời kỳ kháng Minh và Lê Sơ",
        events: [
          { text: "Hồ Quý Ly truất ngôi vua Trần, lập ra nhà Hồ", order: 1 },
          { text: "Quân Minh xâm lược, bắt cha con Hồ Quý Ly", order: 2 },
          { text: "Lê Lợi xưng Bình Định Vương, phất cờ khởi nghĩa ở Lam Sơn", order: 3 },
          { text: "Nguyễn Trãi viết Bình Ngô Đại Cáo", order: 4 },
          { text: "Vua Lê Thánh Tông ban hành bộ luật Hồng Đức", order: 5 }
        ]
      },
      {
        title: "Trịnh Nguyễn phân tranh - Tây Sơn",
        events: [
          { text: "Nguyễn Hoàng vào trấn thủ Thuận Hóa", order: 1 },
          { text: "Xảy ra cuộc chiến tranh Trịnh - Nguyễn", order: 2 },
          { text: "Ba anh em Tây Sơn dựng cờ khởi nghĩa", order: 3 },
          { text: "Nguyễn Huệ đánh tan 5 vạn quân Xiêm ở Rạch Gầm - Xoài Mút", order: 4 },
          { text: "Vua Quang Trung đại phá 29 vạn quân Thanh vào dịp Tết Kỷ Dậu", order: 5 }
        ]
      },
      {
        title: "Triều đại nhà Nguyễn",
        events: [
          { text: "Nguyễn Ánh lên ngôi Hoàng đế, lấy niên hiệu là Gia Long", order: 1 },
          { text: "Vua Minh Mạng đổi quốc hiệu thành Đại Nam", order: 2 },
          { text: "Liên quân Pháp - Tây Ban Nha nổ súng đánh Đà Nẵng", order: 3 },
          { text: "Triều đình Huế ký Hiệp ước Nhâm Tuất nhượng 3 tỉnh miền Đông", order: 4 },
          { text: "Vua Hàm Nghi ban chiếu Cần Vương", order: 5 }
        ]
      },
      {
        title: "Phong trào yêu nước cận đại",
        events: [
          { text: "Khởi nghĩa Yên Thế do Hoàng Hoa Thám lãnh đạo", order: 1 },
          { text: "Phan Bội Châu khởi xướng phong trào Đông Du", order: 2 },
          { text: "Nguyễn Tất Thành ra đi tìm đường cứu nước tại bến Nhà Rồng", order: 3 },
          { text: "Khởi nghĩa Thái Nguyên của Đội Cấn", order: 4 },
          { text: "Nguyễn Ái Quốc gửi Yêu sách 8 điểm tới Hội nghị Versailles", order: 5 }
        ]
      },
      {
        title: "Tiến tới Cách mạng Tháng Tám",
        events: [
          { text: "Thành lập Đảng Cộng sản Việt Nam", order: 1 },
          { text: "Phong trào Xô Viết Nghệ Tĩnh", order: 2 },
          { text: "Khởi nghĩa Bắc Sơn", order: 3 },
          { text: "Thành lập Đội Việt Nam Tuyên truyền Giải phóng quân", order: 4 },
          { text: "Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình", order: 5 }
        ]
      },
      {
        title: "Chín năm kháng chiến chống Pháp",
        events: [
          { text: "Lời kêu gọi Toàn quốc kháng chiến", order: 1 },
          { text: "Chiến dịch Việt Bắc Thu - Đông", order: 2 },
          { text: "Chiến dịch Biên giới Thu - Đông", order: 3 },
          { text: "Chiến thắng Điện Biên Phủ 'lừng lẫy năm châu'", order: 4 },
          { text: "Hiệp định Geneva được ký kết", order: 5 }
        ]
      },
      {
        title: "Kháng chiến chống Mỹ cứu nước",
        events: [
          { text: "Phong trào Đồng Khởi ở Bến Tre", order: 1 },
          { text: "Trận Ấp Bắc", order: 2 },
          { text: "Sự kiện Vịnh Bắc Bộ", order: 3 },
          { text: "Cuộc Tổng tiến công và nổi dậy Xuân Mậu Thân", order: 4 },
          { text: "Chiến dịch Hồ Chí Minh lịch sử, giải phóng miền Nam", order: 5 }
        ]
      }
    ];

    // Nhân bản thêm để đủ 100 thử thách (nếu muốn data cực kỳ lớn)
    // Hoặc chỉ giữ 10 bộ gốc này (50 sự kiện quan trọng nhất) - ở đây mình sẽ random lặp lại để game lúc nào cũng có bài
    const finalData = [];
    for(let i = 0; i < 100; i++) {
        // Lấy ngẫu nhiên 1 trong 10 bộ sự kiện trên
        const baseSet = realData[i % realData.length];
        finalData.push({
            title: baseSet.title,
            events: baseSet.events
        });
    }

    await Chronological.insertMany(finalData);
    console.log("✅ HOÀN TẤT! Đã bơm thành công Dữ liệu Sử Việt THẬT vào Database.");
    process.exit();
  } catch (err) {
    console.error("❌ Lỗi:", err);
    process.exit(1);
  }
};

seedRealChronologicalData();