const mongoose = require('mongoose');
const Question = require('../models/Question');
const Chronological = require('../models/Chronological');
const GuessCharacter = require('../models/GuessCharacter');
const RevealPicture = require('../models/RevealPicture');
require('dotenv').config({ path: './backend/.env' });

const millionaireData = require('./millionaire_data');
const chronologicalData = require('./chronological_data');
const guessCharacterData = require('./guess_character_data');
const revealPictureData = require('./reveal_picture_data');

const seedAllModes = async () => {
    try {
        console.log("Đang kết nối tới MongoDB...");
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/game_nckh');
        console.log("Kết nối thành công!");

        // 1. Clear existing data for these modes
        console.log("Đang xóa dữ liệu cũ...");
        await Question.deleteMany({ type: 'millionaire' });
        await Chronological.deleteMany({});
        await GuessCharacter.deleteMany({});
        await RevealPicture.deleteMany({});
        console.log("✅ Đã xóa dữ liệu cũ.");

        // 1. Seed Millionaire (Mode 7) -> uses the general Question model but with type: 'millionaire'
        console.log(`Đang nạp ${millionaireData.length} câu hỏi Ai là triệu phú...`);
        await Question.insertMany(millionaireData);
        console.log("✅ Hoàn thành nạp câu hỏi Ai là triệu phú.");

        // 2. Seed Chronological (Mode 6)
        console.log(`Đang nạp ${chronologicalData.length} câu hỏi Sắp xếp sự kiện...`);
        await Chronological.insertMany(chronologicalData);
        console.log("✅ Hoàn thành nạp câu hỏi Sắp xếp sự kiện.");

        // 3. Seed GuessCharacter (Mode 8)
        console.log(`Đang nạp ${guessCharacterData.length} nhân vật lịch sử...`);
        await GuessCharacter.insertMany(guessCharacterData);
        console.log("✅ Hoàn thành nạp nhân vật lịch sử.");

        // 4. Seed RevealPicture (Mode 9)
        console.log(`Đang nạp ${revealPictureData.length} câu hỏi Lật mảnh ghép...`);
        await RevealPicture.insertMany(revealPictureData);
        console.log("✅ Hoàn thành nạp câu hỏi Lật mảnh ghép.");

        console.log("🎉 TẤT CẢ DỮ LIỆU ĐÃ ĐƯỢC NẠP THÀNH CÔNG!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Có lỗi xảy ra trong quá trình nạp dữ liệu:", err);
        process.exit(1);
    }
};

seedAllModes();
