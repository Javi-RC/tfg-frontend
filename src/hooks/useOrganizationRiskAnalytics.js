import { useState, useEffect, useCallback } from 'react';
import {
  getOrganizationRiskInsights,
  getOrganizationRiskStats,
  getOrganizationRiskAccuracy,
  getCaseBaseStats,
  getOrganizationCases,
} from '../api/cbrAnalytics';
import i18n from '../i18n';

const unwrap = (response) => response?.data?.data ?? response?.data ?? null;

/**
 * Loads the organization-wide risk-learning data the backend derives from the
 * case base. Case-base sections are only fetched for admins, matching the
 * backend authorization.
 *
 * @param {string} organizationId
 * @param {boolean} isAdmin
 */
export function useOrganizationRiskAnalytics(organizationId, isAdmin) {
  const [insights, setInsights] = useState(null);
  const [stats, setStats] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [caseBaseStats, setCaseBaseStats] = useState(null);
  const [cases, setCases] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!organizationId) return;
    setLoading(true);
    setError(null);
    try {
      const memberCalls = [
        getOrganizationRiskInsights(organizationId),
        getOrganizationRiskStats(organizationId),
        getOrganizationRiskAccuracy(organizationId),
      ];
      const adminCalls = isAdmin
        ? [getCaseBaseStats(organizationId), getOrganizationCases(organizationId)]
        : [];

      const results = await Promise.all([...memberCalls, ...adminCalls]);
      setInsights(unwrap(results[0]));
      setStats(unwrap(results[1]));
      setAccuracy(unwrap(results[2]));
      if (isAdmin) {
        setCaseBaseStats(unwrap(results[3]));
        const casesData = unwrap(results[4]);
        setCases(casesData?.cases ?? casesData ?? []);
      }
    } catch (err) {
      setError(err.response?.data?.error || i18n.t('organizations.riskAnalytics.loadError'));
    } finally {
      setLoading(false);
    }
  }, [organizationId, isAdmin]);

  useEffect(() => {
    load();
  }, [load]);

  return { insights, stats, accuracy, caseBaseStats, cases, loading, error, reload: load };
}
