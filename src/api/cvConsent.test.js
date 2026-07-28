import api from './axios';
import { getCVConsent, updateCVConsent } from './cvConsent';

jest.mock('./axios');

describe('cvConsent API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCVConsent', () => {
    it('sends GET request to /api/cv-consent', async () => {
      const mockResponse = {
        data: {
          accepted: true,
          aiProcessing: true,
          thirdPartySharing: false,
          dataRetention: true,
        },
      };
      api.get.mockResolvedValue(mockResponse);

      const result = await getCVConsent();

      expect(api.get).toHaveBeenCalledWith('/api/cv-consent');
      expect(result).toEqual(mockResponse);
    });

    it('handles consent not found', async () => {
      const mockError = new Error('Consent not found');
      api.get.mockRejectedValue(mockError);

      await expect(getCVConsent()).rejects.toThrow('Consent not found');
    });

    it('handles unauthorized access', async () => {
      const mockError = new Error('Unauthorized');
      api.get.mockRejectedValue(mockError);

      await expect(getCVConsent()).rejects.toThrow('Unauthorized');
    });

    it('returns consent with all flags', async () => {
      const mockResponse = {
        data: {
          accepted: false,
          aiProcessing: false,
          thirdPartySharing: false,
          dataRetention: false,
        },
      };
      api.get.mockResolvedValue(mockResponse);

      const result = await getCVConsent();

      expect(result.data).toHaveProperty('accepted');
      expect(result.data).toHaveProperty('aiProcessing');
      expect(result.data).toHaveProperty('thirdPartySharing');
      expect(result.data).toHaveProperty('dataRetention');
    });
  });

  describe('updateCVConsent', () => {
    it('sends POST request to /api/cv-consent with accepted true and all flags', async () => {
      const consentData = {
        accepted: true,
        aiProcessing: true,
        thirdPartySharing: false,
        dataRetention: true,
      };
      const mockResponse = { data: { success: true } };
      api.post.mockResolvedValue(mockResponse);

      const result = await updateCVConsent(consentData);

      expect(api.post).toHaveBeenCalledWith('/api/cv-consent', {
        accepted: true,
        aiProcessing: true,
        thirdPartySharing: false,
        dataRetention: true,
      });
      expect(result).toEqual(mockResponse);
    });

    it('sends only accepted flag when accepted is false', async () => {
      const consentData = {
        accepted: false,
        aiProcessing: true,
        thirdPartySharing: true,
        dataRetention: true,
      };
      const mockResponse = { data: { success: true } };
      api.post.mockResolvedValue(mockResponse);

      const result = await updateCVConsent(consentData);

      expect(api.post).toHaveBeenCalledWith('/api/cv-consent', {
        accepted: false,
      });
      expect(result).toEqual(mockResponse);
    });

    it('converts flags to boolean when accepted', async () => {
      const consentData = {
        accepted: true,
        aiProcessing: 1, // truthy
        thirdPartySharing: 0, // falsy
        dataRetention: 'yes', // truthy
      };
      const mockResponse = { data: { success: true } };
      api.post.mockResolvedValue(mockResponse);

      await updateCVConsent(consentData);

      expect(api.post).toHaveBeenCalledWith('/api/cv-consent', {
        accepted: true,
        aiProcessing: true,
        thirdPartySharing: false,
        dataRetention: true,
      });
    });

    it('handles update errors', async () => {
      const consentData = {
        accepted: true,
        aiProcessing: true,
        thirdPartySharing: false,
        dataRetention: true,
      };
      const mockError = new Error('Update failed');
      api.post.mockRejectedValue(mockError);

      await expect(updateCVConsent(consentData)).rejects.toThrow('Update failed');
    });

    it('accepts consent with all flags true', async () => {
      const consentData = {
        accepted: true,
        aiProcessing: true,
        thirdPartySharing: true,
        dataRetention: true,
      };
      const mockResponse = { data: { success: true } };
      api.post.mockResolvedValue(mockResponse);

      await updateCVConsent(consentData);

      expect(api.post).toHaveBeenCalledWith('/api/cv-consent', {
        accepted: true,
        aiProcessing: true,
        thirdPartySharing: true,
        dataRetention: true,
      });
    });

    it('accepts consent with all flags false', async () => {
      const consentData = {
        accepted: true,
        aiProcessing: false,
        thirdPartySharing: false,
        dataRetention: false,
      };
      const mockResponse = { data: { success: true } };
      api.post.mockResolvedValue(mockResponse);

      await updateCVConsent(consentData);

      expect(api.post).toHaveBeenCalledWith('/api/cv-consent', {
        accepted: true,
        aiProcessing: false,
        thirdPartySharing: false,
        dataRetention: false,
      });
    });

    it('handles network errors', async () => {
      const consentData = {
        accepted: true,
        aiProcessing: true,
        thirdPartySharing: false,
        dataRetention: true,
      };
      const mockError = new Error('Network error');
      api.post.mockRejectedValue(mockError);

      await expect(updateCVConsent(consentData)).rejects.toThrow('Network error');
    });

    it('handles validation errors', async () => {
      const consentData = {
        accepted: 'invalid', // Should be boolean
        aiProcessing: true,
        thirdPartySharing: false,
        dataRetention: true,
      };
      const mockError = new Error('Invalid consent data');
      api.post.mockRejectedValue(mockError);

      await expect(updateCVConsent(consentData)).rejects.toThrow('Invalid consent data');
    });

    it('omits flags when accepted is false', async () => {
      const consentData = {
        accepted: false,
      };
      const mockResponse = { data: { success: true } };
      api.post.mockResolvedValue(mockResponse);

      await updateCVConsent(consentData);

      const callArgs = api.post.mock.calls[0][1];
      expect(callArgs).toEqual({ accepted: false });
      expect(callArgs).not.toHaveProperty('aiProcessing');
      expect(callArgs).not.toHaveProperty('thirdPartySharing');
      expect(callArgs).not.toHaveProperty('dataRetention');
    });

    it('handles undefined flags when accepted', async () => {
      const consentData = {
        accepted: true,
      };
      const mockResponse = { data: { success: true } };
      api.post.mockResolvedValue(mockResponse);

      await updateCVConsent(consentData);

      expect(api.post).toHaveBeenCalledWith('/api/cv-consent', {
        accepted: true,
        aiProcessing: false,
        thirdPartySharing: false,
        dataRetention: false,
      });
    });
  });
});
