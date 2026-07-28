import api from './axios';
import { getCurrentLanguage } from '../utils/language';

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
export const getMyProjects = (params = {}) => api.get('/api/projects/my-projects', { params });

/**
 * Get projects assigned to the user
 * @returns {Promise} API response with projects list
 */
export const getAssignedProjects = () => api.get('/api/projects/assigned-to-me');

/**
 * Activate project (change status from draft to active)
 * @param {string} id - Project ID
 * @returns {Promise} API response
 */
export const activateProject = (id) => api.patch(`/api/projects/${id}/activate`);

/**
 * Complete project (mark as finished)
 * IMPORTANT: Call this BEFORE submitting project outcome
 * This changes project status to 'completed' and is required for outcome submission
 *
 * WORKFLOW:
 * 1. Call completeProject(id) - marks status as 'completed'
 * 2. Call submitProjectOutcome(id, data) - captures results and creates CBR case
 *
 * @param {string} id - Project ID
 * @returns {Promise} API response with completedAt timestamp
 */
export const completeProject = (id) => api.patch(`/api/projects/${id}/complete`);

/**
 * Cancel project (Admin only)
 * @param {string} id - Project ID
 * @returns {Promise} API response
 */
export const cancelProject = (id) => api.patch(`/api/projects/${id}/cancel`);

/**
 * Assign employee to project
 * @param {string} id - Project ID
 * @param {Object} data - { employeeId, assignedRole }
 * @returns {Promise} API response
 */
export const assignEmployeeToProject = (id, data) => api.post(`/api/projects/${id}/assign`, data);

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


/**
 * Assign/Remove project manager role to employee
 * @param {string} orgId - Organization ID
 * @param {string} employeeId - Employee ID
 * @param {boolean} isProjectManager - Whether to assign or remove role
 * @returns {Promise} API response
 */
export const updateProjectManagerRole = (orgId, employeeId, isProjectManager) =>
  api.patch(`/api/organizations/${orgId}/employees/${employeeId}/project-manager`, {
    isProjectManager,
  });

// ==================== Team Analysis & Risk Prediction ====================

/**
 * Get team analysis for a project
 * When project has NO assigned employees: Returns optimal team suggestions
 * When project HAS assigned employees: Analyzes current team fit
 * @param {string} id - Project ID
 * @returns {Promise} API response with team analysis
 */
export const getTeamAnalysis = (id) => {
  const lang = getCurrentLanguage();
  return api.get(`/api/projects/${id}/team-analysis?lang=${lang}`);
};

/**
 * Get detailed team synergy analysis
 * @param {string} id - Project ID
 * @returns {Promise} API response with synergy analysis
 */


/**
 * Predict project risks using Expert Rules + CBR + Team Analysis
 * Combines expert rules, historical cases, and team composition analysis
 * @param {string} id - Project ID
 * @returns {Promise} API response with comprehensive risk analysis
 */
export const predictProjectRisks = (id) => api.post(`/api/projects/${id}/risks/predict`);

/**
 * Preview project risks with hypothetical team composition
 * Used for real-time risk updates as team is being modified
 * @param {string} id - Project ID
 * @param {Object} data - { selectedEmployeeIds }
 * @returns {Promise} API response with risk preview
 */


// ==================== Team Configuration Management ====================

/**
 * Get team configuration for a project
 * @param {string} projectId - Project ID
 * @returns {Promise} API response with team configuration
 */
export const getTeamConfig = (projectId) => api.get(`/api/projects/${projectId}/team-config`);

/**
 * Update complete team configuration
 * @param {string} projectId - Project ID
 * @param {Object} config - Complete configuration object
 * @returns {Promise} API response
 */
export const updateTeamConfig = (projectId, config) =>
  api.put(`/api/projects/${projectId}/team-config`, config);

/**
 * Update Phase 1 configuration only
 * @param {string} projectId - Project ID
 * @param {Object} phase1Config - Phase 1 configuration
 * @returns {Promise} API response
 */
export const updatePhase1Config = (projectId, phase1Config) =>
  api.patch(`/api/projects/${projectId}/team-config/phase1`, phase1Config);

/**
 * Update Phase 2 configuration only
 * @param {string} projectId - Project ID
 * @param {Object} phase2Config - Phase 2 configuration
 * @returns {Promise} API response
 */
export const updatePhase2Config = (projectId, phase2Config) =>
  api.patch(`/api/projects/${projectId}/team-config/phase2`, phase2Config);

/**
 * Update CBR configuration only
 * @param {string} projectId - Project ID
 * @param {Object} cbrConfig - CBR configuration
 * @returns {Promise} API response
 */
export const updateCBRConfig = (projectId, cbrConfig) =>
  api.patch(`/api/projects/${projectId}/team-config/cbr`, cbrConfig);

/**
 * Update Expert Rules configuration only
 * Controls 29 expert rules risk thresholds
 * @param {string} projectId - Project ID
 * @param {Object} decisionTreeConfig - Expert rules configuration
 * @returns {Promise} API response
 */
export const updateDecisionTreeConfig = (projectId, decisionTreeConfig) =>
  api.patch(`/api/projects/${projectId}/team-config/decision-tree`, decisionTreeConfig);

/**
 * Reset team configuration to default values
 * @param {string} projectId - Project ID
 * @returns {Promise} API response
 */
export const resetTeamConfig = (projectId) =>
  api.post(`/api/projects/${projectId}/team-config/reset`);

/**
 * Get human-readable configuration summary
 * @param {string} projectId - Project ID
 * @returns {Promise} API response with formatted summary
 */


// ==================== Candidate Pool Size ====================

/**
 * Get candidate pool size configuration for a project
 * Returns the current multiplier, team size, and effective top N
 * @param {string} projectId - Project ID
 * @returns {Promise} API response with { teamSize, candidatePoolMultiplier, effectiveTopN, description }
 */
export const getCandidatePoolSize = (projectId) =>
  api.get(`/api/projects/${projectId}/candidate-pool-size`);

/**
 * Update candidate pool multiplier for a project
 * effectiveTopN = teamSize × candidatePoolMultiplier
 * @param {string} projectId - Project ID
 * @param {number} candidatePoolMultiplier - Multiplier value (1-10)
 * @returns {Promise} API response with updated pool size data
 */
export const updateCandidatePoolSize = (projectId, candidatePoolMultiplier) =>
  api.patch(`/api/projects/${projectId}/candidate-pool-size`, { candidatePoolMultiplier });

