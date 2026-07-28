import api from './axios';

/**
 * Personality Consent API service
 * Handles consent management for BFI-44 personality profiling.
 */

/**
 * Get current personality consent status
 * @returns {Promise} Response with hasConsent boolean and consent details
 */
export const getPersonalityConsent = () => api.get('/api/personality-consent');

/**
 * Submit or revoke personality consent
 * @param {Object} params
 * @param {boolean} params.accepted - Whether the user accepts consent
 * @param {boolean} [params.personalityProfiling] - Accept personality profiling (required when accepted=true)
 * @param {boolean} [params.dataRetention] - Accept data retention (optional)
 * @returns {Promise} Response with updated consent status
 */
export const updatePersonalityConsent = ({ accepted, personalityProfiling, dataRetention }) =>
  api.post('/api/personality-consent', {
    accepted,
    ...(accepted
      ? {
          personalityProfiling: Boolean(personalityProfiling),
          dataRetention: Boolean(dataRetention),
        }
      : {}),
  });

/**
 * Get BFI-44 consent status indicator
 * @returns {Promise} Response with consent status for the questionnaire view
 */
export const getBFI44ConsentStatus = () => api.get('/api/bfi-44/consent-status');


