import { useState, useCallback } from 'react';
import {
  getCBRRisks,
  getDTIndicators,
  findSimilarCases,
  acceptRisks as acceptRisksApi,
} from '../api/riskService';
import i18n from '../i18n';

const unwrap = (response) => response?.data?.data ?? response?.data ?? null;

/**
 * Loads the CBR/expert-rule analysis the backend derives for a single project:
 * similar historical cases, CBR-inferred risks and decision-tree indicators.
 * Also exposes the "accept risks" project-manager action.
 *
 * @param {string} projectId
 */
export function useProjectCBR(projectId) {
  const [similarCases, setSimilarCases] = useState(null);
  const [cbrRisks, setCbrRisks] = useState(null);
  const [indicators, setIndicators] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const [casesRes, cbrRes, indRes] = await Promise.all([
        findSimilarCases(projectId),
        getCBRRisks(projectId),
        getDTIndicators(projectId),
      ]);
      const casesData = unwrap(casesRes);
      const cbrData = unwrap(cbrRes);
      const indData = unwrap(indRes);
      setSimilarCases(casesData?.cases ?? casesData ?? []);
      setCbrRisks(cbrData?.risks ?? cbrData ?? []);
      setIndicators(indData?.indicators ?? indData ?? []);
    } catch (err) {
      setError(err.response?.data?.error || i18n.t('risks.cbr.loadError'));
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const acceptRisks = useCallback(
    async (riskIds) => {
      try {
        setError(null);
        await acceptRisksApi(projectId, riskIds);
        await load();
        return true;
      } catch (err) {
        setError(err.response?.data?.error || i18n.t('risks.cbr.acceptError'));
        return false;
      }
    },
    [projectId, load]
  );

  return { similarCases, cbrRisks, indicators, loading, error, load, acceptRisks };
}
