import { useState, useCallback } from 'react';
import { getProjectRisksFiltered, getOutcomeFormData } from '../api/riskService';
import { completeProject } from '../api/projects';
import { submitProjectOutcome } from '../api/manualRisks';
import { RISK_STATUS } from '../types/riskTypes';
import i18n from '../i18n';

/**
 * Custom hook for managing project risk monitoring and outcome submission
 * Handles the complete workflow: monitoring → marking risks → completion → outcome
 *
 * @param {string} projectId - Project ID
 * @returns {Object} Risk monitoring and outcome functions with state
 *
 * @example
 * const {
 *   risks,
 *   loading,
 *   markAsOccurred,
 *   submitOutcome,
 *   refreshRisks
 * } = useRiskMonitoringAndOutcome(projectId);
 */
export function useRiskMonitoringAndOutcome(projectId) {
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [outcomeFormData, setOutcomeFormData] = useState(null);

  /**
   * Load all risks for the project with optional filters
   * @param {Object} filters - Filter parameters
   * @param {string} filters.status - Filter by status
   * @param {boolean} filters.occurred - Filter by occurred status
   */
  const loadRisks = useCallback(
    async (filters = {}) => {
      try {
        setLoading(true);
        setError(null);
        const response = await getProjectRisksFiltered(projectId, filters);
        setRisks(response.data?.data?.risks || response.data?.risks || []);
      } catch (err) {
        setError(err.response?.data?.error || i18n.t('risks.monitoring.loadError'));
      } finally {
        setLoading(false);
      }
    },
    [projectId]
  );

  /**
   * Get predicted risks (for monitoring during project execution)
   * @deprecated - With new backend flow, use loadRisks() without filters
   * During ACTIVE project, all risks have status 'predicted'
   */
  const loadMonitoringRisks = useCallback(async () => {
    return loadRisks({
      status: RISK_STATUS.PREDICTED,
    });
  }, [loadRisks]);

  /**
   * Get risks that have occurred
   */
  const loadOccurredRisks = useCallback(async () => {
    return loadRisks({ occurred: true });
  }, [loadRisks]);

  /**
   * Load pre-filled outcome form data
   * @returns {Promise<Object>} Form data with predicted risks
   */
  const loadOutcomeForm = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getOutcomeFormData(projectId);
      const formData = response.data?.data || response.data;
      setOutcomeFormData(formData);
      return formData;
    } catch (err) {
      setError(err.response?.data?.error || i18n.t('risks.monitoring.loadOutcomeError'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  /**
   * Complete project and submit outcome (creates CBR case)
   * Executes both steps in correct order:
   * 1. Mark project as completed
   * 2. Submit outcome data
   *
   * @param {Object} outcomeData - Complete outcome data
   * @param {boolean} outcomeData.completed - Completion status
   * @param {string} outcomeData.actualCompletedDate - Completion date
   * @param {number} outcomeData.actualHours - Actual hours
   * @param {number} outcomeData.budgetOverrun - Budget overrun
   * @param {number} outcomeData.qualityScore - Quality score (0-1)
   * @param {number} outcomeData.clientSatisfaction - Satisfaction (1-5)
   * @param {number} outcomeData.teamMorale - Team morale (1-5)
   * @param {Array} outcomeData.actualizedRisks - All risks (occurred and not)
   * @param {Array} outcomeData.lessonsLearned - Lessons learned
   * @param {Array} outcomeData.successfulPractices - Successful practices
   * @param {Array} outcomeData.unsuccessfulPractices - Unsuccessful practices
   * @param {Array} outcomeData.recommendations - Recommendations
   * @param {Object} outcomeData.metrics - Additional metrics
   *
   * @returns {Promise<Object|null>} Response with CBR case info or null if error
   *
   * @example
   * const result = await submitOutcome({
   *   completed: true,
   *   actualCompletedDate: '2025-01-30',
   *   actualHours: 320,
   *   budgetOverrun: 2500,
   *   qualityScore: 0.82,
   *   clientSatisfaction: 4.5,
   *   teamMorale: 4.0,
   *   actualizedRisks: [
   *     { type: 'communication_breakdown', occurred: true, severity: 'high' },
   *     { type: 'skill_gap', occurred: false }
   *   ],
   *   lessonsLearned: ['Daily standups are crucial'],
   *   successfulPractices: ['Code reviews worked well'],
   *   unsuccessfulPractices: ['Slack-only communication'],
   *   recommendations: ['Use video standups'],
   *   metrics: { velocityAvg: 45 }
   * });
   *
   * if (result?.case?.addedToKnowledgeBase) {
   *   console.log('System learned from this project!');
   * }
   */
  const submitOutcome = useCallback(
    async (outcomeData) => {
      try {
        setLoading(true);
        setError(null);

        // Step 1: Mark project as completed
        await completeProject(projectId);

        // Step 2: Submit outcome (creates CBR case)
        const response = await submitProjectOutcome(projectId, outcomeData);
        const data = response.data?.data || response.data;

        return data;
      } catch (err) {
        const errorMsg = err.response?.data?.error || i18n.t('risks.monitoring.submitOutcomeError');
        setError(errorMsg);

        // Handle specific error cases
        if (errorMsg.includes('completed first')) {
          setError(i18n.t('risks.monitoring.projectNotCompleted'));
        }

        return null;
      } finally {
        setLoading(false);
      }
    },
    [projectId]
  );

  /**
   * Helper to create actualized risks array from current risks
   * Useful for pre-filling the outcome form
   *
   * @param {Array<Object>} currentRisks - Current project risks
   * @returns {Array<Object>} Actualized risks ready for outcome submission
   */
  const prepareActualizedRisks = useCallback(
    (currentRisks = risks) => {
      return currentRisks
        .map((risk) => ({
          type: risk.type,
          occurred: risk.occurred !== null ? risk.occurred : null,
          severity: risk.occurred ? risk.actualSeverity || risk.severity : undefined,
          scheduleDelayDays: risk.actualImpact?.scheduleDelayDays || 0,
          budgetOverrunPercent: risk.actualImpact?.budgetOverrunPercent || 0,
          description: risk.actualImpact?.description || risk.description,
        }))
        .filter((risk) => risk.occurred !== null); // Only include decided risks
    },
    [risks]
  );

  return {
    // State
    risks,
    loading,
    error,
    outcomeFormData,

    // Actions
    loadRisks,
    loadMonitoringRisks,
    loadOccurredRisks,
    loadOutcomeForm,
    submitOutcome,

    // Helpers
    prepareActualizedRisks,

    // Refresh
    refreshRisks: loadRisks,
  };
}
