import axios from 'axios';
import { isPublicRoute } from '../constants/routes';

// If VITE_API_URL is not set, use relative URLs and rely on Vite dev proxy
// (and in production, same-origin deployments).
const baseURL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    const { response, config } = err || {};
    if (response && response.status === 401) {
      // Don't forcibly redirect when the 401 comes from authentication endpoints
      // (for example when trying to log in with invalid credentials).
      // Allow the caller to handle the error in those cases.
      const requestUrl = (config && (config.url || '')) || '';
      const lowerUrl = requestUrl.toLowerCase();

      const isAuthEndpoint = (
        lowerUrl.includes('/auth/login') ||
        lowerUrl.includes('/auth/register') ||
        lowerUrl.includes('/auth/confirm') ||
        // If your API uses an /auth/ prefix for other auth flows, include it
        lowerUrl.includes('/auth/')
      );

      const currentPath = (typeof window !== 'undefined' && window.location && window.location.pathname) || '';
      const isOnPublicPage = isPublicRoute(currentPath);

      if (!isAuthEndpoint && !isOnPublicPage) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
