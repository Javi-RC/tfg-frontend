import api from './axios';
import { pingHealth } from './health';

jest.mock('./axios');

describe('health API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('pingHealth', () => {
    it('probes /health with the warm-up attempt timeout by default', async () => {
      api.get.mockResolvedValue({ status: 200, data: { status: 'OK' } });

      await pingHealth();

      expect(api.get).toHaveBeenCalledWith('/health', {
        signal: undefined,
        timeout: 12000,
      });
    });

    it('forwards an abort signal and a clamped timeout', async () => {
      const controller = new AbortController();
      api.get.mockResolvedValue({ status: 200 });

      await pingHealth({ signal: controller.signal, timeout: 5000 });

      expect(api.get).toHaveBeenCalledWith('/health', {
        signal: controller.signal,
        timeout: 5000,
      });
    });

    it('returns the response untouched', async () => {
      const response = { status: 200, data: { status: 'OK', timestamp: '2024-01-01' } };
      api.get.mockResolvedValue(response);

      await expect(pingHealth()).resolves.toBe(response);
    });

    it('propagates the cold-database 503 for the caller to retry', async () => {
      const error = new Error('Service Unavailable');
      error.response = { status: 503, data: { success: false, error: 'Database not connected' } };
      api.get.mockRejectedValue(error);

      await expect(pingHealth()).rejects.toThrow('Service Unavailable');
    });
  });
});
