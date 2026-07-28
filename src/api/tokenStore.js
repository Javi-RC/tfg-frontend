// Auth lives in an httpOnly cookie; this only mirrors the user the app renders,
// so non-React code (the axios interceptor) can read it synchronously.
export const USER_STORAGE_KEY = 'user:v1';

let currentUser = null;

export const getUser = () => currentUser;
export const setUser = (user) => {
  currentUser = user;
};

/** Forgets the cached user, in memory and on disk. */
export const clearStoredUser = () => {
  currentUser = null;
  localStorage.removeItem(USER_STORAGE_KEY);
};
