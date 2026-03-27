// Vercel Serverless Function entry point
// This wraps the Express app and exports it as a serverless handler

// Load environment variables
require('dotenv').config({ path: require('path').join(__dirname, '..', 'backend', '.env') });

// Import the Express app. Database connection is handled gracefully by middleware inside server.js
const app = require('../backend/server');

// Export as Vercel serverless function
module.exports = app;
