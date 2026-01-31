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
    console.log('[AuthContext useEffect] Triggered - token:', token ? 'present' : 'missing', 'user:', user ? 'present' : 'missing');
    console.log('[AuthContext useEffect] Current path:', window.location.pathname);
    console.log('[AuthContext useEffect] Is public route:', isPublicRoute(window.location.pathname));
    
    // No intentar cargar perfil si estamos en páginas públicas
    if (isPublicRoute(window.location.pathname)) {
      console.log('[AuthContext useEffect] Skipping profile load - public route');
      return;
    }
    
    // Don't fetch profile if we already have user data
    if (user) {
      console.log('[AuthContext useEffect] Skipping profile load - user already present');
      return;
    }
    
    if (token && !user && !isLoadingProfile.current) {
      console.log('[AuthContext useEffect] Starting profile load');
      isLoadingProfile.current = true;
      try {
        const decoded = jwtDecode(token);
        console.log('[AuthContext useEffect] Decoded token:', decoded);
        
        // Verificar si el token ha expirado
        const currentTime = Date.now() / 1000;
        if (decoded.exp && decoded.exp < currentTime) {
          console.log('[AuthContext useEffect] Token expired, clearing session');
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

        console.log('[AuthContext useEffect] Fetching profile from API');
        getProfile().then(res => {
          console.log('[AuthContext useEffect] Profile fetched successfully');
          const rawUser = (res && res.data && (res.data.user || res.data)) || null;
          const normalized = rawUser ? { ...rawUser, role: normalizeRole(rawUser.role) } : null;
          setUser(normalized);
          localStorage.setItem('user', JSON.stringify(normalized));
          isLoadingProfile.current = false;
        }).catch(err => {
          console.error('[AuthContext useEffect] Profile fetch failed:', err);
          isLoadingProfile.current = false;
          // Limpiar datos inválidos sin redirigir (ProtectedRoute se encargará)
          setToken(null);
          setUser(null);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        });
      } catch (err) {
        console.error('[AuthContext useEffect] Error decoding token:', err);
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
    console.log('[AuthContext] Setting session with token:', tokenValue ? 'present' : 'missing');
    console.log('[AuthContext] User data:', userData);
    
    setToken(tokenValue);
    // Ensure role is normalized before storing
    const ALLOWED_ROLES = ['employee', 'org_admin', 'unassigned'];
    const normalizeRole = (r) => (ALLOWED_ROLES.includes(r) ? r : 'unassigned');
    const normalizedUser = { ...userData, role: normalizeRole(userData.role) };
    setUser(normalizedUser);
    localStorage.setItem('token', tokenValue);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
    
    console.log('[AuthContext] Token stored in localStorage:', localStorage.getItem('token') ? 'yes' : 'no');
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
    console.log('[AuthContext updateProfile] Called with data:', profileData);
    console.log('[AuthContext updateProfile] Token in localStorage:', localStorage.getItem('token') ? 'present' : 'missing');
    console.log('[AuthContext updateProfile] Current user state:', user);
    
    // Normalize role before sending to API to avoid backend enum validation errors
    const ALLOWED_ROLES = ['employee', 'org_admin', 'unassigned'];
    const normalizeRole = (r) => (ALLOWED_ROLES.includes(r) ? r : 'unassigned');
    const payload = { ...profileData };
    if (payload.role) payload.role = normalizeRole(payload.role);

    console.log('[AuthContext updateProfile] Calling apiPatchProfile with payload:', payload);
    const res = await apiPatchProfile(payload);
    console.log('[AuthContext updateProfile] Response received:', res);
    const rawUser = (res && res.data && (res.data.user || res.data)) || {};
    const updatedUser = { ...rawUser, role: normalizeRole(rawUser?.role) };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return res.data;
  };

  const completeOAuthProfile = async (profileData) => {
    console.log('[AuthContext completeOAuthProfile] Called with data:', profileData);
    console.log('[AuthContext completeOAuthProfile] Token in localStorage:', localStorage.getItem('token') ? 'present' : 'missing');
    
    // El backend espera 'employee' o 'org_admin' exactamente
    const allowedRoles = ['employee', 'org_admin'];
    const backendRole = allowedRoles.includes(profileData.role) ? profileData.role : 'employee';
    const payload = { ...profileData, role: backendRole };
    
    console.log('[AuthContext completeOAuthProfile] Calling apiCompleteProfile with payload:', payload);
    const res = await apiCompleteProfile(payload);
    console.log('[AuthContext completeOAuthProfile] Response received:', res);
    
    // Backend returns new token with updated role
    if (res.data.token) {
      const newToken = res.data.token;
      const userData = res.data.user;
      console.log('[AuthContext completeOAuthProfile] Updating session with new token');
      setSession(newToken, userData);
    }
    
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
      updateProfile,
      completeOAuthProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;