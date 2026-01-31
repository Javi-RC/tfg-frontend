import { useState, useEffect } from 'react';
import { getCVStats } from '../api/cv';

/**
 * Custom hook for CV Stats page business logic
 * Manages loading and displaying CV statistics
 */
export function useCVStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  /**
   * Load CV statistics from API
   */
  const loadStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getCVStats();
      const statsData = response.data?.stats || response.data;
      setStats(statsData);
    } catch (err) {
      setError(err.response?.data?.error || 'Error loading statistics');
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    stats,
    loading,
    error,
    
    // Actions
    loadStats
  };
}
