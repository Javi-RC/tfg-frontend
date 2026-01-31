import { useState, useCallback } from 'react';
import {
  addManualRisk,
  getAllProjectRisks,
  updateManualRisk,
  deleteManualRisk
} from '../api/manualRisks';
import { predictProjectRisks } from '../api/projects';

/**
 * Custom hook for manual risk management
 * Handles CRUD operations for manual risks in projects
 */
export function useManualRisks(projectId) {

  const [manualRisks, setManualRisks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Load all risks for the project (predicted + manual)
   */
  const loadManualRisks = useCallback(async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Loading risks for project:', projectId);
      const response = await getAllProjectRisks(projectId);
      console.log('📦 Response:', response);
      console.log('📊 Response.data:', response.data);
      
      // ✅ CORRECTO: Acceso a la estructura anidada response.data.data.risks
      const risksData = response.data?.data?.risks || [];
      console.log('✅ Risks loaded:', risksData.length, 'risks');
      
      if (risksData.length > 0) {
        console.log('📝 First risk:', risksData[0]);
      }
      
      setManualRisks(Array.isArray(risksData) ? risksData : []);
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to load risks';
      console.error('❌ Error loading risks:', err);
      console.error('❌ Error response:', err.response?.data);
      setError(errorMessage);
      setManualRisks([]);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  /**
   * Add a new manual risk
   */
  const addRisk = useCallback(async (riskData) => {
    if (!projectId) {
      setError('Project ID is required');
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await addManualRisk(projectId, riskData);
      const data = response.data?.data || response.data;

      const newRisk = data;
      setManualRisks(prev => [...prev, newRisk]);

      return newRisk;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to add manual risk';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  /**
   * Update an existing manual risk
   */
  const updateRisk = useCallback(async (riskId, updateData) => {
    if (!projectId) {
      setError('Project ID is required');
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await updateManualRisk(projectId, riskId, updateData);
      const updatedRisk = response.data?.data || response.data;

      setManualRisks(prev =>
        prev.map(risk => risk._id === riskId ? updatedRisk : risk)
      );

      return updatedRisk;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to update manual risk';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  /**
   * Delete a manual risk
   */
  const deleteRisk = useCallback(async (riskId) => {
    if (!projectId) {
      setError('Project ID is required');
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      await deleteManualRisk(projectId, riskId);

      setManualRisks(prev => prev.filter(risk => risk._id !== riskId));

      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to delete manual risk';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  /**
   * Re-predict project risks and reload
   * Triggers a new risk analysis and fetches updated risks
   */
  const repredictRisks = useCallback(async () => {
    if (!projectId) {
      setError('Project ID is required');
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Re-predicting risks for project:', projectId);
      
      // Trigger risk prediction
      await predictProjectRisks(projectId);
      console.log('✅ Risk prediction completed');
      
      // Reload all risks
      await loadManualRisks();
      
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to re-predict risks';
      console.error('❌ Error re-predicting risks:', err);
      console.error('❌ Error response:', err.response?.data);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [projectId, loadManualRisks]);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    manualRisks,
    loading,
    error,
    loadManualRisks,
    addRisk,
    updateRisk,
    deleteRisk,
    repredictRisks,
    clearError
  };
}
