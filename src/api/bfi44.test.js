import api from './axios';
import {
  getQuestions,
  submitResponses,
  getMyProfile,
  hasProfile,
  getProfileByUserId,
  recalculateProfile
} from './bfi44';

jest.mock('./axios');

describe('bfi44 API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getQuestions', () => {
    it('sends GET request to /api/bfi-44/questions', async () => {
      const mockResponse = {
        data: {
          questions: [
            { id: 1, text: 'Question 1' },
            { id: 2, text: 'Question 2' }
          ],
          scale: [1, 2, 3, 4, 5]
        }
      };
      api.get.mockResolvedValue(mockResponse);

      const result = await getQuestions();

      expect(api.get).toHaveBeenCalledWith('/api/bfi-44/questions');
      expect(result).toEqual(mockResponse);
    });

    it('handles errors when fetching questions', async () => {
      const mockError = new Error('Failed to fetch questions');
      api.get.mockRejectedValue(mockError);

      await expect(getQuestions()).rejects.toThrow('Failed to fetch questions');
    });

    it('returns all 44 questions', async () => {
      const mockQuestions = Array.from({ length: 44 }, (_, i) => ({
        id: i + 1,
        text: `Question ${i + 1}`
      }));
      const mockResponse = { data: { questions: mockQuestions } };
      api.get.mockResolvedValue(mockResponse);

      const result = await getQuestions();

      expect(result.data.questions).toHaveLength(44);
    });
  });

  describe('submitResponses', () => {
    it('sends POST request to /api/bfi-44/submit with responses', async () => {
      const responses = {
        1: 4,
        2: 3,
        3: 5
      };
      const mockResponse = {
        data: {
          results: {
            openness: 3.5,
            conscientiousness: 4.0,
            extraversion: 3.0,
            agreeableness: 4.5,
            neuroticism: 2.5
          }
        }
      };
      api.post.mockResolvedValue(mockResponse);

      const result = await submitResponses(responses);

      expect(api.post).toHaveBeenCalledWith('/api/bfi-44/submit', { responses });
      expect(result).toEqual(mockResponse);
    });

    it('handles validation errors', async () => {
      const responses = { 1: 6 }; // Invalid value
      const mockError = new Error('Invalid response value');
      api.post.mockRejectedValue(mockError);

      await expect(submitResponses(responses)).rejects.toThrow('Invalid response value');
    });

    it('submits all 44 responses', async () => {
      const responses = Object.fromEntries(
        Array.from({ length: 44 }, (_, i) => [i + 1, 3])
      );
      const mockResponse = { data: { results: {} } };
      api.post.mockResolvedValue(mockResponse);

      await submitResponses(responses);

      expect(api.post).toHaveBeenCalledWith('/api/bfi-44/submit', { responses });
    });

    it('handles empty responses', async () => {
      const responses = {};
      const mockError = new Error('No responses provided');
      api.post.mockRejectedValue(mockError);

      await expect(submitResponses(responses)).rejects.toThrow('No responses provided');
    });
  });

  describe('getMyProfile', () => {
    it('sends GET request to /api/bfi-44/my-profile', async () => {
      const mockProfile = {
        data: {
          profile: {
            openness: 4.0,
            conscientiousness: 3.5,
            extraversion: 4.5,
            agreeableness: 4.0,
            neuroticism: 2.0
          }
        }
      };
      api.get.mockResolvedValue(mockProfile);

      const result = await getMyProfile();

      expect(api.get).toHaveBeenCalledWith('/api/bfi-44/my-profile');
      expect(result).toEqual(mockProfile);
    });

    it('handles profile not found', async () => {
      const mockError = new Error('Profile not found');
      api.get.mockRejectedValue(mockError);

      await expect(getMyProfile()).rejects.toThrow('Profile not found');
    });

    it('handles unauthorized access', async () => {
      const mockError = new Error('Unauthorized');
      api.get.mockRejectedValue(mockError);

      await expect(getMyProfile()).rejects.toThrow('Unauthorized');
    });
  });

  describe('hasProfile', () => {
    it('sends GET request to /api/bfi-44/has-profile', async () => {
      const mockResponse = { data: { hasProfile: true } };
      api.get.mockResolvedValue(mockResponse);

      const result = await hasProfile();

      expect(api.get).toHaveBeenCalledWith('/api/bfi-44/has-profile');
      expect(result).toEqual(mockResponse);
    });

    it('returns false when no profile exists', async () => {
      const mockResponse = { data: { hasProfile: false } };
      api.get.mockResolvedValue(mockResponse);

      const result = await hasProfile();

      expect(result.data.hasProfile).toBe(false);
    });

    it('returns true when profile exists', async () => {
      const mockResponse = { data: { hasProfile: true } };
      api.get.mockResolvedValue(mockResponse);

      const result = await hasProfile();

      expect(result.data.hasProfile).toBe(true);
    });

    it('handles errors checking profile', async () => {
      const mockError = new Error('Failed to check profile');
      api.get.mockRejectedValue(mockError);

      await expect(hasProfile()).rejects.toThrow('Failed to check profile');
    });
  });

  describe('getProfileByUserId', () => {
    it('sends GET request to /api/bfi-44/profile/:userId', async () => {
      const userId = '123';
      const mockProfile = {
        data: {
          profile: {
            userId: '123',
            openness: 4.0
          }
        }
      };
      api.get.mockResolvedValue(mockProfile);

      const result = await getProfileByUserId(userId);

      expect(api.get).toHaveBeenCalledWith(`/api/bfi-44/profile/${userId}`);
      expect(result).toEqual(mockProfile);
    });

    it('handles user not found', async () => {
      const userId = '999';
      const mockError = new Error('User not found');
      api.get.mockRejectedValue(mockError);

      await expect(getProfileByUserId(userId)).rejects.toThrow('User not found');
    });

    it('handles unauthorized access to other user profile', async () => {
      const userId = '456';
      const mockError = new Error('Forbidden');
      api.get.mockRejectedValue(mockError);

      await expect(getProfileByUserId(userId)).rejects.toThrow('Forbidden');
    });

    it('allows admin to access any profile', async () => {
      const userId = '789';
      const mockProfile = { data: { profile: {} } };
      api.get.mockResolvedValue(mockProfile);

      await getProfileByUserId(userId);

      expect(api.get).toHaveBeenCalledWith(`/api/bfi-44/profile/${userId}`);
    });
  });

  describe('recalculateProfile', () => {
    it('sends POST request to /api/bfi-44/recalculate/:responseId', async () => {
      const responseId = 'response123';
      const mockResponse = {
        data: {
          recalculated: true,
          profile: {
            openness: 3.8
          }
        }
      };
      api.post.mockResolvedValue(mockResponse);

      const result = await recalculateProfile(responseId);

      expect(api.post).toHaveBeenCalledWith(`/api/bfi-44/recalculate/${responseId}`);
      expect(result).toEqual(mockResponse);
    });

    it('requires admin privileges', async () => {
      const responseId = 'response456';
      const mockError = new Error('Admin access required');
      api.post.mockRejectedValue(mockError);

      await expect(recalculateProfile(responseId)).rejects.toThrow('Admin access required');
    });

    it('handles invalid response ID', async () => {
      const responseId = 'invalid';
      const mockError = new Error('Response not found');
      api.post.mockRejectedValue(mockError);

      await expect(recalculateProfile(responseId)).rejects.toThrow('Response not found');
    });

    it('returns recalculated results', async () => {
      const responseId = 'response789';
      const mockResponse = {
        data: {
          recalculated: true,
          profile: {
            openness: 4.2,
            conscientiousness: 3.9
          }
        }
      };
      api.post.mockResolvedValue(mockResponse);

      const result = await recalculateProfile(responseId);

      expect(result.data.recalculated).toBe(true);
      expect(result.data.profile).toHaveProperty('openness');
    });
  });
});
