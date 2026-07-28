import * as manualRisksApi from './manualRisks';
import api from './axios';

jest.mock('./axios');

describe('Manual Risks API', () => {
  const projectId = '507f1f77bcf86cd799439012';
  const riskId = '507f1f77bcf86cd799439011';

  const mockRiskData = {
    type: 'vendor_lock_in',
    title: 'Vendor API Downtime Risk',
    description: 'Risk of API downtime from third-party vendor',
    severity: 'high',
    probability: 0.65,
    category: 'technical',
    rootCause: 'No SLA agreement',
    indicators: ['No SLA', 'Previous downtime incidents'],
    recommendations: ['Implement caching', 'Research alternatives'],
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addManualRisk', () => {
    it('should POST a new manual risk', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { ...mockRiskData, _id: riskId },
        },
      };

      api.post.mockResolvedValueOnce(mockResponse);

      const result = await manualRisksApi.addManualRisk(projectId, mockRiskData);

      expect(api.post).toHaveBeenCalledWith(
        `/api/projects/${projectId}/risks/manual`,
        mockRiskData
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors', async () => {
      const error = new Error('Network error');
      api.post.mockRejectedValueOnce(error);

      await expect(manualRisksApi.addManualRisk(projectId, mockRiskData)).rejects.toThrow(
        'Network error'
      );
    });
  });

  describe('getProjectManualRisks', () => {
    it('should GET manual risks for a project', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            risks: [{ ...mockRiskData, _id: riskId }],
          },
        },
      };

      api.get.mockResolvedValueOnce(mockResponse);

      const result = await manualRisksApi.getProjectManualRisks(projectId);

      expect(api.get).toHaveBeenCalledWith(`/api/projects/${projectId}/risks/manual`);
      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors', async () => {
      const error = new Error('Network error');
      api.get.mockRejectedValueOnce(error);

      await expect(manualRisksApi.getProjectManualRisks(projectId)).rejects.toThrow(
        'Network error'
      );
    });
  });

  describe('updateManualRisk', () => {
    it('should PUT an updated manual risk', async () => {
      const updateData = { severity: 'critical', probability: 0.85 };
      const mockResponse = {
        data: {
          success: true,
          data: { ...mockRiskData, ...updateData, _id: riskId },
        },
      };

      api.put.mockResolvedValueOnce(mockResponse);

      const result = await manualRisksApi.updateManualRisk(projectId, riskId, updateData);

      expect(api.put).toHaveBeenCalledWith(
        `/api/projects/${projectId}/risks/${riskId}`,
        updateData
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors', async () => {
      const error = new Error('Not found');
      api.put.mockRejectedValueOnce(error);

      await expect(manualRisksApi.updateManualRisk(projectId, riskId, {})).rejects.toThrow(
        'Not found'
      );
    });
  });

  describe('deleteManualRisk', () => {
    it('should DELETE a manual risk', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Risk deleted successfully',
        },
      };

      api.delete.mockResolvedValueOnce(mockResponse);

      const result = await manualRisksApi.deleteManualRisk(projectId, riskId);

      expect(api.delete).toHaveBeenCalledWith(`/api/projects/${projectId}/risks/${riskId}`);
      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors', async () => {
      const error = new Error('Cannot delete');
      api.delete.mockRejectedValueOnce(error);

      await expect(manualRisksApi.deleteManualRisk(projectId, riskId)).rejects.toThrow(
        'Cannot delete'
      );
    });
  });

  describe('submitProjectOutcome', () => {
    it('should POST project outcome with actualized risks', async () => {
      const outcomeData = {
        completed: true,
        qualityScore: 4,
        actualizedRisks: [
          {
            type: 'vendor_lock_in',
            occurred: true,
            severity: 'high',
          },
        ],
      };

      const mockResponse = {
        data: {
          success: true,
          data: {
            case: {
              id: '507f...',
              addedToKnowledgeBase: true,
            },
          },
        },
      };

      api.post.mockResolvedValueOnce(mockResponse);

      const result = await manualRisksApi.submitProjectOutcome(projectId, outcomeData);

      expect(api.post).toHaveBeenCalledWith(`/api/projects/${projectId}/outcome`, outcomeData);
      expect(result).toEqual(mockResponse);
    });
  });
});
