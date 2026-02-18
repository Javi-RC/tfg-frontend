import api from './axios';
import i18n from '../i18n';

/**
 * BFI-44 API Service
 * Handles all Big Five Inventory (BFI-44) related API calls
 */

/**
 * Get current language from i18n
 * @returns {string} Current language code ('en' or 'es')
 */
const getCurrentLanguage = () => {
  const rawLanguage = i18n.language || 'en';
  return rawLanguage.split('-')[0]; // Extract base language
};

/**
 * Get all 44 questions with the Likert scale
 * @param {string} language - Language preference ('en' or 'es'). Defaults to current i18n language
 * @returns {Promise} Response with questions and scale
 */
export const getQuestions = (language = null) => {
  const effectiveLanguage = language || getCurrentLanguage();
  
  return api.get('/api/bfi-44/questions', {
    params: {
      language: effectiveLanguage
    }
  });
};

/**
 * Submit responses for the BFI-44 questionnaire
 * @param {Object} responses - Object with question IDs as keys and values 1-5
 * @param {string} language - Language preference ('en' or 'es'). Defaults to current i18n language
 * @returns {Promise} Response with calculated results
 */
export const submitResponses = (responses, language = null) => {
  const effectiveLanguage = language || getCurrentLanguage();
  
  return api.post('/api/bfi-44/submit', { responses }, {
    params: {
      language: effectiveLanguage
    }
  });
};

/**
 * Get the authenticated user's BFI-44 profile
 * @returns {Promise} Response with user's personality profile
 */
export const getMyProfile = () => api.get('/api/bfi-44/my-profile');

/**
 * Check if the authenticated user has completed the BFI-44
 * @returns {Promise} Response with hasProfile boolean
 */
export const hasProfile = () => api.get('/api/bfi-44/has-profile');

/**
 * Get a specific user's BFI-44 profile (admin or own profile)
 * @param {string} userId - User ID to fetch profile for
 * @returns {Promise} Response with user's personality profile
 */
export const getProfileByUserId = (userId) => api.get(`/api/bfi-44/profile/${userId}`);

/**
 * Recalculate results for an existing response (admin only)
 * @param {string} responseId - Response ID to recalculate
 * @returns {Promise} Response with recalculated results
 */
export const recalculateProfile = (responseId) => api.post(`/api/bfi-44/recalculate/${responseId}`);
