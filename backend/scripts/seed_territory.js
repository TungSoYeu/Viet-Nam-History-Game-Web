const mongoose = require('mongoose');
const Question = require('../models/Question');
const Lesson = require('../models/Lesson');
require('dotenv').config({ path: './backend/.env' });

const territoryQuestions = [
    {
        content: "Ải Chi Lăng, nơi Liễu Thăng bị chém đầu, thuộc tỉnh nào ngày nay?",
        options: ["Cao Bằng", "Lạng Sơn", "Bắc Giang", "Thái Nguyên"],
        correctAnswer: "Lạng Sơn",
        explanation: "Ải Chi Lăng là một cửa ải hiểm yếu tại tỉnh Lạng Sơn.",
        location: "lang-son",
        difficulty: 2
    },
    {
        content: "Trong cuộc kháng chiến chống quân Minh, nghĩa quân Lam Sơn đã giành thắng lợi vang dội tại đâu ở Lạng Sơn?",
        options: ["Ải Chi Lăng", "Ải Nam Quan", "Mẫu Sơn", "Đồng Đăng"],
        correctAnswer: "Ải Chi Lăng",
        explanation: "Chiến thắng Chi Lăng năm 1427 đã tiêu diệt đạo quân viện binh của Liễu Thăng.",
        location: "lang-son",
        difficulty: 2
    },
    {
        content: "Vị tướng nào của nhà Minh đã tử trận tại ải Chi Lăng?",
        options: ["Thoát Hoan", "Liễu Thăng", "Toa Đô", "Ô Mã Nhi"],
        correctAnswer: "Liễu Thăng",
        explanation: "Liễu Thăng bị chém đầu tại núi Mã Yên, Chi Lăng.",
        location: "lang-son",
        difficulty: 3
    },
    {
        content: "Trận chiến trên sông Bạch Đằng năm 938 do ai chỉ huy?",
        options: ["Lê Hoàn", "Ngô Quyền", "Trần Hưng Đạo", "Lý Thường Kiệt"],
        correctAnswer: "Ngô Quyền",
        explanation: "Ngô Quyền đánh bại quân Nam Hán trên sông Bạch Đằng.",
        location: "quang-ninh",
        difficulty: 1
    },
    {
        content: "Sông Bạch Đằng, nơi diễn ra 3 chiến thắng vĩ đại, chảy qua địa phận các tỉnh nào?",
        options: ["Quảng Ninh và Hải Phòng", "Hà Nội và Hưng Yên", "Nghệ An và Hà Tĩnh", "Nam Định và Thái Bình"],
        correctAnswer: "Quảng Ninh và Hải Phòng",
        explanation: "Sông Bạch Đằng là ranh giới giữa Quảng Ninh và Hải Phòng.",
        location: "quang-ninh",
        difficulty: 2
    },
    {
        content: "Năm 1288, Trần Hưng Đạo đã đánh bại quân Nguyên Mông lần thứ 3 tại đâu?",
        options: ["Sông Hồng", "Sông Bạch Đằng", "Ải Chi Lăng", "Vân Đồn"],
        correctAnswer: "Sông Bạch Đằng",
        explanation: "Trận Bạch Đằng 1288 tiêu diệt hoàn toàn thủy quân Nguyên.",
        location: "quang-ninh",
        difficulty: 2
    }
];

const seedTerritory = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const lessons = await Lesson.find();
        
        const hauLe = lessons.find(l => l.title.includes("Hậu Lê"));
        const ngoDinh = lessons.find(l => l.title.includes("Ngô - Đinh"));
        const tran = lessons.find(l => l.title.includes("Trần"));

        const data = territoryQuestions.map(q => {
            if (q.content.includes("Minh") || q.content.includes("Liễu Thăng")) q.lessonId = hauLe._id;
            else if (q.content.includes("938") || q.content.includes("Ngô Quyền")) q.lessonId = ngoDinh._id;
            else q.lessonId = tran._id;
            return q;
        });

        await Question.insertMany(data);
        console.log("✅ Đã nạp câu hỏi cho bản đồ lãnh thổ (Lạng Sơn & Quảng Ninh)");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedTerritory();
