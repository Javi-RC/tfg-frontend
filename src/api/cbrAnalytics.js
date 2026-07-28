import api from './axios';
import { getCurrentLanguage } from '../utils/language';

/**
 * CBR / Risk Analytics API service (organization level).
 *
 * Surfaces the organization-wide risk-learning data the backend already
 * computes from the case base: aggregated risk insights, prediction accuracy,
 * and the case base itself.
 *
 * Access (enforced by the backend):
 * - insights / stats / accuracy: any organization member
 * - case-base stats / cases / seed: organization admin
 */

// ==================== Organization risk insights (org member) ====================

/**
 * Aggregated risk insights across the organization's projects.
 * @param {string} organizationId
 * @returns {Promise} API response with { data: insights }
 */
export const getOrganizationRiskInsights = (organizationId) => {
  const lang = getCurrentLanguage();
  return api.get(`/api/organizations/${organizationId}/risks/insights`, { params: { lang } });
};

/**
 * Raw organization risk statistics (counts by type, severity, occurrence…).
 * @param {string} organizationId
 * @returns {Promise} API response with { data: stats }
 */
export const getOrganizationRiskStats = (organizationId) =>
  api.get(`/api/organizations/${organizationId}/risks/stats`);

/**
 * Prediction accuracy report: how well predicted risks matched real outcomes.
 * @param {string} organizationId
 * @returns {Promise} API response with { data: report }
 */
export const getOrganizationRiskAccuracy = (organizationId) =>
  api.get(`/api/organizations/${organizationId}/risks/accuracy`);

// ==================== Case base (org admin) ====================

/**
 * Case base statistics for the organization (number of cases, coverage…).
 * @param {string} organizationId
 * @returns {Promise} API response with { data: stats }
 */
export const getCaseBaseStats = (organizationId) =>
  api.get(`/api/organizations/${organizationId}/case-base/stats`);

/**
 * List the organization's stored CBR cases, optionally filtered by type.
 * @param {string} organizationId
 * @param {Object} [params] - { type }
 * @returns {Promise} API response with { data: { cases, ... } }
 */
export const getOrganizationCases = (organizationId, params = {}) =>
  api.get(`/api/organizations/${organizationId}/case-base/cases`, { params });

/**
 * Get a single CBR case by its id.
 * @param {string} caseId
 * @returns {Promise} API response with { data: case }
 */
export const getCaseById = (caseId) => api.get(`/api/case-base/${caseId}`);

// ==================== Seed cases (org admin) ====================

/**
 * Preview the built-in seed cases available to bootstrap the case base.
 * @returns {Promise} API response with the seed cases
 */
export const getSeedCases = () => api.get('/api/case-base/seed');

/**
 * Load the built-in seed cases into the case base.
 * @returns {Promise} API response with the load result
 */
export const loadSeedCases = () => api.post('/api/case-base/seed');
