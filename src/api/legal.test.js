import api from './axios';
import { getTerms } from './legal';

jest.mock('./axios');

describe('legal API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTerms', () => {
    it('sends GET request to /api/legal/terms with default params', async () => {
      const mockResponse = {
        data: {
          document: {
            version: '1.0',
            lastUpdated: '2024-01-01',
            content: '# Terms of Service\n\n...'
          }
        }
      };
      api.get.mockResolvedValue(mockResponse);

      const result = await getTerms();

      expect(api.get).toHaveBeenCalledWith('/api/legal/terms', {
        params: {},
        responseType: 'json'
      });
      expect(result).toEqual(mockResponse);
    });

    it('sends locale parameter when provided', async () => {
      const mockResponse = { data: { document: {} } };
      api.get.mockResolvedValue(mockResponse);

      await getTerms({ locale: 'es' });

      expect(api.get).toHaveBeenCalledWith('/api/legal/terms', {
        params: { locale: 'es' },
        responseType: 'json'
      });
    });

    it('sends format parameter when provided', async () => {
      const mockResponse = { data: '# Terms in markdown' };
      api.get.mockResolvedValue(mockResponse);

      await getTerms({ format: 'markdown' });

      expect(api.get).toHaveBeenCalledWith('/api/legal/terms', {
        params: { format: 'markdown' },
        responseType: 'text'
      });
    });

    it('uses text responseType for markdown format', async () => {
      const mockResponse = { data: '# Markdown content' };
      api.get.mockResolvedValue(mockResponse);

      await getTerms({ format: 'markdown' });

      expect(api.get).toHaveBeenCalledWith(
        '/api/legal/terms',
        expect.objectContaining({ responseType: 'text' })
      );
    });

    it('uses text responseType for text format', async () => {
      const mockResponse = { data: 'Plain text content' };
      api.get.mockResolvedValue(mockResponse);

      await getTerms({ format: 'text' });

      expect(api.get).toHaveBeenCalledWith(
        '/api/legal/terms',
        expect.objectContaining({ responseType: 'text' })
      );
    });

    it('uses json responseType when format not provided', async () => {
      const mockResponse = { data: { document: {} } };
      api.get.mockResolvedValue(mockResponse);

      await getTerms();

      expect(api.get).toHaveBeenCalledWith(
        '/api/legal/terms',
        expect.objectContaining({ responseType: 'json' })
      );
    });

    it('sends both locale and format parameters', async () => {
      const mockResponse = { data: '# Spanish markdown' };
      api.get.mockResolvedValue(mockResponse);

      await getTerms({ locale: 'es', format: 'markdown' });

      expect(api.get).toHaveBeenCalledWith('/api/legal/terms', {
        params: { locale: 'es', format: 'markdown' },
        responseType: 'text'
      });
    });

    it('handles English locale', async () => {
      const mockResponse = { data: { document: {} } };
      api.get.mockResolvedValue(mockResponse);

      await getTerms({ locale: 'en' });

      expect(api.get).toHaveBeenCalledWith('/api/legal/terms', {
        params: { locale: 'en' },
        responseType: 'json'
      });
    });

    it('handles unsupported locale with 406 error', async () => {
      const mockError = new Error('Not Acceptable');
      mockError.response = { status: 406 };
      api.get.mockRejectedValue(mockError);

      await expect(getTerms({ locale: 'fr' })).rejects.toThrow('Not Acceptable');
    });

    it('handles network errors', async () => {
      const mockError = new Error('Network error');
      api.get.mockRejectedValue(mockError);

      await expect(getTerms()).rejects.toThrow('Network error');
    });

    it('returns JSON document structure', async () => {
      const mockDocument = {
        version: '2.0',
        lastUpdated: '2024-03-15',
        content: '# Updated Terms\n\nContent here...'
      };
      const mockResponse = { data: { document: mockDocument } };
      api.get.mockResolvedValue(mockResponse);

      const result = await getTerms();

      expect(result.data.document).toHaveProperty('version');
      expect(result.data.document).toHaveProperty('lastUpdated');
      expect(result.data.document).toHaveProperty('content');
    });

    it('returns markdown text when format is markdown', async () => {
      const markdownContent = '# Terms\n\n## Section 1\n\nContent...';
      const mockResponse = { data: markdownContent };
      api.get.mockResolvedValue(mockResponse);

      const result = await getTerms({ format: 'markdown' });

      expect(typeof result.data).toBe('string');
      expect(result.data).toContain('# Terms');
    });

    it('returns plain text when format is text', async () => {
      const textContent = 'Terms of Service\n\nSection 1\n\nContent...';
      const mockResponse = { data: textContent };
      api.get.mockResolvedValue(mockResponse);

      const result = await getTerms({ format: 'text' });

      expect(typeof result.data).toBe('string');
    });

    it('handles empty object params', async () => {
      const mockResponse = { data: { document: {} } };
      api.get.mockResolvedValue(mockResponse);

      await getTerms({});

      expect(api.get).toHaveBeenCalledWith('/api/legal/terms', {
        params: {},
        responseType: 'json'
      });
    });

    it('handles undefined params', async () => {
      const mockResponse = { data: { document: {} } };
      api.get.mockResolvedValue(mockResponse);

      await getTerms(undefined);

      expect(api.get).toHaveBeenCalledWith('/api/legal/terms', {
        params: {},
        responseType: 'json'
      });
    });

    it('handles server errors', async () => {
      const mockError = new Error('Internal server error');
      mockError.response = { status: 500 };
      api.get.mockRejectedValue(mockError);

      await expect(getTerms()).rejects.toThrow('Internal server error');
    });

    it('handles document not found', async () => {
      const mockError = new Error('Document not found');
      mockError.response = { status: 404 };
      api.get.mockRejectedValue(mockError);

      await expect(getTerms()).rejects.toThrow('Document not found');
    });

    it('includes version in returned document', async () => {
      const mockResponse = {
        data: {
          document: {
            version: '3.1.0',
            lastUpdated: '2024-06-01',
            content: 'Content'
          }
        }
      };
      api.get.mockResolvedValue(mockResponse);

      const result = await getTerms();

      expect(result.data.document.version).toBe('3.1.0');
    });

    it('includes lastUpdated timestamp', async () => {
      const mockResponse = {
        data: {
          document: {
            version: '1.0',
            lastUpdated: '2024-01-15T10:30:00Z',
            content: 'Content'
          }
        }
      };
      api.get.mockResolvedValue(mockResponse);

      const result = await getTerms();

      expect(result.data.document.lastUpdated).toBeDefined();
    });
  });
});
