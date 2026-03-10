// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Cho phép Frontend (React) và Backend trò chuyện với nhau
app.use(cors());
app.use(express.json());

// Kết nối với kho lưu trữ MongoDB Compass
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Đã thắp sáng đuốc! Kết nối thành công với MongoDB! 🚀'))
.catch((err) => console.log('Gió thổi tắt đuốc, lỗi kết nối MongoDB:', err));

// Kéo các đường dẫn API vào máy chủ
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Cỗ xe thời gian đang chạy trên cổng ${PORT} 🚢`);
});