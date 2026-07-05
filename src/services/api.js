/* global process */
/**
 * Reusable HTTP API client.
 */
const BASE_URL = (
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.WORKER_BASE_API_URL) ||
  (typeof process !== 'undefined' && process.env && process.env.WORKER_BASE_API_URL) ||
  ''
).replace(/\/$/, '');

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);

  // Handle empty or non-JSON responses gracefully (e.g. for DELETE or 204 No Content)
  let data = null;
  if (response.status !== 204) {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
  }

  if (!response.ok) {
    // Attempt to extract detailed error message from response body
    const errorMessage = (data && typeof data === 'object' && (data.message || data.error)) 
      || `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return data;
}

export const api = {
  get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) => request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body, options) => request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  patch: (endpoint, body, options) => request(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: (endpoint, options) => request(endpoint, { ...options, method: 'DELETE' }),
};
