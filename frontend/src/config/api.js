import { API_URL_ENV } from './env';

// Centralized API base URL configuration.
// In development, defaults to localhost:5000.
// In production (Vercel/Render same-origin), defaults to ''.
const API_BASE_URL = API_URL_ENV || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');

export default API_BASE_URL;
