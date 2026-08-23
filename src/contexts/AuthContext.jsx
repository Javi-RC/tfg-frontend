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
import { AuthContext } from './AuthContextObj';

const ALLOWED_ROLES = new Set(['employee', 'org_admin', 'unassigned']);
const normalizeRole = (r) => (ALLOWED_ROLES.has(r) ? r : 'unassigned');

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    setUser(parsedUser);
    return {
      authenticated: false,
      user: parsedUser,
    };
  });
  const isLoadingProfile = useRef(false);

  const { authenticated, user } = auth;

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
          setAuth({ authenticated: true, user: normalized });
          setUser(normalized);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(normalized));
        } else {
          setAuth({ authenticated: false, user: null });
          clearStoredUser();
        }
      })
      .catch(() => {
        setAuth({ authenticated: false, user: null });
        clearStoredUser();
      })
      .finally(() => {
        isLoadingProfile.current = false;
      });
  }, [authenticated]);

  const setSession = useCallback((tokenValue, userData) => {
    const normalizedUser = { ...userData, role: normalizeRole(userData.role) };
    if (tokenValue) setToken(tokenValue);
    setAuth({ authenticated: true, user: normalizedUser });
    setUser(normalizedUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(normalizedUser));
  }, []);

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

  const updateProfile = useCallback(async (profileData) => {
    const payload = { ...profileData };
    if (payload.role) payload.role = normalizeRole(payload.role);

    const res = await apiPatchProfile(payload);
    const rawUser = unwrapUser(res) || {};
    const updatedUser = { ...rawUser, role: normalizeRole(rawUser?.role) };
    setAuth((prev) => ({ ...prev, user: updatedUser }));
    setUser(updatedUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
    return res.data;
  }, []);

  const completeOAuthProfile = useCallback(
    async (profileData) => {
      const allowedRoles = ['employee', 'org_admin'];
      const backendRole = allowedRoles.includes(profileData.role) ? profileData.role : 'employee';
      const payload = { ...profileData, role: backendRole };

      const res = await apiCompleteProfile(payload);

      if (res.data.user) {
        setSession(null, res.data.user);
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
      setUser(merged);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }
    return user;
  }, [authenticated, user]);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch {
      // Proceed with local cleanup even if backend call fails
    }
    setAuth({ authenticated: false, user: null });
    clearStoredUser();
  }, []);

  const value = useMemo(
    () => ({
      user,
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
