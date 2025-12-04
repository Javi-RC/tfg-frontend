import api from './axios';

export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const confirmAccount = (token) => api.get(`/auth/confirm?token=${encodeURIComponent(token)}`);
export const resendConfirmation = (data) => api.post('/auth/send-confirmation', data);
export const getProfile = () => api.get('/api/profile');
// The backend mounts the profile update handler under the '/auth' prefix
// so the full endpoint is PUT /auth/profile
export const updateProfile = (profileData) => api.put('/auth/profile', profileData);

export default {
  register,
  login,
  confirmAccount,
  resendConfirmation,
  getProfile,
  updateProfile
};
