import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import { login as apiLogin, getProfile, patchProfile as apiPatchProfile } from '../api/auth';
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
    // No intentar cargar perfil si estamos en páginas públicas
    if (isPublicRoute(window.location.pathname)) {
      return;
    }
    
    if (token && !user && !isLoadingProfile.current) {
      isLoadingProfile.current = true;
      try {
        const decoded = jwtDecode(token);
        
        // Verificar si el token ha expirado
        const currentTime = Date.now() / 1000;
        if (decoded.exp && decoded.exp < currentTime) {
          isLoadingProfile.current = false;
          // Token expirado, limpiar y no redirigir (ProtectedRoute se encargará)
          setToken(null);
          setUser(null);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          return;
        }
        
        // Normalize roles coming from the backend to avoid invalid enum values
        const ALLOWED_ROLES = ['employee', 'org_admin', 'unassigned'];
        const normalizeRole = (r) => (ALLOWED_ROLES.includes(r) ? r : 'unassigned');

        getProfile().then(res => {
          const rawUser = (res && res.data && (res.data.user || res.data)) || null;
          const normalized = rawUser ? { ...rawUser, role: normalizeRole(rawUser.role) } : null;
          setUser(normalized);
          localStorage.setItem('user', JSON.stringify(normalized));
          isLoadingProfile.current = false;
        }).catch(() => {
          isLoadingProfile.current = false;
          // Limpiar datos inválidos sin redirigir (ProtectedRoute se encargará)
          setToken(null);
          setUser(null);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        });
      } catch {
        isLoadingProfile.current = false;
        // Token inválido o corrupto, limpiar sin redirigir
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, [token, user]);

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

    const res = await apiPatchProfile(payload);
    const rawUser = (res && res.data && (res.data.user || res.data)) || {};
    const updatedUser = { ...rawUser, role: normalizeRole(rawUser?.role) };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return res.data;
  };

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
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;