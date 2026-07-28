import axios from 'axios';
import { isPublicRoute } from '../constants/routes';
import { getUser, clearStoredUser } from './tokenStore';
import i18n from '../i18n';

// If VITE_API_URL is not set, use relative URLs and rely on Vite dev proxy
// (and in production, same-origin deployments).
const baseURL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  // Add language header (normalize to base language code)
  const storedLanguage = localStorage.getItem('i18nextLng');
  const rawLanguage = storedLanguage || i18n.language || 'en';
  const currentLanguage = rawLanguage.split('-')[0];
  config.headers['Accept-Language'] = currentLanguage;

  return config;
});

/**
 * Decides whether a 401 should bounce the user to the login page.
 *
 * @param {{ requestUrl: string, pathname: string, hasUser: boolean }} params
 * @returns {boolean}
 */
export function shouldRedirectToLogin({ requestUrl, pathname, hasUser }) {
  // A 401 from an authentication endpoint is the caller's to handle — for
  // example, signing in with the wrong password.
  const lowerUrl = (requestUrl || '').toLowerCase();
  if (lowerUrl.includes('/auth/')) return false;

  // Never yank someone who was not signed in to begin with. For a visitor a 401
  // is the expected answer to the session probe, not an expiry, and where they
  // belong is the router's call (landing, 404, login) — decided client-side
  // without a full page load. This hard redirect is only for a session that was
  // live and has now gone stale.
  if (!hasUser) return false;

  // Pages meant to be viewed signed-out never bounce either.
  if (isPublicRoute(pathname)) return false;

  return true;
}

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const { response, config } = err || {};
    if (response && response.status === 401) {
      const pathname =
        (typeof window !== 'undefined' && window.location && window.location.pathname) || '';

      const redirect = shouldRedirectToLogin({
        requestUrl: (config && config.url) || '',
        pathname,
        hasUser: Boolean(getUser()),
      });

      if (redirect) {
        // Drop the stale session before leaving. Otherwise the cached user
        // survives the full page load, still looks signed in on the next
        // visit, and bounces to login again — a loop the user cannot exit.
        clearStoredUser();
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
