// Vercel Serverless Function entry point
// This wraps the Express app and exports it as a serverless handler

// Import the Express app. Database connection is handled gracefully by middleware inside server.js
// Do NOT require('dotenv') here as it causes MODULE_NOT_FOUND on Vercel. 
// backend/server.js already loads dotenv for local environments.
const app = require('../backend/server');

// Export as Vercel serverless function
module.exports = app;

