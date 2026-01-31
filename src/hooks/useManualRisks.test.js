import { renderHook, act, waitFor } from '@testing-library/react';
import { useManualRisks } from './useManualRisks';
import * as manualRisksApi from '../api/manualRisks';

jest.mock('../api/manualRisks');

describe('useManualRisks Hook', () => {
  const projectId = '507f1f77bcf86cd799439012';

  const mockRisks = [
    {
      _id: '507f1f77bcf86cd799439011',
      type: 'vendor_lock_in',
      title: 'Vendor Risk',
      description: 'Risk of vendor lock-in',
      severity: 'high',
      rootCause: 'Contract constraints',
      recommendations: ['Negotiate SLA'],
      indicators: ['High dependency']
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loadManualRisks', () => {
    it('should load manual risks successfully', async () => {
      manualRisksApi.getAllProjectRisks.mockResolvedValueOnce({
        data: {
          success: true,
          data: { risks: mockRisks }
        }
      });

      const { result } = renderHook(() => useManualRisks(projectId));

      expect(result.current.loading).toBe(false);
      expect(result.current.manualRisks).toEqual([]);

      await act(async () => {
        await result.current.loadManualRisks();
      });

      await waitFor(() => {
        expect(result.current.manualRisks).toEqual(mockRisks);
        expect(result.current.loading).toBe(false);
      });
    });

    it('should handle load errors', async () => {
      const error = new Error('Load failed');
      error.response = { data: { error: 'Failed to load risks' } };

      manualRisksApi.getAllProjectRisks.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useManualRisks(projectId));

      await act(async () => {
        await result.current.loadManualRisks();
      });

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
        expect(result.current.manualRisks).toEqual([]);
      });
    });
  });

  describe('addRisk', () => {
    it('should add a new risk', async () => {
      const newRisk = {
        type: 'schedule_overrun',
        title: 'Schedule Risk',
        description: 'Risk of schedule overrun',
        severity: 'medium'
      };

      manualRisksApi.addManualRisk.mockResolvedValueOnce({
        data: {
          data: { ...newRisk, _id: '507f1f77bcf86cd799439013' }
        }
      });

      const { result } = renderHook(() => useManualRisks(projectId));

      let addedRisk;
      await act(async () => {
        addedRisk = await result.current.addRisk(newRisk);
      });

      await waitFor(() => {
        expect(result.current.manualRisks).toContain(addedRisk);
      });
    });

    it('should handle add errors', async () => {
      const error = new Error('Add failed');
      error.response = { data: { error: 'Failed to add risk' } };

      manualRisksApi.addManualRisk.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useManualRisks(projectId));

      let addedRisk;
      await act(async () => {
        addedRisk = await result.current.addRisk({
          type: 'schedule_overrun',
          title: 'Test Risk',
          description: 'Test'
        });
      });

      await waitFor(() => {
        expect(addedRisk).toBeNull();
        expect(result.current.error).toBeTruthy();
      });
    });
  });

  describe('updateRisk', () => {
    it('should update an existing risk', async () => {
      const riskId = '507f1f77bcf86cd799439011';
      const updateData = { severity: 'critical' };

      const { result } = renderHook(() => useManualRisks(projectId));

      manualRisksApi.getAllProjectRisks.mockResolvedValueOnce({
        data: {
          success: true,
          data: { risks: mockRisks }
        }
      });

      await act(async () => {
        await result.current.loadManualRisks();
      });

      manualRisksApi.updateManualRisk.mockResolvedValueOnce({
        data: {
          data: { ...mockRisks[0], ...updateData }
        }
      });

      let updatedRisk;
      await act(async () => {
        updatedRisk = await result.current.updateRisk(riskId, updateData);
      });

      await waitFor(() => {
        expect(updatedRisk).toEqual(expect.objectContaining({ _id: riskId, severity: 'critical' }));
        expect(result.current.manualRisks).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ _id: riskId, severity: 'critical' })
          ])
        );
      });
    });
  });

  describe('deleteRisk', () => {
    it('should delete a risk', async () => {
      const riskId = '507f1f77bcf86cd799439011';

      const { result } = renderHook(() => useManualRisks(projectId));

      manualRisksApi.getAllProjectRisks.mockResolvedValueOnce({
        data: {
          success: true,
          data: { risks: mockRisks }
        }
      });

      await act(async () => {
        await result.current.loadManualRisks();
      });

      manualRisksApi.deleteManualRisk.mockResolvedValueOnce({
        data: { success: true }
      });

      let result_;
      await act(async () => {
        result_ = await result.current.deleteRisk(riskId);
      });

      await waitFor(() => {
        expect(result_).toBe(true);
        expect(result.current.manualRisks).not.toContainEqual(
          expect.objectContaining({ _id: riskId })
        );
      });
    });

    it('should handle delete errors', async () => {
      const error = new Error('Delete failed');
      error.response = { data: { error: 'Cannot delete risk' } };

      manualRisksApi.deleteManualRisk.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useManualRisks(projectId));

      let deleteResult;
      await act(async () => {
        deleteResult = await result.current.deleteRisk('507f1f77bcf86cd799439011');
      });

      await waitFor(() => {
        expect(deleteResult).toBe(false);
        expect(result.current.error).toBeTruthy();
      });
    });
  });

  describe('clearError', () => {
    it('should clear the error state', async () => {
      const error = new Error('Test error');
      error.response = { data: { error: 'Test error' } };

      manualRisksApi.getAllProjectRisks.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useManualRisks(projectId));

      await act(async () => {
        await result.current.loadManualRisks();
      });

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });

  it('should not load risks if projectId is not provided', async () => {
    const { result } = renderHook(() => useManualRisks(null));

    await act(async () => {
      await result.current.loadManualRisks();
    });

    expect(manualRisksApi.getProjectManualRisks).not.toHaveBeenCalled();
  });
});
