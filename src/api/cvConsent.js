import api from './axios';

/**
 * CV Consent API service
 * Handles consent management for AI CV processing.
 */

export const getCVConsent = () => api.get('/api/cv-consent');

export const updateCVConsent = ({ accepted, aiProcessing, thirdPartySharing, dataRetention }) =>
  api.post('/api/cv-consent', {
    accepted,
    ...(accepted
      ? {
          aiProcessing: Boolean(aiProcessing),
          thirdPartySharing: Boolean(thirdPartySharing),
          dataRetention: Boolean(dataRetention),
        }
      : {}),
  });


