import api from './axios';

/**
 * Projects API service
 * Handles all project-related operations following RESTful principles
 */

// ==================== Project Management ====================

/**
 * Create a new project
 * @param {Object} data - Project data
 * @returns {Promise} API response with created project
 */
export const createProject = (data) => api.post('/api/projects', data);

/**
 * Get project by ID
 * @param {string} id - Project ID
 * @param {boolean} includeEmployees - Include employee details
 * @returns {Promise} API response with project data
 */
export const getProjectById = (id, includeEmployees = true) => 
  api.get(`/api/projects/${id}`, { params: { includeEmployees } });

/**
 * Update project
 * @param {string} id - Project ID
 * @param {Object} data - Updated project data
 * @returns {Promise} API response
 */
export const updateProject = (id, data) => api.put(`/api/projects/${id}`, data);

/**
 * Delete project (Admin only)
 * @param {string} id - Project ID
 * @returns {Promise} API response
 */
export const deleteProject = (id) => api.delete(`/api/projects/${id}`);

/**
 * Get projects created by the user (as project manager)
 * @param {Object} params - Query parameters (status, organizationId)
 * @returns {Promise} API response with projects list
 */
export const getMyProjects = (params = {}) => 
  api.get('/api/projects/my-projects', { params });

/**
 * Get projects assigned to the user
 * @returns {Promise} API response with projects list
 */
export const getAssignedProjects = () => 
  api.get('/api/projects/assigned-to-me');

/**
 * Activate project (change status from draft to active)
 * @param {string} id - Project ID
 * @returns {Promise} API response
 */
export const activateProject = (id) => 
  api.patch(`/api/projects/${id}/activate`);

/**
 * Complete project
 * @param {string} id - Project ID
 * @returns {Promise} API response
 */
export const completeProject = (id) => 
  api.patch(`/api/projects/${id}/complete`);

/**
 * Cancel project (Admin only)
 * @param {string} id - Project ID
 * @returns {Promise} API response
 */
export const cancelProject = (id) => 
  api.patch(`/api/projects/${id}/cancel`);

/**
 * Assign employee to project
 * @param {string} id - Project ID
 * @param {Object} data - { employeeId, assignedRole }
 * @returns {Promise} API response
 */
export const assignEmployeeToProject = (id, data) => 
  api.post(`/api/projects/${id}/assign`, data);

/**
 * Remove employee from project
 * @param {string} projectId - Project ID
 * @param {string} employeeId - Employee ID
 * @returns {Promise} API response
 */
export const removeEmployeeFromProject = (projectId, employeeId) => 
  api.delete(`/api/projects/${projectId}/employees/${employeeId}`);

// ==================== Organization Project Management ====================

/**
 * Get projects for an organization
 * @param {string} id - Organization ID
 * @param {Object} params - Query parameters (status, projectManager)
 * @returns {Promise} API response with projects list
 */
export const getOrganizationProjects = (id, params = {}) => 
  api.get(`/api/organizations/${id}/projects`, { params });

/**
 * Get project statistics for an organization
 * @param {string} id - Organization ID
 * @returns {Promise} API response with statistics
 */
export const getOrganizationProjectStats = (id) => 
  api.get(`/api/organizations/${id}/projects/statistics`);

/**
 * Get project managers for an organization
 * @param {string} id - Organization ID
 * @returns {Promise} API response with project managers list
 */
export const getProjectManagers = (id) => 
  api.get(`/api/organizations/${id}/project-managers`);

/**
 * Assign/Remove project manager role to employee
 * @param {string} orgId - Organization ID
 * @param {string} employeeId - Employee ID
 * @param {boolean} isProjectManager - Whether to assign or remove role
 * @returns {Promise} API response
 */
export const updateProjectManagerRole = (orgId, employeeId, isProjectManager) => 
  api.patch(`/api/organizations/${orgId}/employees/${employeeId}/project-manager`, {
    isProjectManager
  });

// ==================== Team Analysis & Risk Prediction ====================

/**
 * Get team analysis for a project
 * When project has NO assigned employees: Returns optimal team suggestions
 * When project HAS assigned employees: Analyzes current team fit
 * @param {string} id - Project ID
 * @returns {Promise} API response with team analysis
 */
export const getTeamAnalysis = (id) => 
  api.get(`/api/projects/${id}/team-analysis`);

/**
 * Suggest optimal team for project requirements (without creating project)
 * Useful for testing different team configurations before assignment
 * @param {Object} data - { projectRequirements, organizationId, teamSize }
 * @returns {Promise} API response with team suggestions
 */
export const suggestTeam = (data) => 
  api.post('/api/projects/suggest-team', data);

/**
 * Predict project risks using Decision Tree + CBR + Team Analysis
 * Combines expert rules, historical cases, and team composition analysis
 * @param {string} id - Project ID
 * @returns {Promise} API response with comprehensive risk analysis
 */
export const predictProjectRisks = (id) => 
  api.post(`/api/projects/${id}/risks/predict`);

/**
 * Preview project risks with hypothetical team composition
 * Used for real-time risk updates as team is being modified
 * @param {string} id - Project ID
 * @param {Object} data - { selectedEmployeeIds }
 * @returns {Promise} API response with risk preview
 */
export const previewProjectRisks = (id, data) => 
  api.post(`/api/projects/${id}/risks/preview`, data);
