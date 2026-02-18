import api from './axios';
import { uploadCV, getMyCV, getCVStats } from './cv';

jest.mock('./axios');
jest.mock('../i18n', () => ({
  language: 'en'
}));

describe('cv API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadCV', () => {
    it('sends POST request to /api/cv/upload with FormData', async () => {
      const mockFile = new File(['CV content'], 'resume.pdf', { type: 'application/pdf' });
      const language = 'en';
      const mockResponse = {
        data: {
          cv: { id: 1, filename: 'resume.pdf' },
          questionnaire: null
        }
      };
      api.post.mockResolvedValue(mockResponse);

      const result = await uploadCV(mockFile, language);

      expect(api.post).toHaveBeenCalledWith(
        '/api/cv/upload',
        expect.any(FormData),
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Verify FormData contains correct data
      const callArgs = api.post.mock.calls[0];
      const formData = callArgs[1];
      expect(formData.get('cv')).toBe(mockFile);
      expect(formData.get('language')).toBe(language);

      expect(result).toEqual(mockResponse);
    });

    it('defaults to English language when not specified', async () => {
      const mockFile = new File(['CV'], 'resume.pdf', { type: 'application/pdf' });
      const mockResponse = { data: { cv: {} } };
      api.post.mockResolvedValue(mockResponse);

      await uploadCV(mockFile);

      const callArgs = api.post.mock.calls[0];
      const formData = callArgs[1];
      expect(formData.get('language')).toBe('en');
    });

    it('accepts Spanish language parameter', async () => {
      const mockFile = new File(['CV'], 'curriculum.pdf', { type: 'application/pdf' });
      const mockResponse = { data: { cv: {} } };
      api.post.mockResolvedValue(mockResponse);

      await uploadCV(mockFile, 'es');

      const callArgs = api.post.mock.calls[0];
      const formData = callArgs[1];
      expect(formData.get('language')).toBe('es');
    });

    it('handles upload errors', async () => {
      const mockFile = new File(['CV'], 'resume.pdf', { type: 'application/pdf' });
      const mockError = new Error('File too large');
      api.post.mockRejectedValue(mockError);

      await expect(uploadCV(mockFile)).rejects.toThrow('File too large');
    });

    it('handles invalid file format errors', async () => {
      const mockFile = new File(['CV'], 'resume.txt', { type: 'text/plain' });
      const mockError = new Error('Invalid file format');
      api.post.mockRejectedValue(mockError);

      await expect(uploadCV(mockFile)).rejects.toThrow('Invalid file format');
    });

    it('returns questionnaire data when required', async () => {
      const mockFile = new File(['CV'], 'resume.pdf', { type: 'application/pdf' });
      const mockResponse = {
        data: {
          cv: { id: 1 },
          questionnaire: {
            questions: ['Q1', 'Q2']
          }
        }
      };
      api.post.mockResolvedValue(mockResponse);

      const result = await uploadCV(mockFile);

      expect(result.data.questionnaire).toBeDefined();
      expect(result.data.questionnaire.questions).toHaveLength(2);
    });
  });

  describe('getMyCV', () => {
    it('sends GET request to /api/cv/my-cv', async () => {
      const mockResponse = {
        data: {
          cv: {
            id: 1,
            filename: 'my-resume.pdf',
            skills: ['JavaScript', 'React']
          }
        }
      };
      api.get.mockResolvedValue(mockResponse);

      const result = await getMyCV();

      expect(api.get).toHaveBeenCalledWith('/api/cv/my-cv');
      expect(result).toEqual(mockResponse);
    });

    it('handles no CV found', async () => {
      const mockError = new Error('CV not found');
      api.get.mockRejectedValue(mockError);

      await expect(getMyCV()).rejects.toThrow('CV not found');
    });

    it('handles unauthorized access', async () => {
      const mockError = new Error('Unauthorized');
      api.get.mockRejectedValue(mockError);

      await expect(getMyCV()).rejects.toThrow('Unauthorized');
    });

    it('returns complete CV data structure', async () => {
      const mockCV = {
        id: 1,
        filename: 'resume.pdf',
        skills: ['React', 'Node.js'],
        experience: ['Developer at Company A'],
        education: ['CS Degree']
      };
      const mockResponse = { data: { cv: mockCV } };
      api.get.mockResolvedValue(mockResponse);

      const result = await getMyCV();

      expect(result.data.cv).toHaveProperty('id');
      expect(result.data.cv).toHaveProperty('skills');
      expect(result.data.cv).toHaveProperty('experience');
    });
  });

  describe('getCVStats', () => {
    it('sends GET request to /api/cv/stats', async () => {
      const mockStats = {
        data: {
          total: 100,
          processed: 95,
          pending: 5
        }
      };
      api.get.mockResolvedValue(mockStats);

      const result = await getCVStats();

      expect(api.get).toHaveBeenCalledWith('/api/cv/stats');
      expect(result).toEqual(mockStats);
    });

    it('handles statistics retrieval errors', async () => {
      const mockError = new Error('Failed to fetch stats');
      api.get.mockRejectedValue(mockError);

      await expect(getCVStats()).rejects.toThrow('Failed to fetch stats');
    });

    it('returns statistics object', async () => {
      const mockStats = {
        data: {
          total: 50,
          byStatus: {
            pending: 10,
            reviewed: 30,
            rejected: 10
          }
        }
      };
      api.get.mockResolvedValue(mockStats);

      const result = await getCVStats();

      expect(result.data).toHaveProperty('total');
      expect(result.data).toHaveProperty('byStatus');
    });

    it('handles empty statistics', async () => {
      const mockStats = { data: { total: 0 } };
      api.get.mockResolvedValue(mockStats);

      const result = await getCVStats();

      expect(result.data.total).toBe(0);
    });
  });
});
