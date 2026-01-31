import { renderHook, act, waitFor } from '@testing-library/react';
import { useRiskMonitoringAndOutcome } from './useRiskMonitoringAndOutcome';
import * as riskService from '../api/riskService';
import * as projectsApi from '../api/projects';
import * as manualRisksApi from '../api/manualRisks';
import { RISK_STATUS } from '../types/riskTypes';

// Mock API modules
jest.mock('../api/riskService');
jest.mock('../api/projects');
jest.mock('../api/manualRisks');

describe('useRiskMonitoringAndOutcome', () => {
  const mockProjectId = 'project123';
  
  const mockRisks = [
    {
      _id: 'risk1',
      type: 'communication_breakdown',
      severity: 'high',
      probability: 0.8,
      status: RISK_STATUS.PREDICTED,
      occurred: null
    },
    {
      _id: 'risk2',
      type: 'skill_gap',
      severity: 'medium',
      probability: 0.6,
      status: RISK_STATUS.PREDICTED,
      occurred: null
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loadRisks', () => {
    it('should load all risks for project', async () => {
      riskService.getProjectRisksFiltered.mockResolvedValue({
        data: { risks: mockRisks }
      });

      const { result } = renderHook(() => useRiskMonitoringAndOutcome(mockProjectId));

      await act(async () => {
        await result.current.loadRisks();
      });

      expect(riskService.getProjectRisksFiltered).toHaveBeenCalledWith(
        mockProjectId,
        {}
      );
      expect(result.current.risks).toEqual(mockRisks);
      expect(result.current.loading).toBe(false);
    });

    it('should handle errors when loading risks', async () => {
      const errorMessage = 'Failed to load risks';
      riskService.getProjectRisksFiltered.mockRejectedValue({
        response: { data: { error: errorMessage } }
      });

      const { result } = renderHook(() => useRiskMonitoringAndOutcome(mockProjectId));

      await act(async () => {
        await result.current.loadRisks();
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.loading).toBe(false);
    });
  });

  describe('loadMonitoringRisks', () => {
    it('should load only predicted risks', async () => {
      riskService.getProjectRisksFiltered.mockResolvedValue({
        data: { risks: mockRisks }
      });

      const { result } = renderHook(() => useRiskMonitoringAndOutcome(mockProjectId));

      await act(async () => {
        await result.current.loadMonitoringRisks();
      });

      expect(riskService.getProjectRisksFiltered).toHaveBeenCalledWith(
        mockProjectId,
        {
          status: RISK_STATUS.PREDICTED
        }
      );
    });
  });

  describe('loadOccurredRisks', () => {
    it('should load only risks that have occurred', async () => {
      const occurredRisks = [
        { ...mockRisks[0], occurred: true, status: RISK_STATUS.OCCURRED }
      ];

      riskService.getProjectRisksFiltered.mockResolvedValue({
        data: { risks: occurredRisks }
      });

      const { result } = renderHook(() => useRiskMonitoringAndOutcome(mockProjectId));

      await act(async () => {
        await result.current.loadOccurredRisks();
      });

      expect(riskService.getProjectRisksFiltered).toHaveBeenCalledWith(
        mockProjectId,
        { occurred: true }
      );
    });
  });

  describe('markAsOccurred', () => {
    it('should mark a risk as occurred and refresh risks', async () => {
      const riskId = 'risk1';
      const occurrenceData = {
        actualSeverity: 'high',
        actualImpact: {
          scheduleDelayDays: 3,
          budgetOverrunPercent: 5,
          qualityScore: 0.75,
          description: 'Communication breakdown occurred'
        },
        rootCause: 'PM was unavailable'
      };

      riskService.markRiskAsOccurred.mockResolvedValue({ data: { success: true } });
      riskService.getProjectRisksFiltered.mockResolvedValue({
        data: { risks: mockRisks }
      });

      const { result } = renderHook(() => useRiskMonitoringAndOutcome(mockProjectId));

      let success;
      await act(async () => {
        success = await result.current.markAsOccurred(riskId, occurrenceData);
      });

      expect(riskService.markRiskAsOccurred).toHaveBeenCalledWith(
        riskId,
        expect.objectContaining({
          occurred: true,
          detectedAt: expect.any(String),
          ...occurrenceData
        })
      );
      expect(success).toBe(true);
      expect(riskService.getProjectRisksFiltered).toHaveBeenCalled(); // Refreshed
    });

    it('should handle errors when marking risk as occurred', async () => {
      const riskId = 'risk1';
      const errorMessage = 'Not authorized';

      riskService.markRiskAsOccurred.mockRejectedValue({
        response: { data: { error: errorMessage } }
      });

      const { result } = renderHook(() => useRiskMonitoringAndOutcome(mockProjectId));

      let success;
      await act(async () => {
        success = await result.current.markAsOccurred(riskId, {});
      });

      expect(success).toBe(false);
      expect(result.current.error).toBe(errorMessage);
    });
  });

  describe('loadOutcomeForm', () => {
    it('should load pre-filled outcome form data', async () => {
      const mockFormData = {
        predictedRisks: mockRisks,
        projectDates: {
          startDate: '2025-01-01',
          plannedEndDate: '2025-02-28'
        }
      };

      riskService.getOutcomeFormData.mockResolvedValue({
        data: mockFormData
      });

      const { result } = renderHook(() => useRiskMonitoringAndOutcome(mockProjectId));

      let formData;
      await act(async () => {
        formData = await result.current.loadOutcomeForm();
      });

      expect(riskService.getOutcomeFormData).toHaveBeenCalledWith(mockProjectId);
      expect(formData).toEqual(mockFormData);
      expect(result.current.outcomeFormData).toEqual(mockFormData);
    });
  });

  describe('submitOutcome', () => {
    it('should complete project and submit outcome in correct order', async () => {
      const outcomeData = {
        completed: true,
        actualCompletedDate: '2025-01-30',
        actualHours: 320,
        budgetOverrun: 2500,
        qualityScore: 0.82,
        clientSatisfaction: 4.5,
        teamMorale: 4.0,
        actualizedRisks: [
          {
            type: 'communication_breakdown',
            occurred: true,
            severity: 'high'
          },
          {
            type: 'skill_gap',
            occurred: false
          }
        ],
        lessonsLearned: ['Daily standups crucial'],
        successfulPractices: ['Code reviews'],
        unsuccessfulPractices: ['Slack-only'],
        recommendations: ['Video standups'],
        metrics: { velocityAvg: 45 }
      };

      const mockResponse = {
        project: { id: mockProjectId, status: 'completed' },
        case: {
          id: 'case123',
          addedToKnowledgeBase: true
        },
        predictionAccuracy: {
          correctPredictions: 8,
          missedRisks: 1,
          falsePositives: 2,
          accuracy: 0.73
        }
      };

      projectsApi.completeProject.mockResolvedValue({ data: { success: true } });
      manualRisksApi.submitProjectOutcome.mockResolvedValue({
        data: mockResponse
      });

      const { result } = renderHook(() => useRiskMonitoringAndOutcome(mockProjectId));

      let response;
      await act(async () => {
        response = await result.current.submitOutcome(outcomeData);
      });

      // Verify correct order of calls
      expect(projectsApi.completeProject).toHaveBeenCalledWith(mockProjectId);
      expect(manualRisksApi.submitProjectOutcome).toHaveBeenCalledWith(
        mockProjectId,
        outcomeData
      );

      // Verify completeProject was called before submitProjectOutcome
      const completeCalled = projectsApi.completeProject.mock.invocationCallOrder[0];
      const submitCalled = manualRisksApi.submitProjectOutcome.mock.invocationCallOrder[0];
      expect(completeCalled).toBeLessThan(submitCalled);

      expect(response).toEqual(mockResponse);
      expect(response.case.addedToKnowledgeBase).toBe(true);
    });

    it('should handle error when project is not completed first', async () => {
      const errorMessage = 'Project must be marked as completed first';

      projectsApi.completeProject.mockRejectedValue({
        response: { data: { error: errorMessage } }
      });

      const { result } = renderHook(() => useRiskMonitoringAndOutcome(mockProjectId));

      let response;
      await act(async () => {
        response = await result.current.submitOutcome({});
      });

      expect(response).toBeNull();
      expect(result.current.error).toContain('completed first');
    });
  });

  describe('prepareActualizedRisks', () => {
    it('should prepare actualized risks from current risks', () => {
      const currentRisks = [
        {
          type: 'communication_breakdown',
          severity: 'high',
          occurred: true,
          actualSeverity: 'high',
          actualImpact: {
            scheduleDelayDays: 3,
            budgetOverrunPercent: 5,
            description: 'Breakdown occurred'
          }
        },
        {
          type: 'skill_gap',
          severity: 'medium',
          occurred: false
        },
        {
          type: 'scope_creep',
          severity: 'low',
          occurred: null  // Not decided yet - should be filtered
        }
      ];

      const { result } = renderHook(() => useRiskMonitoringAndOutcome(mockProjectId));

      // Set risks state
      act(() => {
        result.current.risks = currentRisks;
      });

      const actualizedRisks = result.current.prepareActualizedRisks(currentRisks);

      expect(actualizedRisks).toHaveLength(2); // Only decided risks
      expect(actualizedRisks[0]).toMatchObject({
        type: 'communication_breakdown',
        occurred: true,
        severity: 'high',
        scheduleDelayDays: 3
      });
      expect(actualizedRisks[1]).toMatchObject({
        type: 'skill_gap',
        occurred: false
      });
    });
  });
});
