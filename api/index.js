// Vercel Serverless Function entry point
// This wraps the Express app and exports it as a serverless handler

// Load environment variables
require('dotenv').config({ path: require('path').join(__dirname, '..', 'backend', '.env') });

// Connect to MongoDB (with caching for serverless)
const connectDB = require('../backend/config/db');
connectDB();

// Import the Express app
const app = require('../backend/server');

// Export as Vercel serverless function
module.exports = app;
