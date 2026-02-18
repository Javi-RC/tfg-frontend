import api from './axios';
import {
  getEmployeesWithoutTest,
  notifyPendingEmployees,
  notifyPendingEmployee,
  getOrganizationBFI44Stats
} from './bfi44Admin';

jest.mock('./axios');

describe('bfi44Admin API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getEmployeesWithoutTest', () => {
    it('sends GET request to /api/bfi-44/employees-without-test without params', async () => {
      const mockResponse = {
        data: {
          success: true,
          count: 2,
          employees: [
            { id: '64abc', name: 'Juan Pérez', email: 'juan@empresa.com' },
            { id: '64def', name: 'María López', email: 'maria@empresa.com' }
          ]
        }
      };
      api.get.mockResolvedValue(mockResponse);

      const result = await getEmployeesWithoutTest();

      expect(api.get).toHaveBeenCalledWith('/api/bfi-44/employees-without-test');
      expect(result.data.employees).toHaveLength(2);
    });

    it('handles forbidden error for unauthorized users', async () => {
      const mockError = new Error('You must be an organization admin or project manager');
      api.get.mockRejectedValue(mockError);

      await expect(getEmployeesWithoutTest()).rejects.toThrow(
        'You must be an organization admin or project manager'
      );
    });
  });

  describe('notifyPendingEmployees', () => {
    it('sends POST request to /api/bfi-44/notify-pending without body', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: '3 empleado(s) notificado(s)',
          notified: 3,
          employees: [
            { id: '64abc', name: 'Juan Pérez', email: 'juan@empresa.com' }
          ]
        }
      };
      api.post.mockResolvedValue(mockResponse);

      const result = await notifyPendingEmployees();

      expect(api.post).toHaveBeenCalledWith('/api/bfi-44/notify-pending');
      expect(result.data.notified).toBe(3);
    });

    it('returns zero when all employees completed the test', async () => {
      const mockResponse = {
        data: {
          success: true,
          notified: 0,
          message: 'Todos los empleados han completado el test'
        }
      };
      api.post.mockResolvedValue(mockResponse);

      const result = await notifyPendingEmployees();

      expect(result.data.notified).toBe(0);
    });
  });

  describe('notifyPendingEmployee', () => {
    it('sends POST request to /api/bfi-44/notify-pending/:userId', async () => {
      const mockResponse = {
        data: {
          success: true,
          notified: true,
          userId: '64abc',
          userName: 'Juan'
        }
      };
      api.post.mockResolvedValue(mockResponse);

      const result = await notifyPendingEmployee('64abc');

      expect(api.post).toHaveBeenCalledWith('/api/bfi-44/notify-pending/64abc');
      expect(result.data.notified).toBe(true);
      expect(result.data.userName).toBe('Juan');
    });

    it('returns notified false when employee already completed test', async () => {
      const mockResponse = {
        data: {
          success: true,
          notified: false,
          reason: 'Usuario ya completó el test'
        }
      };
      api.post.mockResolvedValue(mockResponse);

      const result = await notifyPendingEmployee('64def');

      expect(result.data.notified).toBe(false);
      expect(result.data.reason).toBeDefined();
    });

    it('handles forbidden error for unauthorized users', async () => {
      const mockError = new Error('Forbidden');
      api.post.mockRejectedValue(mockError);

      await expect(notifyPendingEmployee('64abc')).rejects.toThrow('Forbidden');
    });
  });

  describe('getOrganizationBFI44Stats', () => {
    it('sends GET request to /api/bfi-44/organization-stats without params', async () => {
      const mockResponse = {
        data: {
          success: true,
          totalEmployees: 15,
          completed: 12,
          pending: 3,
          completionRate: 80.0
        }
      };
      api.get.mockResolvedValue(mockResponse);

      const result = await getOrganizationBFI44Stats();

      expect(api.get).toHaveBeenCalledWith('/api/bfi-44/organization-stats');
      expect(result.data.totalEmployees).toBe(15);
      expect(result.data.completed).toBe(12);
      expect(result.data.pending).toBe(3);
      expect(result.data.completionRate).toBe(80.0);
    });

    it('handles forbidden error for non-admin users', async () => {
      const mockError = new Error('Forbidden');
      api.get.mockRejectedValue(mockError);

      await expect(getOrganizationBFI44Stats()).rejects.toThrow('Forbidden');
    });
  });
});
