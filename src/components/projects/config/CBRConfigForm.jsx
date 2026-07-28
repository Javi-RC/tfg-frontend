import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Database, Info } from 'lucide-react';
import { normalizeCBRConfig, CBR_PARAMETER_RANGES } from '../../../utils/cbrConfigDefaults';
import { getCandidatePoolSize, updateCandidatePoolSize } from '../../../api/projects';
import CBRWeightConfig from './CBRWeightConfig';
import CBSimilaritySettings from './CBSimilaritySettings';
import CBRCaseEditor from './CBRCaseEditor';

const POOL_MULTIPLIER_MIN = 1;
const POOL_MULTIPLIER_MAX = 10;

/**
 * CBR Configuration Form
 * Controls Case-Based Reasoning parameters and candidate pool size
 * Backend structure: { dimensionWeights: {...}, kSimilarCases: number, minSimilarityThreshold: number }
 */
const EMPTY_ERRORS = {};

export default function CBRConfigForm({ config, onChange, errors = EMPTY_ERRORS, projectId }) {
  const { t } = useTranslation();

  const normalizedConfig = normalizeCBRConfig(config);
  const dimensionWeights = normalizedConfig.dimensionWeights;
  const kSimilarCases = normalizedConfig.kSimilarCases;
  const minSimilarityThreshold = normalizedConfig.minSimilarityThreshold;

  const [poolData, setPoolData] = useState(null);
  const [poolLoading, setPoolLoading] = useState(false);
  const [poolError, setPoolError] = useState(null);
  const [poolMessage, setPoolMessage] = useState(null);
  const [localMultiplier, setLocalMultiplier] = useState(2);

  const loadPoolData = useCallback(async () => {
    if (!projectId) return;
    try {
      setPoolLoading(true);
      setPoolError(null);
      const response = await getCandidatePoolSize(projectId);
      const data = response.data?.data || response.data;
      setPoolData(data);
      setLocalMultiplier(data.candidatePoolMultiplier || 2);
    } catch (err) {
      console.error('Error loading candidate pool size:', err);
      setPoolError(t('teamConfig.cbr.candidatePool.error'));
    } finally {
      setPoolLoading(false);
    }
  }, [projectId, t]);

  useEffect(() => {
    loadPoolData();
  }, [loadPoolData]);

  const handlePoolMultiplierChange = (value) => {
    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) return;
    const clamped = Math.max(POOL_MULTIPLIER_MIN, Math.min(POOL_MULTIPLIER_MAX, parsed));
    setLocalMultiplier(clamped);
    setPoolMessage(null);
  };

  const handlePoolMultiplierSave = async () => {
    if (!projectId) return;
    try {
      setPoolLoading(true);
      setPoolMessage(null);
      const response = await updateCandidatePoolSize(projectId, localMultiplier);
      const data = response.data?.data || response.data;
      setPoolData(data);
      setPoolMessage({ type: 'success', text: t('teamConfig.cbr.candidatePool.saveSuccess') });
    } catch (err) {
      console.error('Error updating candidate pool multiplier:', err);
      setPoolMessage({ type: 'error', text: t('teamConfig.cbr.candidatePool.saveError') });
    } finally {
      setPoolLoading(false);
    }
  };

  const handleDimensionWeightChange = (dimension, value) => {
    const parsed = parseFloat(value) || 0;

    const otherWeightsSum = Object.keys(dimensionWeights)
      .filter((key) => key !== dimension)
      .reduce((sum, key) => sum + (dimensionWeights[key] || 0), 0);

    const maxAllowed = 1.0 - otherWeightsSum;
    const clamped = Math.max(0, Math.min(maxAllowed, parsed));

    onChange({
      ...config,
      dimensionWeights: {
        ...dimensionWeights,
        [dimension]: clamped,
      },
    });
  };

  const handleKChange = (value) => {
    const parsed = parseInt(value) || CBR_PARAMETER_RANGES.kSimilarCases.default;
    const range = CBR_PARAMETER_RANGES.kSimilarCases;
    const clamped = Math.max(range.min, Math.min(range.max, parsed));
    onChange({
      ...config,
      kSimilarCases: clamped,
    });
  };

  const handleThresholdChange = (value) => {
    const parsed = parseFloat(value) || CBR_PARAMETER_RANGES.minSimilarityThreshold.default;
    const range = CBR_PARAMETER_RANGES.minSimilarityThreshold;
    const clamped = Math.max(range.min, Math.min(range.max, parsed));
    onChange({
      ...config,
      minSimilarityThreshold: clamped,
    });
  };

  const getTotalWeight = () => {
    return Object.values(dimensionWeights).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
  };

  const totalWeight = getTotalWeight();
  const isTotalOk = Math.abs(totalWeight - 1.0) <= 0.001;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Database size={20} color="#F59E0B" />
        <h3 style={styles.title}>{t('teamConfig.cbr.title')}</h3>
      </div>

      <p style={styles.description}>{t('teamConfig.cbr.description')}</p>

      <div style={styles.formGroup}>
        <CBRWeightConfig
          dimensionWeights={dimensionWeights}
          errors={errors}
          onDimensionWeightChange={handleDimensionWeightChange}
          totalWeight={totalWeight}
          isTotalOk={isTotalOk}
        />

        <CBSimilaritySettings
          kSimilarCases={kSimilarCases}
          minSimilarityThreshold={minSimilarityThreshold}
          errors={errors}
          onKChange={handleKChange}
          onThresholdChange={handleThresholdChange}
        />
      </div>

      <CBRCaseEditor
        projectId={projectId}
        poolData={poolData}
        poolLoading={poolLoading}
        poolError={poolError}
        poolMessage={poolMessage}
        localMultiplier={localMultiplier}
        onMultiplierChange={handlePoolMultiplierChange}
        onSave={handlePoolMultiplierSave}
      />

      <div style={styles.infoBox}>
        <Info size={18} color="#1E40AF" style={styles.infoIcon} />
        <span style={styles.infoText}>{t('teamConfig.cbr.info')}</span>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--color-text-heading)',
  },
  description: {
    margin: 0,
    fontSize: '14px',
    color: 'var(--color-text-muted)',
    lineHeight: 1.5,
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  infoBox: {
    display: 'flex',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: '#EFF6FF',
    border: '1px solid #BFDBFE',
    borderRadius: '8px',
  },
  infoIcon: {
    flex: '0 0 auto',
    marginTop: '2px',
  },
  infoText: {
    fontSize: '13px',
    color: '#1E40AF',
    lineHeight: 1.5,
  },
};
