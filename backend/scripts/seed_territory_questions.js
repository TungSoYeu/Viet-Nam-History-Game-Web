// file: backend/scripts/seed_territory_questions.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Question = require('../models/Question');

dotenv.config({ path: '../.env' }); // Trỏ đúng đường dẫn tới file .env của bạn

const territoryQuestions = [
    // --- CỨ ĐIỂM: ẢI CHI LĂNG ---
    {
        content: "Trong trận Chi Lăng năm 1427, tướng giặc nào đã bị quân ta chém đầu tại trận?",
        options: ["Vương Thông", "Liễu Thăng", "Mộc Thạnh", "Lương Nhữ Hốt"],
        correctAnswer: "Liễu Thăng",
        explanation: "Liễu Thăng dẫn 10 vạn viện binh sang nhưng bị phục kích và chém đầu tại núi Mã Yên (Chi Lăng).",
        type: "territory",
        region: "chi-lang",
        difficulty: "medium"
    },
    {
        content: "Ai là người trực tiếp chỉ huy trận phục kích giặc Minh tại Ải Chi Lăng?",
        options: ["Lê Lợi", "Nguyễn Trãi", "Lê Sát và Lưu Nhân Chú", "Trần Nguyên Hãn"],
        correctAnswer: "Lê Sát và Lưu Nhân Chú",
        explanation: "Lê Sát và Lưu Nhân Chú được Lê Lợi giao nhiệm vụ mai phục quân Minh tại Ải Chi Lăng.",
        type: "territory",
        region: "chi-lang",
        difficulty: "hard"
    },

    // --- CỨ ĐIỂM: SÔNG BẠCH ĐẰNG ---
    {
        content: "Năm 938, Ngô Quyền đã đánh bại quân xâm lược nào trên sông Bạch Đằng?",
        options: ["Quân Tống", "Quân Nguyên Mông", "Quân Nam Hán", "Quân Minh"],
        correctAnswer: "Quân Nam Hán",
        explanation: "Chiến thắng Bạch Đằng năm 938 đánh bại quân Nam Hán, chấm dứt 1000 năm Bắc thuộc.",
        type: "territory",
        region: "bach-dang",
        difficulty: "easy"
    },
    {
        content: "Đại tướng nào đã chỉ huy trận Bạch Đằng năm 1288 đánh tan quân Nguyên Mông?",
        options: ["Trần Thủ Độ", "Trần Hưng Đạo", "Trần Quang Khải", "Phạm Ngũ Lão"],
        correctAnswer: "Trần Hưng Đạo",
        explanation: "Trần Quốc Tuấn (Trần Hưng Đạo) là tổng chỉ huy, dùng kế cắm cọc gỗ tiêu diệt hoàn toàn thủy quân Nguyên Mông.",
        type: "territory",
        region: "bach-dang",
        difficulty: "medium"
    },

    // --- CỨ ĐIỂM: ĐIỆN BIÊN PHỦ ---
    {
        content: "Chiến dịch Điện Biên Phủ kết thúc thắng lợi vào ngày tháng năm nào?",
        options: ["07/05/1954", "30/04/1975", "02/09/1945", "19/12/1946"],
        correctAnswer: "07/05/1954",
        explanation: "Chiều ngày 7/5/1954, lá cờ 'Quyết chiến Quyết thắng' tung bay trên nóc hầm tướng De Castries.",
        type: "territory",
        region: "dien-bien-phu",
        difficulty: "easy"
    },
    {
        content: "Khẩu hiệu nổi tiếng trong công tác hậu cần chiến dịch Điện Biên Phủ là gì?",
        options: ["Thà hi sinh tất cả chứ nhất định không chịu mất nước", "Tất cả cho tiền tuyến, tất cả để chiến thắng", "Quyết tử để Tổ quốc quyết sinh", "Không có gì quý hơn độc lập tự do"],
        correctAnswer: "Tất cả cho tiền tuyến, tất cả để chiến thắng",
        explanation: "Đây là khẩu hiệu huy động tối đa sức người, sức của cho chiến dịch lịch sử này.",
        type: "territory",
        region: "dien-bien-phu",
        difficulty: "medium"
    }
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/suviethungca', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log("Connected to MongoDB");
    
    // Xóa câu hỏi cũ của mode territory (nếu cần)
    await Question.deleteMany({ type: 'territory' });
    console.log("Deleted old territory questions");

    // Thêm câu hỏi mới
    await Question.insertMany(territoryQuestions);
    console.log("Successfully seeded territory questions!");
    
    process.exit();
}).catch(err => {
    console.error("Error connecting to database:", err);
    process.exit(1);
});