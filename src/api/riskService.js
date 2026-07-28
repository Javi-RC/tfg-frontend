import api from './axios';
import { getCurrentLanguage } from '../utils/language';

/**
 * Risk Services API
 * Handles risk prediction, retrieval, and management
 * Supports new three-layer architecture: DT, CBR, PM Selection
 */

// ==================== Risk Prediction ====================

/**
 * Get risk prediction for a project (both DT and CBR)
 * @param {string} projectId - Project ID
 * @returns {Promise} API response with dtRisks and cbrRisks
 */
export const predictProjectRisks = (projectId) => {
  const lang = getCurrentLanguage();
  return api.post(`/api/projects/${projectId}/risks/predict?lang=${lang}`);
};

/**
 * Get DT indicators (early warnings) for a project
 * @param {string} projectId - Project ID
 * @returns {Promise} API response with DT risks
 */


// ==================== Risk Management ====================

/**
 * Accept CBR risks for monitoring
 * @param {string} projectId - Project ID
 * @param {string[]} riskIds - Array of risk IDs to monitor
 * @returns {Promise} API response confirming acceptance
 */


/**
 * Update a risk (status, notes, mitigation, etc.)
 * @param {string} projectId - Project ID
 * @param {string} riskId - Risk ID
 * @param {Object} updateData - Data to update
 * @returns {Promise} API response with updated risk
 */
export const updateRisk = (projectId, riskId, updateData) =>
  api.put(`/api/projects/${projectId}/risks/${riskId}`, updateData);

/**
 * Mark a risk as mitigated or resolved
 * @param {string} projectId - Project ID
 * @param {string} riskId - Risk ID
 * @param {string} status - New status (mitigated|resolved|monitoring)
 * @returns {Promise} API response
 */


// ==================== Risk Monitoring (During Execution) ====================

/**
 * Get risks with filtering options
 * @param {string} projectId - Project ID
 * @param {Object} params - Query parameters
 * @param {string} params.status - Filter by status (predicted|occurred|mitigated|closed)
 * @param {boolean} params.occurred - Filter by occurred status (true|false)
 * @returns {Promise} API response with filtered risks
 * @example
 * // Get only risks that occurred
 * getProjectRisks(projectId, { occurred: true })
 *
 * // Get predicted risks that haven't occurred yet
 * getProjectRisks(projectId, { status: 'predicted', occurred: false })
 */
export const getProjectRisksFiltered = (projectId, params = {}) => {
  const lang = getCurrentLanguage();
  return api.get(`/api/projects/${projectId}/risks`, {
    params: { ...params, lang },
  });
};

// ==================== Project Completion & Outcome ====================

/**
 * Get pre-filled outcome form data
 * Returns predicted risks vs actual for easier form completion
 * @param {string} projectId - Project ID
 * @returns {Promise} API response with form data including predicted risks
 * @example
 * // Response includes:
 * // - predictedRisks: Array of predicted risks with severity/probability
 * // - projectDates: Start, end, estimated hours
 * // - form: Pre-filled fields for PM to complete
 */
export const getOutcomeFormData = (projectId) => api.get(`/api/projects/${projectId}/outcome/form`);

// ==================== CBR / Case-Based Reasoning (per project) ====================

/**
 * Get CBR-based risks for a project (risks inferred from similar past cases).
 * @param {string} projectId - Project ID
 * @param {number} [minSimilarity=0.5] - Minimum case similarity (0-1)
 * @returns {Promise} API response with { risks, ... }
 */
export const getCBRRisks = (projectId, minSimilarity = 0.5) => {
  const lang = getCurrentLanguage();
  return api.get(`/api/projects/${projectId}/risks/cbr`, {
    params: { lang, minSimilarity },
  });
};

/**
 * Get decision-tree indicators (expert-rule signals) for a project.
 * @param {string} projectId - Project ID
 * @returns {Promise} API response with { indicators, ... }
 */
export const getDTIndicators = (projectId) => {
  const lang = getCurrentLanguage();
  return api.get(`/api/projects/${projectId}/risks/indicators`, { params: { lang } });
};

/**
 * Get historical cases similar to this project (CBR retrieval).
 * @param {string} projectId - Project ID
 * @param {number} [limit=5] - Max number of similar cases
 * @returns {Promise} API response with similar cases and their outcomes
 */
export const findSimilarCases = (projectId, limit = 5) => {
  const lang = getCurrentLanguage();
  return api.get(`/api/projects/${projectId}/similar-cases`, { params: { lang, limit } });
};

/**
 * Accept a set of predicted risks so they become tracked project risks.
 * Project manager action.
 * @param {string} projectId - Project ID
 * @param {string[]} riskIds - IDs of the risks to accept
 * @returns {Promise} API response with the accepted risks
 */
export const acceptRisks = (projectId, riskIds) =>
  api.post(`/api/projects/${projectId}/risks/accept`, { riskIds });

// ==================== Legacy Support ====================

/**
 * DEPRECATED: Old method name. Use getCBRRisks or getDTIndicators instead
 * Get all risks for a project
 * @param {string} projectId - Project ID
 * @returns {Promise} API response
 */

