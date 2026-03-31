const mongoose = require('mongoose');
const Matching = require('../models/Matching');
require('dotenv').config({ path: __dirname + '/../.env' }); // Load dot env from backend

const URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/history_game';

const seedData = async () => {
    try {
        await mongoose.connect(URI);
        console.log("Connected to MongoDB for Matching seeding");

        // Wipe old data
        await Matching.deleteMany({});
        
        const matchingGame = {
            title: "Danh Tướng và Chiến Công",
            type: "Custom",
            difficulty: 1,
            pairs: [
                {
                    left: "Ngô Quyền",
                    right: "Trận Bạch Đằng (938)",
                    image: "/assets/images/matching_ngo_quyen_1774160599192.png"
                },
                {
                    left: "Lý Thường Kiệt",
                    right: "Trận Như Nguyệt (1077)",
                    image: "/assets/images/matching_ly_thuong_kiet_1774160614363.png"
                },
                {
                    left: "Trần Hưng Đạo",
                    right: "Trận Bạch Đằng (1288)",
                    image: "/assets/images/matching_tran_hung_dao_1774160632285.png"
                },
                {
                    left: "Lê Lợi",
                    right: "Khởi nghĩa Lam Sơn",
                    image: "/assets/images/matching_le_loi_1774160648244.png"
                },
                {
                    left: "Quang Trung",
                    right: "Trận Ngọc Hồi - Đống Đa (1789)",
                    image: "/assets/images/vietnam_history_hero_1774157920838.png"
                }
            ]
        };

        await Matching.create(matchingGame);
        console.log("Seeding complete. Inserted 'Danh Tướng và Chiến Công' Matching game.");
        process.exit(0);
    } catch (error) {
        console.error("Seeding error:", error);
        process.exit(1);
    }
};

seedData();
