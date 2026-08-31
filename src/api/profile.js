import api from './axios';

export const getProfileStats = () => api.get('/api/profile/stats');

export const getProfileActivity = () => api.get('/api/profile/activity');
