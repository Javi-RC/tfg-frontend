import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  // Debug: log outgoing requests to verify Authorization header in dev
  try {
    // eslint-disable-next-line no-console
    console.debug('[api] Request', { url: config.url, method: config.method, authHeader: config.headers?.Authorization });
  } catch (e) { }
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

      // Avoid redirect loops if we're already on a public/auth page
      const publicPaths = ['/login', '/register', '/auth/confirm', '/auth/callback', '/oauth-success'];
      const currentPath = (typeof window !== 'undefined' && window.location && window.location.pathname) || '';
      const isOnPublicPage = publicPaths.includes(currentPath);

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
