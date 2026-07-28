import api from './axios';

export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const logout = () => api.post('/auth/logout');
export const confirmAccount = (token) =>
  api.get(`/auth/confirm?token=${encodeURIComponent(token)}`);
export const resendConfirmation = (data) => api.post('/auth/send-confirmation', data);
export const getProfile = () => api.get('/api/profile');
export const updateProfile = (profileData) => api.put('/auth/profile', profileData);
export const patchProfile = (profileData) => api.patch('/api/profile', profileData);
export const completeProfile = (profileData) => api.put('/auth/complete-profile', profileData);

