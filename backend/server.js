const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

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

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routers
const questionRoutes = require('./routes/questionRoutes');
const apiRoutes = require('./routes/api');

app.use('/api/questions', questionRoutes);
app.use('/api', apiRoutes);

// --- PRODUCTION: Serve React frontend ---
if (process.env.NODE_ENV === 'production') {
    // Serve static files from React build
    app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

    // Catch-all: send back React's index.html for client-side routing
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
    });
}

// Global Error Handler (Must return JSON)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Lỗi máy chủ nội bộ"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});