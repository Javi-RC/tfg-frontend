import api from './axios';

export const getDeletionPrerequisites = () => api.get('/api/profile/deletion-prerequisites');

export const deleteAccount = (payload) => api.delete('/api/profile/account', { data: payload });


