import api from './axios';

/**
 * CV API service
 * Handles all CV-related operations following RESTful principles
 */

/**
 * Upload and process a CV file
 * @param {File} file - The CV file to upload
 * @returns {Promise} API response with processed CV data
 */
export const uploadCV = (file) => {
  const formData = new FormData();
  formData.append('cv', file);
  
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

export default {
  uploadCV,
  getMyCV,
  getCVStats,
  updateCV,
  deleteCV,
  getAllCVs,
  searchCVs,
  submitCVToOrganization
};
