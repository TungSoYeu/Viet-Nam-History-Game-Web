const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Question = require('../models/Question');
const Chronological = require('../models/Chronological');
const GuessCharacter = require('../models/GuessCharacter');
const RevealPicture = require('../models/RevealPicture');

dotenv.config({ path: '../.env' });

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/history_game');
    console.log("🔥 Đã kết nối MongoDB. Đang bắt đầu chèn 400 bản ghi dữ liệu...");

    // Xóa dữ liệu cũ để tránh trùng lặp
    await Chronological.deleteMany({});
    await GuessCharacter.deleteMany({});
    await RevealPicture.deleteMany({});
    await Question.deleteMany({ type: 'millionaire' });

    // 1. TẠO 100 CÂU HỎI KHOA CỬ (MILLIONAIRE)
    console.log("📦 Đang chèn 100 câu hỏi Khoa Cử Đình Nguyên...");
    const millionaireQuestions = [];
    const baseMilQuestions = [
      { content: "Vị vua nào dời đô từ Hoa Lư về Thăng Long?", options: ["Lý Thái Tổ", "Lê Lợi", "Trần Nhân Tông", "Quang Trung"], answer: "Lý Thái Tổ" },
      { content: "Đại Việt sử ký toàn thư do ai biên soạn?", options: ["Lê Văn Hưu", "Ngô Sĩ Liên", "Nguyễn Trãi", "Chu Văn An"], answer: "Ngô Sĩ Liên" },
      { content: "Ai là tác giả Bình Ngô Đại Cáo?", options: ["Nguyễn Trãi", "Lê Lợi", "Trần Hưng Đạo", "Lý Thường Kiệt"], answer: "Nguyễn Trãi" }
    ];
    for(let i = 0; i < 100; i++) {
        const base = baseMilQuestions[i % baseMilQuestions.length];
        millionaireQuestions.push({
            content: `[Câu số ${i+1}] ` + base.content,
            options: base.options,
            correctAnswer: base.answer,
            type: "millionaire",
            difficulty: i > 70 ? "hard" : (i > 30 ? "medium" : "easy")
        });
    }
    await Question.insertMany(millionaireQuestions);

    // 2. TẠO 100 BỘ DÒNG CHẢY LỊCH SỬ (CHRONOLOGICAL)
    console.log("📜 Đang chèn 100 Dữ liệu Dòng Chảy Lịch Sử...");
    const chronologicalData = [];
    for(let i = 0; i < 100; i++) {
        chronologicalData.push({
            title: `Thử thách dòng thời gian cấp độ ${i + 1}`,
            events: [
                { text: `Sự kiện sớm nhất (Mốc ${i}.1)`, order: 1 },
                { text: `Sự kiện tiếp theo (Mốc ${i}.2)`, order: 2 },
                { text: `Sự kiện giữa kỳ (Mốc ${i}.3)`, order: 3 },
                { text: `Sự kiện cận đại (Mốc ${i}.4)`, order: 4 },
                { text: `Sự kiện hiện đại (Mốc ${i}.5)`, order: 5 }
            ]
        });
    }
    await Chronological.insertMany(chronologicalData);

    // 3. TẠO 100 BỘ DANH NHÂN ẨN TÍCH (GUESS CHARACTER)
    console.log("👤 Đang chèn 100 Dữ liệu Danh Nhân Ẩn Tích...");
    const characterData = [];
    const heroes = ["Nguyễn Huệ", "Trần Hưng Đạo", "Lý Thường Kiệt", "Hai Bà Trưng", "Lê Lợi"];
    for(let i = 0; i < 100; i++) {
        const hero = heroes[i % heroes.length];
        characterData.push({
            name: hero,
            aliases: [hero.toLowerCase(), "vua " + hero.toLowerCase(), "tướng " + hero.toLowerCase()],
            clues: [
                `Manh mối 1 của nhân vật số ${i+1}: Quê quán ở một vùng đất địa linh nhân kiệt.`,
                `Manh mối 2 của nhân vật số ${i+1}: Lãnh đạo một cuộc khởi nghĩa quy mô lớn.`,
                `Manh mối 3 của nhân vật số ${i+1}: Đánh bại hàng vạn quân xâm lược phương Bắc.`,
                `Manh mối 4 của nhân vật ${hero}: Từng có một trận đánh vang dội trên sông.`,
                `Manh mối 5: Tên nhân vật bắt đầu bằng chữ cái '${hero.charAt(0)}'.`
            ]
        });
    }
    await GuessCharacter.insertMany(characterData);

    // 4. TẠO 100 BỨC TRANH CỔ (REVEAL PICTURE)
    console.log("🖼️ Đang chèn 100 Dữ liệu Lật Mở Tranh Cổ...");
    const pictureData = [];
    const images = [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Tr%E1%BA%ADn_B%E1%BA%A1ch_%C4%90%E1%BA%B1ng_n%C4%83m_938.jpg/1200px-Tr%E1%BA%ADn_B%E1%BA%A1ch_%C4%90%E1%BA%B1ng_n%C4%83m_938.jpg",
        "https://vtv1.mediacdn.vn/thumb_w/650/2021/5/7/chienthang-16203808931131922765359.jpg"
    ];
    for(let i = 0; i < 100; i++) {
        pictureData.push({
            imageUrl: images[i % images.length],
            answer: i % 2 === 0 ? "trận bạch đằng" : "điện biên phủ",
            questions: [
                { q: `Câu hỏi mở ô 1 (Tranh ${i+1}): Điền từ còn thiếu...`, a: "A" },
                { q: `Câu hỏi mở ô 2 (Tranh ${i+1}): Năm diễn ra sự kiện?`, a: "B" },
                { q: `Câu hỏi mở ô 3 (Tranh ${i+1}): Ai là người chỉ huy?`, a: "C" },
                { q: `Câu hỏi mở ô 4 (Tranh ${i+1}): Quân địch từ đâu đến?`, a: "D" },
                { q: `Câu hỏi mở ô 5 (Tranh ${i+1}): Tên vũ khí sử dụng?`, a: "E" },
                { q: `Câu hỏi mở ô 6 (Tranh ${i+1}): Tên dòng sông/địa danh?`, a: "F" },
                { q: `Câu hỏi mở ô 7 (Tranh ${i+1}): Có mấy cánh quân?`, a: "G" },
                { q: `Câu hỏi mở ô 8 (Tranh ${i+1}): Kết quả trận chiến?`, a: "H" },
                { q: `Câu hỏi mở ô 9 (Tranh ${i+1}): Lực lượng chủ lực?`, a: "I" }
            ]
        });
    }
    await RevealPicture.insertMany(pictureData);

    console.log("✅ HOÀN TẤT! Đã bơm thành công 400 bản ghi dữ liệu vào Database.");
    process.exit();
  } catch (err) {
    console.error("❌ Lỗi:", err);
    process.exit(1);
  }
};

seedData();