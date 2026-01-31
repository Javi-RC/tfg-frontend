import api from './axios';

export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const confirmAccount = (token) => api.get(`/auth/confirm?token=${encodeURIComponent(token)}`);
export const resendConfirmation = (data) => api.post('/auth/send-confirmation', data);
export const getProfile = () => api.get('/api/profile');
// The backend mounts the profile update handler under the '/auth' prefix
// so the full endpoint is PUT /auth/profile
export const updateProfile = (profileData) => api.put('/auth/profile', profileData);

// New profile update endpoint
// PATCH /api/profile updates only provided fields
export const patchProfile = (profileData) => {
  console.log('[auth.js patchProfile] Input data:', profileData);
  console.log('[auth.js patchProfile] Stringified:', JSON.stringify(profileData));
  return api.patch('/api/profile', profileData);
};

// Complete profile after OAuth (PUT /auth/complete-profile)
// Can send token in body or will use Authorization header from interceptor
export const completeProfile = (profileData) => {
  console.log('[auth.js completeProfile] Input data:', profileData);
  return api.put('/auth/complete-profile', profileData);
};

export default {
  register,
  login,
  confirmAccount,
  resendConfirmation,
  getProfile,
  updateProfile,
  patchProfile,
  completeProfile
};
