import axios from 'axios';

// Read base URL from .env (NEXT_PUBLIC_API_URL), stripping trailing /api or slashes for clean endpoint joining
const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const baseURL = rawUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// We can add interceptors here later if we need token auth or global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
