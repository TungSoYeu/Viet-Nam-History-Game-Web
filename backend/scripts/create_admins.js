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
                
                // Tránh lỗi duplicate key từ MongoDB cho những email rỗng cũ
                if (existingUser.email && existingUser.email.trim() === '') {
                    existingUser.email = undefined;
                }
                if (!existingUser.email) existingUser.email = undefined;

                await existingUser.save();
                console.log(`✅ Cập nhật ${adminData.username} thành công!`);
            } else {
                const newAdmin = new User(adminData);
                try {
                    await newAdmin.save();
                    console.log(`✅ Đã tạo mới tài khoản Admin: ${adminData.username}`);
                } catch (saveErr) {
                    console.error(`❌ Lỗi khi lưu ${adminData.username}:`, saveErr.message);
                }
            }
        }

        console.log("✨ Đã hoàn tất việc xử lý 3 tài khoản Admin!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Lỗi Tổng quát: ", err);
        process.exit(1);
    }
};

createAdmins();
