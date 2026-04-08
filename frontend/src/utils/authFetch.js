/**
 * Utility to get auth headers for API requests.
 * Includes JWT token from localStorage for authenticated routes.
 */
export function getAuthHeaders(contentType = 'application/json') {
  const token = localStorage.getItem('token');
  const headers = {};
  
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

/**
 * Wrapper around fetch that automatically includes auth headers.
 * For FormData (file uploads), do NOT set Content-Type — let browser set it.
 */
export async function authFetch(url, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { ...options.headers };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return fetch(url, { ...options, headers });
}
