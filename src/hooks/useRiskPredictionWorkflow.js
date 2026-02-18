import { useState, useCallback } from 'react';
import {
  predictProjectRisks,
  acceptRisksForMonitoring
} from '../api/riskService';
import { useNotifications } from '../contexts/useNotifications';
import i18n from '../i18n';

/**
 * Hook for managing three-layer risk prediction workflow
 * Handles DT risks, CBR risks, and PM selection
 */
export function useRiskPredictionWorkflow(projectId) {
  // State for prediction
  const [dtRisks, setDtRisks] = useState([]);
  const [cbrRisks, setCbrRisks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [predictionComplete, setPredictionComplete] = useState(false);

  // State for CBR filtering
  const [minSimilarity, setMinSimilarity] = useState(0.5);
  const [filteredCbrRisks, setFilteredCbrRisks] = useState([]);

  // State for PM selection
  const [selectedRiskIds, setSelectedRiskIds] = useState([]);
  const [acceptanceLoading, setAcceptanceLoading] = useState(false);
  const [acceptanceError, setAcceptanceError] = useState(null);

  const { showNotification } = useNotifications();

  /**
   * Run full prediction (DT + CBR)
   */
  const runPrediction = useCallback(async () => {
    if (!projectId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await predictProjectRisks(projectId);

      if (response.data?.success) {
        const { dtRisks: dt, cbrRisks: cbr } = response.data;

        setDtRisks(dt || []);
        setCbrRisks(cbr || []);
        setFilteredCbrRisks((cbr || []).filter(r => r.probability >= minSimilarity));
        setPredictionComplete(true);

        showNotification({
          type: 'success',
          message: i18n.t('risks.workflow.predictionComplete', { warnings: dt?.length || 0, cbr: cbr?.length || 0 })
        });
      }
    } catch (err) {
      const message = err.response?.data?.message || i18n.t('risks.workflow.predictionError');
      setError(message);
      showNotification({ type: 'error', message });
    } finally {
      setLoading(false);
    }
  }, [projectId, minSimilarity, showNotification]);

  /**
   * Update similarity threshold and filter CBR risks
   */
  const updateSimilarityThreshold = useCallback((threshold) => {
    setMinSimilarity(threshold);
    setFilteredCbrRisks(
      cbrRisks.filter(r => r.probability >= threshold)
    );
  }, [cbrRisks]);

  /**
   * Toggle risk selection
   */
  const toggleRiskSelection = useCallback((riskId) => {
    setSelectedRiskIds(prev =>
      prev.includes(riskId)
        ? prev.filter(id => id !== riskId)
        : [...prev, riskId]
    );
  }, []);

  /**
   * Select all filtered CBR risks
   */
  const selectAllFilteredRisks = useCallback(() => {
    const allIds = filteredCbrRisks.map(r => r.id);
    setSelectedRiskIds(allIds);
  }, [filteredCbrRisks]);

  /**
   * Clear all selections
   */
  const clearSelection = useCallback(() => {
    setSelectedRiskIds([]);
  }, []);

  /**
   * Accept selected risks for monitoring
   */
  const acceptSelectedRisks = useCallback(async () => {
    if (!projectId || selectedRiskIds.length === 0) return;

    setAcceptanceLoading(true);
    setAcceptanceError(null);

    try {
      const response = await acceptRisksForMonitoring(projectId, selectedRiskIds);

      if (response.data?.success) {
        showNotification({
          type: 'success',
          message: i18n.t('risks.workflow.risksAccepted', { count: selectedRiskIds.length })
        });

        // Clear selection after acceptance
        setSelectedRiskIds([]);

        return response.data;
      }
    } catch (err) {
      const message = err.response?.data?.message || i18n.t('risks.workflow.acceptError');
      setAcceptanceError(message);
      showNotification({ type: 'error', message });
    } finally {
      setAcceptanceLoading(false);
    }
  }, [projectId, selectedRiskIds, showNotification]);

  return {
    // DT risks
    dtRisks,
    dtCount: dtRisks.length,

    // CBR risks
    cbrRisks,
    filteredCbrRisks,
    cbrCount: cbrRisks.length,
    cbrFilteredCount: filteredCbrRisks.length,

    // Similarity filter
    minSimilarity,
    updateSimilarityThreshold,

    // Selection
    selectedRiskIds,
    selectionCount: selectedRiskIds.length,
    toggleRiskSelection,
    selectAllFilteredRisks,
    clearSelection,

    // Prediction control
    runPrediction,
    loading,
    error,
    predictionComplete,

    // Acceptance
    acceptSelectedRisks,
    acceptanceLoading,
    acceptanceError
  };
}
