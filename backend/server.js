const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Load env vars (only when running locally, Vercel uses dashboard env vars)
if (!process.env.VERCEL) {
    dotenv.config({ override: true });
}

// Connect to database
connectDB().catch(err => console.error("Không thể kết nối DB ngay từ đầu:", err));

const app = express();

// CORS Configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? [process.env.CLIENT_URL, 'https://project-game-nckh.onrender.com'].filter(Boolean)
        : ['http://localhost:3000'],
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// Serve uploaded files (only for local development, not needed on Vercel)
if (!process.env.VERCEL) {
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
}

// Mount routers
const questionRoutes = require('./routes/questionRoutes');
const apiRoutes = require('./routes/api');

app.use('/api/questions', questionRoutes);
app.use('/api', apiRoutes);

// --- PRODUCTION: Serve React frontend (only for non-Vercel deploys like Render) ---
if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
    app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
    });
}

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Lỗi máy chủ nội bộ"
    });
});

// Only listen when running locally (Vercel manages the HTTP server)
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
}

// Export app for Vercel serverless function
module.exports = app;