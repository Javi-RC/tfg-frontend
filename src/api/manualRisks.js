import api from './axios';

/**
 * Manual Risks API service
 * Handles manual risk CRUD operations for projects during execution
 * 
 * NEW FLOW (Backend Refactoring - January 2026):
 * ================================================
 * 
 * DURING PROJECT EXECUTION (status: ACTIVE):
 * - Add manual risks: POST /api/projects/:id/risks/manual
 * - Edit manual risks: PUT /api/projects/:id/risks/:riskId
 * - Delete manual risks: DELETE /api/projects/:id/risks/:riskId
 * - View risks: GET /api/projects/:id/risks
 * - All risks created with status: 'active'
 * - NO marking of occurred/not_occurred during execution
 * 
 * AT PROJECT COMPLETION (status: COMPLETED):
 * - Mark risks individually: PUT /api/projects/:id/risks/:riskId
 * - For occurred risks: { occurred: true, detectedAt, actualSeverity, scheduleDelayDays, rootCause, mitigatedAt }
 * - For avoided risks: { occurred: false, avoidanceReason }
 * - This updates risk status to 'occurred', 'mitigated', or 'avoided'
 * 
 * REMOVED ENDPOINTS:
 * - POST /api/projects/:id/outcome with actualizedRisks (deprecated)
 */

/**
 * Add a new manual risk to a project (DURING ACTIVE PROJECT)
 * @param {string} projectId - Project ID
 * @param {Object} riskData - Risk data
 * @param {string} riskData.type - REQUIRED: Risk type from catalog
 * @param {string} riskData.title - REQUIRED: Risk title
 * @param {string} riskData.description - REQUIRED: Risk description
 * @param {string} [riskData.severity] - OPTIONAL: "low"|"medium"|"high"|"critical" (default: "medium")
 * @param {string} [riskData.rootCause] - OPTIONAL: Root cause description
 * @param {string[]} [riskData.recommendations] - OPTIONAL: Array of recommendations
 * @param {string[]} [riskData.indicators] - OPTIONAL: Array of indicators
 * @returns {Promise} API response with created risk
 */
export const addManualRisk = (projectId, riskData) =>
  api.post(`/api/projects/${projectId}/risks/manual`, riskData);

/**
 * Get all risks for a project (predicted + manual)
 * This is the main endpoint that returns ALL risks including DT, CBR, and manual
 * @param {string} projectId - Project ID
 * @returns {Promise} API response with all project risks
 */
export const getAllProjectRisks = (projectId) =>
  api.get(`/api/projects/${projectId}/risks`);

/**
 * Get only manual risks for a project
 * @param {string} projectId - Project ID
 * @returns {Promise} API response with manual risks list
 */
export const getProjectManualRisks = (projectId) =>
  api.get(`/api/projects/${projectId}/risks/manual`);

/**
 * Get a specific manual risk
 * @param {string} projectId - Project ID
 * @param {string} riskId - Risk ID
 * @returns {Promise} API response with risk data
 */
export const getManualRisk = (projectId, riskId) =>
  api.get(`/api/projects/${projectId}/risks/${riskId}`);

/**
 * Update a manual risk (DURING ACTIVE PROJECT or RETROSPECTIVE)
 * 
 * DURING ACTIVE PROJECT:
 * - Can update: title, description, severity, rootCause, recommendations, indicators
 * 
 * DURING RETROSPECTIVE (project completed):
 * - Mark as OCCURRED: { occurred: true, detectedAt, actualSeverity, scheduleDelayDays, rootCause, mitigatedAt }
 * - Mark as AVOIDED: { occurred: false, avoidanceReason }
 * 
 * @param {string} projectId - Project ID
 * @param {string} riskId - Risk ID
 * @param {Object} updateData - Data to update
 * @returns {Promise} API response with updated risk
 */
export const updateManualRisk = (projectId, riskId, updateData) =>
  api.put(`/api/projects/${projectId}/risks/${riskId}`, updateData);

