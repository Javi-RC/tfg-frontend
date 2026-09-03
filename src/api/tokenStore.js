// Auth lives primarily in an httpOnly cookie, with the JWT mirrored here as a
// fallback for browsers that block third-party cookies (Brave, Safari). This
// also lets non-React code (the axios interceptor) read it synchronously.
export const USER_STORAGE_KEY = 'user:v1';
export const TOKEN_STORAGE_KEY = 'token:v1';

let currentUser = null;

export const getUser = () => currentUser;
export const setUser = (user) => {
  currentUser = user;
};

export const getToken = () => localStorage.getItem(TOKEN_STORAGE_KEY);
export const setToken = (token) => {
  if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token);
};

/** Forgets the cached session — user and fallback token — in memory and on disk. */
export const clearStoredUser = () => {
  currentUser = null;
  localStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(TOKEN_STORAGE_KEY);
};

/**
 * Whether a previous visit cached a session on disk.
 *
 * Reads localStorage directly because this is called before AuthProvider
 * mounts, when the in-memory copy above is still null. Never trust it for
 * authorization — all it decides is whether boot should wait for the backend.
 */
export const hasStoredUser = () => {
  try {
    return Boolean(localStorage.getItem(USER_STORAGE_KEY));
  } catch {
    return false;
  }
};
