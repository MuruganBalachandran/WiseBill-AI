import axios from 'axios';

// The base URL can be defined in .env, falling back to local server for dev
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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
