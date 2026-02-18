import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import { login as apiLogin, getProfile, patchProfile as apiPatchProfile, completeProfile as apiCompleteProfile } from '../api/auth';
import { isPublicRoute } from '../constants/routes';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const isLoadingProfile = useRef(false);

  useEffect(() => {
    // Skip profile loading on public pages
    if (isPublicRoute(window.location.pathname)) {
      return;
    }

    if (!token) return;

    // Normalize roles coming from the backend to avoid invalid enum values
    const ALLOWED_ROLES = ['employee', 'org_admin', 'unassigned'];
    const normalizeRole = (r) => (ALLOWED_ROLES.includes(r) ? r : 'unassigned');

    // If user already present from localStorage, do a background refresh
    // to pick up new fields (e.g. organization) without blocking the UI
    if (user) {
      getProfile().then(res => {
        const rawUser = res?.data?.data?.user || res?.data?.user || res?.data || null;
        if (rawUser) {
          const refreshed = { ...rawUser, role: normalizeRole(rawUser.role) };
          const merged = { ...user, ...refreshed };
          setUser(merged);
          localStorage.setItem('user', JSON.stringify(merged));
        }
      }).catch(() => {
        // Background refresh failed — non-blocking
      });
      return;
    }
    
    if (!user && !isLoadingProfile.current) {
      isLoadingProfile.current = true;
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp && decoded.exp < currentTime) {
          isLoadingProfile.current = false;
          setToken(null);
          setUser(null);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          return;
        }

        getProfile().then(res => {
          const rawUser = res?.data?.data?.user || res?.data?.user || res?.data || null;
          const normalized = rawUser ? { ...rawUser, role: normalizeRole(rawUser.role) } : null;
          setUser(normalized);
          localStorage.setItem('user', JSON.stringify(normalized));
          isLoadingProfile.current = false;
        }).catch(() => {
          isLoadingProfile.current = false;
          setToken(null);
          setUser(null);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        });
      } catch {
        // Invalid token
        isLoadingProfile.current = false;
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, [token]);

  const setSession = useCallback((tokenValue, userData) => {
    setToken(tokenValue);
    // Ensure role is normalized before storing
    const ALLOWED_ROLES = ['employee', 'org_admin', 'unassigned'];
    const normalizeRole = (r) => (ALLOWED_ROLES.includes(r) ? r : 'unassigned');
    const normalizedUser = { ...userData, role: normalizeRole(userData.role) };
    setUser(normalizedUser);
    localStorage.setItem('token', tokenValue);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
  }, []);

  const login = async (credentials) => {
    const res = await apiLogin(credentials);
    setSession(res.data.token, res.data.user);
    return res.data;
  };

  const loginWithOAuth = async (provider) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      console.error('VITE_API_URL is not configured. OAuth login will not work.');
      return;
    }
    window.location.href = `${apiUrl}/auth/${provider}`;
  };

  const updateProfile = async (profileData) => {
    // Normalize role before sending to API to avoid backend enum validation errors
    const ALLOWED_ROLES = ['employee', 'org_admin', 'unassigned'];
    const normalizeRole = (r) => (ALLOWED_ROLES.includes(r) ? r : 'unassigned');
    const payload = { ...profileData };
    if (payload.role) payload.role = normalizeRole(payload.role);

    const res = await apiPatchProfile(payload);
    const rawUser = (res && res.data && (res.data.user || res.data)) || {};
    const updatedUser = { ...rawUser, role: normalizeRole(rawUser?.role) };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return res.data;
  };

  const completeOAuthProfile = async (profileData) => {
    // Backend expects 'employee' or 'org_admin' exactly
    const allowedRoles = ['employee', 'org_admin'];
    const backendRole = allowedRoles.includes(profileData.role) ? profileData.role : 'employee';
    const payload = { ...profileData, role: backendRole };
    
    const res = await apiCompleteProfile(payload);

    // Backend returns new token with updated role
    if (res.data.token) {
      setSession(res.data.token, res.data.user);
    }
    
    return res.data;
  };

  /**
   * Force-refresh the user profile from the API.
   * Useful when the backend adds new fields (e.g. organization).
   */
  const refreshProfile = useCallback(async () => {
    if (!token) return null;
    const ALLOWED_ROLES = ['employee', 'org_admin', 'unassigned'];
    const normalizeRole = (r) => (ALLOWED_ROLES.includes(r) ? r : 'unassigned');

    const res = await getProfile();
    const rawUser = (res && res.data && (res.data.user || res.data)) || null;
    if (rawUser) {
      const refreshed = { ...rawUser, role: normalizeRole(rawUser.role) };
      const merged = { ...user, ...refreshed };
      setUser(merged);
      localStorage.setItem('user', JSON.stringify(merged));
      return merged;
    }
    return user;
  }, [token, user]);

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // No redirigir aquí, dejamos que el componente que llama a logout maneje la navegación
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      setSession,
      loginWithOAuth,
      updateProfile,
      completeOAuthProfile,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;