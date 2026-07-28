import api from './axios';

/**
 * Get user's language preferences
 * @returns {Promise} Response with language data
 */
export const getLanguagePreference = () => api.get('/api/profile/language');

/**
 * Update user's preferred language
 * @param {string} language - Language code ('en' or 'es')
 * @returns {Promise} Response confirming update
 */
export const updateLanguagePreference = (language) =>
  api.patch('/api/profile/language', { language });


