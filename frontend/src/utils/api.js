import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

// Attach JWT token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('teachs_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('teachs_token');
      localStorage.removeItem('teachs_user');
      // Don't redirect if user filled guest lead form — they don't need a full account
      const isGuest = !!localStorage.getItem('teachs_guest');
      if (!isGuest && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
