const normalizeEnvValue = (value) => (typeof value === 'string' ? value.trim() : '');

export const GOOGLE_CLIENT_ID = normalizeEnvValue(process.env.REACT_APP_GOOGLE_CLIENT_ID);

export const API_URL_ENV =
  normalizeEnvValue(process.env.REACT_APP_API_URL) ||
  normalizeEnvValue(process.env.REACT_APP_API_BASE_URL);
