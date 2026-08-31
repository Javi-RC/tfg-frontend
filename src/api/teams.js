import api from './axios';

export const getMyTeams = () => api.get('/api/teams/my-teams');

export const getTeamById = (id) => api.get(`/api/teams/${id}`);
