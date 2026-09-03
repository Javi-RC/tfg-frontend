import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  login as apiLogin,
  logout as apiLogout,
  getProfile,
  patchProfile as apiPatchProfile,
  completeProfile as apiCompleteProfile,
} from '../api/auth';
import { unwrapUser } from '../api/responseAdapter';
import { setUser, clearStoredUser, setToken, USER_STORAGE_KEY } from '../api/tokenStore';
import { isPublicRoute } from '../constants/routes';
import { SESSION_STATUS } from '../constants/session';
import { canAccess } from '../utils/authorization';
import { AuthContext } from './AuthContextObj';

const ALLOWED_ROLES = new Set(['employee', 'org_admin', 'unassigned']);
const normalizeRole = (r) => (ALLOWED_ROLES.has(r) ? r : 'unassigned');

/**
 * Reads the cached user kept for first paint.
 *
 * Two rules make this safe to trust for rendering and unsafe to trust for
 * authorization, which is exactly the distinction we want:
 *
 *  1. `role` is dropped. localStorage is writable from the console, so a cached
 *     role is an attacker-controlled value. It is re-read from the server on
 *     every load and never survives from disk. Until then the user holds
 *     `unassigned`, which grants nothing.
 *  2. Corrupt JSON yields null instead of throwing. A bad entry should log the
 *     user out, not crash the application shell on boot.
 *
 * @returns {object|null}
 */
function readCachedUser() {
  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    if (!parsed || typeof parsed !== 'object') return null;

    return { ...parsed, role: 'unassigned' };
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const cachedUser = readCachedUser();
    setUser(cachedUser);

    // A public route never probes, so it is anonymous straight away rather than
    // leaving guards waiting on an answer that will not come.
    const willProbe =
      typeof window !== 'undefined' && !isPublicRoute(window.location.pathname);

    return {
      status: willProbe ? SESSION_STATUS.CHECKING : SESSION_STATUS.ANONYMOUS,
      user: cachedUser,
    };
  });
  const isLoadingProfile = useRef(false);

  const { status, user } = auth;
  const authenticated = status === SESSION_STATUS.AUTHENTICATED;

  const persistUser = useCallback((nextUser) => {
    setUser(nextUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
  }, []);

  useEffect(() => {
    if (isPublicRoute(window.location.pathname)) return;
    if (authenticated) return;
    if (isLoadingProfile.current) return;

    isLoadingProfile.current = true;
    getProfile()
      .then((res) => {
        const rawUser = unwrapUser(res);
        if (rawUser) {
          const normalized = { ...rawUser, role: normalizeRole(rawUser.role) };
          setAuth({ status: SESSION_STATUS.AUTHENTICATED, user: normalized });
          persistUser(normalized);
        } else {
          setAuth({ status: SESSION_STATUS.ANONYMOUS, user: null });
          clearStoredUser();
        }
      })
      .catch((error) => {
        setAuth({ status: SESSION_STATUS.ANONYMOUS, user: null });
        // Only a 401 proves the session is gone. A timeout, a 503 from a
        // serverless backend still waking, or a dropped connection all mean we
        // could not ask — wiping the cache there makes a transport problem look
        // like an expiry and forces a needless sign-in. The status is anonymous
        // either way, so guards stay strict; the cache just survives to be
        // re-validated on the next load.
        if (error?.response?.status === 401) clearStoredUser();
      })
      .finally(() => {
        isLoadingProfile.current = false;
      });
  }, [authenticated, persistUser]);

  const setSession = useCallback(
    (tokenValue, userData) => {
      const normalizedUser = { ...userData, role: normalizeRole(userData.role) };
      if (tokenValue) setToken(tokenValue);
      setAuth({ status: SESSION_STATUS.AUTHENTICATED, user: normalizedUser });
      persistUser(normalizedUser);
    },
    [persistUser]
  );

  const login = useCallback(
    async (credentials) => {
      const res = await apiLogin(credentials);
      setSession(res.data.token, res.data.user);
      return res.data;
    },
    [setSession]
  );

  const loginWithOAuth = useCallback(async (provider) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      console.error('VITE_API_URL is not configured. OAuth login will not work.');
      return;
    }
    window.location.href = `${apiUrl}/auth/${provider}`;
  }, []);

  const updateProfile = useCallback(
    async (profileData) => {
      const payload = { ...profileData };
      if (payload.role) payload.role = normalizeRole(payload.role);

      const res = await apiPatchProfile(payload);
      const rawUser = unwrapUser(res) || {};
      const updatedUser = { ...rawUser, role: normalizeRole(rawUser?.role) };
      setAuth((prev) => ({ ...prev, user: updatedUser }));
      persistUser(updatedUser);
      return res.data;
    },
    [persistUser]
  );

  const completeOAuthProfile = useCallback(
    async (profileData) => {
      const allowedRoles = ['employee', 'org_admin'];
      const backendRole = allowedRoles.includes(profileData.role) ? profileData.role : 'employee';
      const payload = { ...profileData, role: backendRole };

      const res = await apiCompleteProfile(payload);
      const rawUser = unwrapUser(res);

      if (rawUser) {
        setSession(null, rawUser);
      }

      return res.data;
    },
    [setSession]
  );

  const refreshProfile = useCallback(async () => {
    if (!authenticated) return null;

    const res = await getProfile();
    const rawUser = unwrapUser(res);
    if (rawUser) {
      const refreshed = { ...rawUser, role: normalizeRole(rawUser.role) };
      const merged = { ...user, ...refreshed };
      setAuth((prev) => ({ ...prev, user: merged }));
      persistUser(merged);
      return merged;
    }
    return user;
  }, [authenticated, user, persistUser]);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch {
      // Proceed with local cleanup even if backend call fails
    }
    setAuth({ status: SESSION_STATUS.ANONYMOUS, user: null });
    clearStoredUser();
  }, []);

  /**
   * The single authorization predicate for the client.
   *
   * It answers false while the session is still CHECKING, so a caller can never
   * act on a role the server has not confirmed. Client-side checks remain
   * cosmetic — the server is the real boundary — but this keeps them honest.
   *
   * @param {string[]} [roles] Roles that grant access. Omit to require only a session.
   */
  const hasRole = useCallback(
    (roles) => canAccess({ sessionStatus: status, role: user?.role, allowedRoles: roles }),
    [status, user]
  );

  const value = useMemo(
    () => ({
      user,
      sessionStatus: status,
      authenticated,
      hasRole,
      token: null,
      login,
      logout,
      setSession,
      loginWithOAuth,
      updateProfile,
      completeOAuthProfile,
      refreshProfile,
    }),
    [
      user,
      status,
      authenticated,
      hasRole,
      login,
      logout,
      setSession,
      loginWithOAuth,
      updateProfile,
      completeOAuthProfile,
      refreshProfile,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
