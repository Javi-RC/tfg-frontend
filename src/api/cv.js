import api from './axios';
import i18n from '../i18n';

/**
 * CV API service
 * Handles all CV-related operations following RESTful principles
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
 * Upload and process a CV file
 * @param {File} file - The CV file to upload
 * @param {string} language - Language preference ('en' or 'es'). Defaults to current i18n language
 * @returns {Promise} API response with processed CV data and questionnaire if needed
 */
export const uploadCV = (file, language = null) => {
  const formData = new FormData();
  const effectiveLanguage = language || getCurrentLanguage();
  
  formData.append('cv', file);
  formData.append('language', effectiveLanguage);
  
  return api.post('/api/cv/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

/**
 * Get the current user's CV
 * @returns {Promise} API response with CV data
 */
export const getMyCV = () => api.get('/api/cv/my-cv');

/**
 * Get CV statistics
 * @returns {Promise} API response with statistics
 */
export const getCVStats = () => api.get('/api/cv/stats');

/**
 * Update a CV by ID
 * @param {string} cvId - The CV ID
 * @param {Object} data - The updated CV data
 * @returns {Promise} API response
 */
export const updateCV = (cvId, data) => api.put(`/api/cv/${cvId}`, data);

/**
 * Delete a CV by ID
 * @param {string} cvId - The CV ID to delete
 * @returns {Promise} API response
 */
export const deleteCV = (cvId) => api.delete(`/api/cv/${cvId}`);

/**
 * Get all CVs (admin only)
 * @returns {Promise} API response with all CVs
 */
export const getAllCVs = () => api.get('/api/cv/admin/all');

/**
 * Search CVs by skills or languages (admin only)
 * @param {Object} searchParams - Search parameters { skills: [], languages: [] }
 * @returns {Promise} API response with matching CVs
 */
export const searchCVs = (searchParams) => api.post('/api/cv/admin/search', searchParams);

/**
 * Submit CV to organization
 * @param {string} organizationId - Organization ID
 * @returns {Promise} API response
 */
export const submitCVToOrganization = (organizationId) => 
  api.post('/api/cv/submit-to-organization', { organizationId });

/**
 * Submit phase responses and get next phase
 * Backend accumulates responses internally and returns next phase or completion status
 * @param {string} sessionId - Questionnaire session ID
 * @param {string} currentPhase - Current phase ID
 * @param {Object} responses - User responses for CURRENT PHASE ONLY
 * @param {string} language - Language preference ('en' or 'es'). Defaults to current i18n language
 * @returns {Promise} API response with next phase or isComplete flag
 */
export const submitPhaseResponses = (sessionId, currentPhase, responses, language = null) => {
  const effectiveLanguage = language || getCurrentLanguage();
  
  return api.post('/api/cv/questionnaire/next', {
    sessionId,
    currentPhase,
    responses
  }, {
    params: {
      language: effectiveLanguage
    }
  });
};

export default {
  uploadCV,
  getMyCV,
  getCVStats,
  updateCV,
  deleteCV,
  getAllCVs,
  searchCVs,
  submitCVToOrganization,
  submitPhaseResponses
};
