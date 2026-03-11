const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config({ path: './backend/.env' });

const createAdmins = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/history_game';
        await mongoose.connect(mongoUri);
        console.log("🚀 Kết nối Database thành công!");

        const admins = [
            { username: 'admin1', password: 'adminPassword123', role: 'admin', experience: 9999 },
            { username: 'admin2', password: 'adminPassword123', role: 'admin', experience: 9999 },
            { username: 'admin3', password: 'adminPassword123', role: 'admin', experience: 9999 }
        ];

        for (const adminData of admins) {
            const existingUser = await User.findOne({ username: adminData.username });
            if (existingUser) {
                console.log(`⚠️  Tài khoản ${adminData.username} đã tồn tại. Đang cập nhật quyền Admin...`);
                existingUser.role = 'admin';
                existingUser.experience = 9999;
                await existingUser.save();
                console.log(`✅ Cập nhật ${adminData.username} thành công!`);
            } else {
                const newAdmin = new User(adminData);
                await newAdmin.save();
                console.log(`✅ Đã tạo mới tài khoản Admin: ${adminData.username}`);
            }
        }

        console.log("✨ Đã hoàn tất việc tạo 3 tài khoản Admin!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Lỗi: ", err);
        process.exit(1);
    }
};

createAdmins();
