const mongoose = require('mongoose');

let cachedConnection = null;
let connectionPromise = null;

const connectDB = async () => {
    // Already connected
    if (mongoose.connection.readyState === 1) {
        return cachedConnection;
    }
    if (connectionPromise) {
        return connectionPromise;
    }
    if (mongoose.connection.readyState === 2) {
        return new Promise((resolve, reject) => {
            mongoose.connection.once('connected', () => resolve(cachedConnection));
            mongoose.connection.once('error', reject);
        });
    }

    try {
        if (!process.env.MONGO_URI) {
            throw new Error("Biến môi trường MONGO_URI chưa được thiết lập.");
        }

        connectionPromise = mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
        });
        
        const conn = await connectionPromise;
        cachedConnection = conn;
        connectionPromise = null;
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        connectionPromise = null;
        console.error(`❌ Lỗi kết nối MongoDB: ${error.message}`);
        throw error; 
    }
};

module.exports = connectDB;