/**
 * Mark a risk occurrence (retrospective phase)
 * Retrospective: mark whether it occurred, optionally sending additional details.
 * @param {string} projectId - Project ID
 * @param {string} riskId - Risk ID
 * @param {Object} [details] - Optional extra fields to store for learning/reporting
 * @param {string} [details.title]
 * @param {string} [details.description]
 * @param {string} [details.severity]
 * @param {string} [details.rootCause]
 * @param {string[]} [details.recommendations]
 * @param {string[]} [details.indicators]
 * @returns {Promise} API response with updated risk
 */
export const markRiskOccurred = (projectId, riskId, details = undefined) => {
  const allowedKeys = [
    'title',
    'description',
    'severity',
    'rootCause',
    'recommendations',
    'indicators'
  ];

  const body = { occurred: true };

  if (details && typeof details === 'object') {
    for (const key of allowedKeys) {
      if (details[key] !== undefined) {
        body[key] = details[key];
      }
    }
  }

  return api.put(`/api/projects/${projectId}/risks/${riskId}`, body);
};

/**
 * Mark a risk as NOT occurred (retrospective phase)
 * Retrospective: mark whether it occurred.
 * @param {string} projectId - Project ID
 * @param {string} riskId - Risk ID
 * @returns {Promise} API response with updated risk
 */
export const markRiskAvoided = (projectId, riskId) =>
  api.put(`/api/projects/${projectId}/risks/${riskId}`, {
    occurred: false
  });

/**
 * Delete a manual risk (only if project not completed)
 * @param {string} projectId - Project ID
 * @param {string} riskId - Risk ID
 * @returns {Promise} API response
 */
export const deleteManualRisk = (projectId, riskId) =>
  api.delete(`/api/projects/${projectId}/risks/${riskId}`);

/**
 * Get project outcome and risks
 * @param {string} projectId - Project ID
 * @returns {Promise} API response with outcome data
 */
export const getProjectOutcome = (projectId) =>
  api.get(`/api/projects/${projectId}/outcome`);

/**
 * DEPRECATED: Submit project outcome with actualized risks
 * This endpoint is no longer used. Use markRiskOccurred/markRiskAvoided instead.
 * 
 * @deprecated Use individual risk marking endpoints
 */
export const submitProjectOutcome = (projectId, outcomeData) =>
  api.post(`/api/projects/${projectId}/outcome`, outcomeData);

/**
 * Validate manual risk data before submission
 * @param {Object} riskData - Risk data to validate
 * @returns {Object|null} Errors object or null if valid
 */
export const validateManualRisk = (riskData) => {
  const errors = {};
  
  if (!riskData.type) {
    errors.type = 'El tipo es obligatorio';
  }
  if (!riskData.title) {
    errors.title = 'El título es obligatorio';
  }
  if (!riskData.description) {
    errors.description = 'La descripción es obligatoria';
  }
  
  if (riskData.severity && !['low', 'medium', 'high', 'critical'].includes(riskData.severity)) {
    errors.severity = 'Severidad inválida';
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
};

/**
 * Validate occurrence data before submission
 * @param {Object} occurrenceData - Occurrence data to validate
 * @returns {Object|null} Errors object or null if valid
 */
export const validateOccurrence = (occurrenceData) => {
  const errors = {};
  
  if (occurrenceData.scheduleDelayDays !== undefined && occurrenceData.scheduleDelayDays < 0) {
    errors.scheduleDelayDays = 'No puede ser negativo';
  }
  
  if (occurrenceData.detectedAt && new Date(occurrenceData.detectedAt) > new Date()) {
    errors.detectedAt = 'No puede ser fecha futura';
  }
  
  if (occurrenceData.mitigatedAt && occurrenceData.detectedAt) {
    if (new Date(occurrenceData.mitigatedAt) < new Date(occurrenceData.detectedAt)) {
      errors.mitigatedAt = 'No puede ser anterior a la fecha de detección';
    }
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
};
