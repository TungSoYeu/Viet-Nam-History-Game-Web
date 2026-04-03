const mongoose = require('mongoose');

let cachedConnection = null;

const connectDB = async () => {
    if (cachedConnection && mongoose.connection.readyState === 1) {
        return cachedConnection;
    }

    try {
        if (!process.env.MONGO_URI) {
            throw new Error("Biến môi trường MONGO_URI chưa được thiết lập.");
        }
        
        // Thêm timeout cho connect để không bị treo serverless function
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        
        cachedConnection = conn;
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`❌ Lỗi kết nối MongoDB: ${error.message}`);
        throw error; 
    }
};

module.exports = connectDB;