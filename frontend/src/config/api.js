// Centralized API base URL configuration.
// In development, defaults to localhost:5000.
// In production (Vercel), defaults to '' (same origin - frontend and API on same domain).
const API_BASE_URL = process.env.REACT_APP_API_URL !== undefined && process.env.REACT_APP_API_URL !== ''
    ? process.env.REACT_APP_API_URL
    : (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');

export default API_BASE_URL;
