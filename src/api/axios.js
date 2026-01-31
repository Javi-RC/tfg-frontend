import axios from 'axios';
import { isPublicRoute } from '../constants/routes';
import i18n from '../i18n';

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
  console.log('[axios interceptor] Token from localStorage:', token ? 'present' : 'missing');
  if (token) {
    console.log('[axios interceptor] Token value (first 20 chars):', token.substring(0, 20));
  }
  console.log('[axios interceptor] Request URL:', config.url);
  console.log('[axios interceptor] Request method:', config.method);
  
  // Add language header (normalize to base language code)
  // Force refresh from localStorage to get the most recent value
  const storedLanguage = localStorage.getItem('i18nextLng');
  const rawLanguage = storedLanguage || i18n.language || 'en';
  const currentLanguage = rawLanguage.split('-')[0]; // Extract base language (en, es)
  
  // Additional debugging
  console.log('[axios interceptor] ============ LANGUAGE DEBUG ============');
  console.log('[axios interceptor] localStorage i18nextLng:', storedLanguage);
  console.log('[axios interceptor] i18n.language (raw):', i18n.language);
  console.log('[axios interceptor] Final language used:', currentLanguage);
  console.log('[axios interceptor] =======================================');
  
  config.headers['Accept-Language'] = currentLanguage;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('[axios interceptor] Authorization header set:', config.headers.Authorization ? 'yes' : 'no');
  } else {
    console.warn('[axios interceptor] NO TOKEN FOUND - Request will fail if authentication is required');
  }
  
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
