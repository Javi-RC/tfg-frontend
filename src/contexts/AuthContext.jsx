import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import * as jwtDecodeModule from 'jwt-decode';
const jwtDecode = jwtDecodeModule && (jwtDecodeModule.default || jwtDecodeModule);
import { login as apiLogin, getProfile, updateProfile as apiUpdateProfile } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const isLoadingProfile = useRef(false);

  useEffect(() => {
    if (token && !user && !isLoadingProfile.current) {
      isLoadingProfile.current = true;
      try {
        jwtDecode(token);
        // Normalize roles coming from the backend to avoid invalid enum values
        const ALLOWED_ROLES = ['employee', 'org_admin', 'unassigned'];
        const normalizeRole = (r) => (ALLOWED_ROLES.includes(r) ? r : 'unassigned');

        getProfile().then(res => {
          const normalized = { ...res.data, role: normalizeRole(res.data.role) };
          setUser(normalized);
          localStorage.setItem('user', JSON.stringify(normalized));
          isLoadingProfile.current = false;
        }).catch(() => {
          isLoadingProfile.current = false;
          logout();
        });
      } catch {
        isLoadingProfile.current = false;
        logout();
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
    // Use import.meta.env instead of process.env for Vite
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    window.location.href = `${apiUrl}/auth/${provider}`;
  };

  const updateProfile = async (profileData) => {
    // Normalize role before sending to API to avoid backend enum validation errors
    const ALLOWED_ROLES = ['employee', 'org_admin', 'unassigned'];
    const normalizeRole = (r) => (ALLOWED_ROLES.includes(r) ? r : 'unassigned');
    const payload = { ...profileData };
    if (payload.role) payload.role = normalizeRole(payload.role);

    // Debug: ensure payload contains expected values before sending
    try {
      // eslint-disable-next-line no-console
      console.debug('[Auth] updateProfile payload', payload);
    } catch (e) { }

    const res = await apiUpdateProfile(payload);
    const updatedUser = { ...res.data.user, role: normalizeRole(res.data.user?.role) };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return res.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      setSession,
      loginWithOAuth,
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;