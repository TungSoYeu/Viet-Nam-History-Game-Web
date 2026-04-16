import { API_URL_ENV } from './env';
const API_BASE_URL = API_URL_ENV || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');

export default API_BASE_URL;
