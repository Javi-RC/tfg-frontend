import api from './axios';
import i18n from '../i18n';

/**
 * Risk Services API
 * Handles risk prediction, retrieval, and management
 * Supports new three-layer architecture: DT, CBR, PM Selection
 */

/**
 * Helper function to get current language for risk translations
 * Always reads the most recent value from localStorage for consistency with axios interceptor
 * @returns {string} Current language code (es or en)
 */
const getCurrentLanguage = () => {
  const storedLanguage = localStorage.getItem('i18nextLng');
  const rawLanguage = storedLanguage || i18n.language || 'en';
  return rawLanguage.split('-')[0];
};

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
export const getDTIndicators = (projectId) => {
  const lang = getCurrentLanguage();
  return api.get(`/api/projects/${projectId}/risks/indicators?lang=${lang}`);
};

/**
 * Get CBR learned risks with similarity filtering
 * @param {string} projectId - Project ID
 * @param {number} minSimilarity - Minimum similarity threshold (0-1, default 0.5)
 * @returns {Promise} API response with CBR risks
 */
export const getCBRRisks = (projectId, minSimilarity = 0.5) => {
  const lang = getCurrentLanguage();
  return api.get(`/api/projects/${projectId}/risks/cbr`, {
    params: { minSimilarity, lang }
  });
};

// ==================== Risk Management ====================

/**
 * Accept CBR risks for monitoring
 * @param {string} projectId - Project ID
 * @param {string[]} riskIds - Array of risk IDs to monitor
 * @returns {Promise} API response confirming acceptance
 */
export const acceptRisksForMonitoring = (projectId, riskIds) =>
  api.post(`/api/projects/${projectId}/risks/accept`, { riskIds });

/**
 * Get all risks (both DT and CBR) for a project
 * @param {string} projectId - Project ID
 * @returns {Promise} API response with all risks
 */
export const getAllProjectRisks = (projectId) => {
  const lang = getCurrentLanguage();
  return api.get(`/api/projects/${projectId}/risks?lang=${lang}`);
};

/**
 * Get a specific risk by ID
 * @param {string} projectId - Project ID
 * @param {string} riskId - Risk ID
 * @returns {Promise} API response with risk details
 */
export const getRiskById = (projectId, riskId) => {
  const lang = getCurrentLanguage();
  return api.get(`/api/projects/${projectId}/risks/${riskId}?lang=${lang}`);
};

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
export const updateRiskStatus = (projectId, riskId, status) =>
  api.patch(`/api/projects/${projectId}/risks/${riskId}/status`, { status });

/**
 * Get risk analytics for a project
 * @param {string} projectId - Project ID
 * @returns {Promise} API response with analytics
 */
export const getRiskAnalytics = (projectId) =>
  api.get(`/api/projects/${projectId}/risks/analytics`);

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
    params: { ...params, lang } 
  });
};

/**
 * Mark a predicted risk (DT or CBR) as occurred
 * @param {string} riskId - Risk ID
 * @param {Object} data - Occurrence data
 * @param {boolean} data.occurred - Whether risk occurred (true)
 * @param {string} data.detectedAt - ISO8601 date when risk was detected
 * @param {string} data.actualSeverity - Actual severity (low|medium|high|critical)
 * @param {Object} data.actualImpact - Impact details
 * @param {number} data.actualImpact.scheduleDelayDays - Days of schedule delay
 * @param {number} data.actualImpact.budgetOverrunPercent - Budget overrun percentage
 * @param {number} data.actualImpact.qualityScore - Quality score (0-1)
 * @param {string} data.actualImpact.description - Impact description
 * @param {string} data.rootCause - Root cause of the risk
 * @param {string} [data.mitigatedAt] - ISO8601 date when risk was mitigated (optional)
 * @returns {Promise} API response with updated risk
 * @example
 * markRiskAsOccurred('risk_001', {
 *   occurred: true,
 *   detectedAt: '2025-01-20T14:30:00Z',
 *   actualSeverity: 'high',
 *   actualImpact: {
 *     scheduleDelayDays: 3,
 *     budgetOverrunPercent: 5,
 *     qualityScore: 0.75,
 *     description: 'Team communication failed for 2 days'
 *   },
 *   rootCause: 'PM fue de vacaciones sin avisar'
 * })
 */
export const markRiskAsOccurred = (riskId, data) =>
  api.patch(`/api/risks/${riskId}/mark-occurred`, data);

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
export const getOutcomeFormData = (projectId) =>
  api.get(`/api/projects/${projectId}/outcome/form`);

// ==================== Debug Endpoints (Secret) ====================

/**
 * [DEBUG] Get all risks in the system
 * @returns {Promise} API response with all risks
 */
export const getAllRisksDebug = () => {
  const lang = getCurrentLanguage();
  return api.get(`/api/risks/debug/all?lang=${lang}`);
};

/**
 * [DEBUG] Get all risks of a specific type
 * @param {string} type - Risk type (e.g., 'cultural_distance_risk')
 * @returns {Promise} API response with filtered risks
 */
export const getRisksByTypeDebug = (type) => {
  const lang = getCurrentLanguage();
  return api.get(`/api/risks/debug/by-type/${type}?lang=${lang}`);
};

/**
 * [DEBUG] Get summary of all risk types
 * @returns {Promise} API response with type summary statistics
 */
export const getRisksTypeSummaryDebug = () => {
  const lang = getCurrentLanguage();
  return api.get(`/api/risks/debug/types-summary?lang=${lang}`);
};

// ==================== Legacy Support ====================

/**
 * DEPRECATED: Old method name. Use getCBRRisks or getDTIndicators instead
 * Get all risks for a project
 * @param {string} projectId - Project ID
 * @returns {Promise} API response
 */
export const getProjectRisks = (projectId) => {
  const lang = getCurrentLanguage();
  return api.get(`/api/projects/${projectId}/risks?lang=${lang}`);
};
