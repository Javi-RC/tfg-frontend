import { useState, useCallback, useEffect } from 'react';
import {
  predictProjectRisks,
  getDTIndicators,
  getCBRRisks,
  acceptRisksForMonitoring
} from '../api/riskService';
import { useNotifications } from '../contexts/useNotifications';

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
          message: `Prediction complete: ${dt?.length || 0} expert-rule warnings, ${cbr?.length || 0} CBR risks`
        });
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Error running risk prediction';
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
          message: `${selectedRiskIds.length} risks accepted for monitoring`
        });

        // Clear selection after acceptance
        setSelectedRiskIds([]);

        return response.data;
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Error accepting risks';
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
