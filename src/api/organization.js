import api from './axios';

/**
 * Organization API service
 * Handles all organization-related operations following RESTful principles
 */

// ==================== Organization Management ====================

/**
 * Create a new organization
 * @param {Object} data - Organization data
 * @returns {Promise} API response with created organization
 */
export const createOrganization = (data) => api.post('/api/organizations', data);

/**
 * Get organization by ID
 * @param {string} id - Organization ID
 * @returns {Promise} API response with organization data
 */
export const getOrganizationById = (id) => api.get(`/api/organizations/${id}`);

/**
 * Update organization
 * @param {string} id - Organization ID
 * @param {Object} data - Updated organization data
 * @returns {Promise} API response
 */
export const updateOrganization = (id, data) => api.put(`/api/organizations/${id}`, data);

/**
 * Get user's organizations
 * @returns {Promise} API response with user's organizations
 */
export const getMyOrganizations = () => api.get('/api/organizations/my-organizations');

/**
 * Search organizations
 * @param {Object} params - Search parameters
 * @returns {Promise} API response with search results
 */
export const searchOrganizations = (params) => api.get('/api/organizations/search', { params });

/**
 * Deactivate organization
 * @param {string} id - Organization ID
 * @returns {Promise} API response
 */
export const deactivateOrganization = (id) => api.patch(`/api/organizations/${id}/deactivate`);

/**
 * Activate organization
 * @param {string} id - Organization ID
 * @returns {Promise} API response
 */
export const activateOrganization = (id) => api.patch(`/api/organizations/${id}/activate`);

/**
 * Get organization statistics
 * @param {string} id - Organization ID
 * @returns {Promise} API response with statistics
 */
export const getOrganizationStats = (id) => api.get(`/api/organizations/${id}/stats`);

/**
 * Update organization settings
 * @param {string} id - Organization ID
 * @param {Object} settings - Settings to update
 * @returns {Promise} API response
 */
export const updateOrganizationSettings = (id, settings) => 
  api.patch(`/api/organizations/${id}/settings`, settings);

// ==================== Employee Management ====================

/**
 * Add employee to organization
 * @param {string} id - Organization ID
 * @param {Object} data - Employee data (userId, position, department)
 * @returns {Promise} API response
 */
export const addEmployee = (id, data) => api.post(`/api/organizations/${id}/employees`, data);

/**
 * Remove employee from organization
 * @param {string} id - Organization ID
 * @param {string} userId - User ID to remove
 * @returns {Promise} API response
 */
export const removeEmployee = (id, userId) => 
  api.delete(`/api/organizations/${id}/employees/${userId}`);

/**
 * Update employee status
 * @param {string} id - Organization ID
 * @param {string} userId - User ID
 * @param {string} status - New status (pending/active/inactive)
 * @returns {Promise} API response
 */
export const updateEmployeeStatus = (id, userId, status) => 
  api.patch(`/api/organizations/${id}/employees/${userId}/status`, { status });

/**
 * Get organization employees
 * @param {string} id - Organization ID
 * @param {Object} params - Query parameters (status, department, position)
 * @returns {Promise} API response with employees list
 */
export const getOrganizationEmployees = (id, params = {}) => 
  api.get(`/api/organizations/${id}/employees`, { params });

// ==================== Admin Management ====================

/**
 * Add additional admin to organization
 * @param {string} id - Organization ID
 * @param {Object} data - Admin data (userId)
 * @returns {Promise} API response
 */
export const addAdmin = (id, data) => api.post(`/api/organizations/${id}/admins`, data);

// ==================== CV Management ====================

/**
 * Submit CV to organization
 * @param {string} organizationId - Organization ID
 * @returns {Promise} API response
 */
export const submitCVToOrganization = (organizationId) => 
  api.post('/api/cv/submit-to-organization', { organizationId });

/**
 * Get organization's received CVs
 * @param {string} id - Organization ID
 * @param {Object} params - Query parameters (status, page, limit)
 * @returns {Promise} API response with CVs list
 */
export const getOrganizationCVs = (id, params = {}) => 
  api.get(`/api/organizations/${id}/cvs`, { params });

/**
 * Get specific CV submitted to organization
 * @param {string} id - Organization ID
 * @param {string} cvId - CV ID
 * @returns {Promise} API response with CV data
 */
export const getOrganizationCV = (id, cvId) => 
  api.get(`/api/organizations/${id}/cvs/${cvId}`);

/**
 * Update CV status in organization
 * @param {string} id - Organization ID
 * @param {string} cvId - CV ID
 * @param {Object} data - Status update data (status, notes)
 * @returns {Promise} API response
 */
export const updateCVStatus = (id, cvId, data) => 
  api.patch(`/api/organizations/${id}/cvs/${cvId}/status`, data);

export default {
  createOrganization,
  getOrganizationById,
  updateOrganization,
  getMyOrganizations,
  searchOrganizations,
  deactivateOrganization,
  activateOrganization,
  getOrganizationStats,
  updateOrganizationSettings,
  addEmployee,
  removeEmployee,
  updateEmployeeStatus,
  getOrganizationEmployees,
  addAdmin,
  submitCVToOrganization,
  getOrganizationCVs,
  getOrganizationCV,
  updateCVStatus
};
