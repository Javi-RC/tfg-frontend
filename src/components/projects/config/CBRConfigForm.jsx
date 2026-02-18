import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Database, Info, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { normalizeCBRConfig, CBR_PARAMETER_RANGES } from '../../../utils/cbrConfigDefaults';
import { getCandidatePoolSize, updateCandidatePoolSize } from '../../../api/projects';

const POOL_MULTIPLIER_MIN = 1;
const POOL_MULTIPLIER_MAX = 10;

/**
 * CBR Configuration Form
 * Controls Case-Based Reasoning parameters and candidate pool size
 * Backend structure: { dimensionWeights: {...}, kSimilarCases: number, minSimilarityThreshold: number }
 */
export default function CBRConfigForm({ config, onChange, errors = {}, projectId }) {
  const { t } = useTranslation();

  // Normalize config with defaults from centralized configuration
  const normalizedConfig = normalizeCBRConfig(config);
  const dimensionWeights = normalizedConfig.dimensionWeights;
  const kSimilarCases = normalizedConfig.kSimilarCases;
  const minSimilarityThreshold = normalizedConfig.minSimilarityThreshold;

  // Candidate pool state
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

  const effectiveTopN = poolData
    ? poolData.effectiveTopN
    : (poolData?.teamSize || 0) * localMultiplier;

  const hasMultiplierChanged = poolData && localMultiplier !== poolData.candidatePoolMultiplier;

  const handleDimensionWeightChange = (dimension, value) => {
    const parsed = parseFloat(value) || 0;
    
    // Calculate the sum of other weights (excluding the current dimension)
    const otherWeightsSum = Object.keys(dimensionWeights)
      .filter(key => key !== dimension)
      .reduce((sum, key) => sum + (dimensionWeights[key] || 0), 0);
    
    // Maximum allowed for this dimension is what remains to reach 1.0 (100%)
    const maxAllowed = 1.0 - otherWeightsSum;
    
    // Clamp the value between 0 and maxAllowed
    const clamped = Math.max(0, Math.min(maxAllowed, parsed));
    
    onChange({
      ...config,
      dimensionWeights: {
        ...dimensionWeights,
        [dimension]: clamped
      }
    });
  };

  const handleKChange = (value) => {
    const parsed = parseInt(value) || CBR_PARAMETER_RANGES.kSimilarCases.default;
    const range = CBR_PARAMETER_RANGES.kSimilarCases;
    const clamped = Math.max(range.min, Math.min(range.max, parsed));
    onChange({
      ...config,
      kSimilarCases: clamped
    });
  };

  const handleThresholdChange = (value) => {
    const parsed = parseFloat(value) || CBR_PARAMETER_RANGES.minSimilarityThreshold.default;
    const range = CBR_PARAMETER_RANGES.minSimilarityThreshold;
    const clamped = Math.max(range.min, Math.min(range.max, parsed));
    onChange({
      ...config,
      minSimilarityThreshold: clamped
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
      
      <p style={styles.description}>
        {t('teamConfig.cbr.description')}
      </p>

      <div style={{
        ...styles.totalBar,
        ...(isTotalOk ? styles.totalBarSuccess : styles.totalBarError)
      }}>
        <span style={styles.totalLabel}>{t('teamConfig.totalWeight')}:</span>
        <span style={styles.totalValue}>{(totalWeight * 100).toFixed(1)}%</span>
        {!isTotalOk && (
          <span style={styles.totalError}>
            {t('teamConfig.mustEqual100')}
          </span>
        )}
      </div>

      <div style={styles.formGroup}>
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>{t('teamConfig.cbr.dimensionWeights')}</h4>
          
          <WeightSlider
            label={t('teamConfig.cbr.coordination')}
            value={dimensionWeights.coordination || 0}
            onChange={(val) => handleDimensionWeightChange('coordination', val)}
            error={errors.coordination}
          />
          
          <WeightSlider
            label={t('teamConfig.cbr.technical')}
            value={dimensionWeights.technical || 0}
            onChange={(val) => handleDimensionWeightChange('technical', val)}
            error={errors.technical}
          />
          
          <WeightSlider
            label={t('teamConfig.cbr.team')}
            value={dimensionWeights.team || 0}
            onChange={(val) => handleDimensionWeightChange('team', val)}
            error={errors.team}
          />
          
          <WeightSlider
            label={t('teamConfig.cbr.management')}
            value={dimensionWeights.management || 0}
            onChange={(val) => handleDimensionWeightChange('management', val)}
            error={errors.management}
          />
          
          <WeightSlider
            label={t('teamConfig.cbr.organizational')}
            value={dimensionWeights.organizational || 0}
            onChange={(val) => handleDimensionWeightChange('organizational', val)}
            error={errors.organizational}
          />
        </div>

        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>{t('teamConfig.cbr.parameters')}</h4>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>{t('teamConfig.cbr.kSimilarCases')}</label>
            <input
              type="number"
              min={CBR_PARAMETER_RANGES.kSimilarCases.min}
              max={CBR_PARAMETER_RANGES.kSimilarCases.max}
              value={kSimilarCases}
              onChange={(e) => handleKChange(e.target.value)}
              style={styles.input}
            />
            <p style={styles.hint}>{t('teamConfig.cbr.kHint')}</p>
            {errors.kSimilarCases && <div style={styles.error}>{errors.kSimilarCases}</div>}
          </div>

          <WeightSlider
            label={t('teamConfig.cbr.minSimilarityThreshold')}
            value={minSimilarityThreshold}
            onChange={handleThresholdChange}
            error={errors.minSimilarityThreshold}
            min={0}
            max={1}
          />
        </div>
      </div>

      {/* Candidate Pool Size Section */}
      {projectId && (
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <Users size={18} color="#8B5CF6" />
            <h4 style={styles.sectionTitle}>{t('teamConfig.cbr.candidatePool.title')}</h4>
          </div>
          <p style={styles.hint}>{t('teamConfig.cbr.candidatePool.description')}</p>

          {poolLoading && !poolData && (
            <p style={styles.hint}>{t('teamConfig.cbr.candidatePool.loading')}</p>
          )}

          {poolError && (
            <div style={styles.poolMessage}>
              <AlertCircle size={16} color="#EF4444" />
              <span style={{ color: '#EF4444' }}>{poolError}</span>
            </div>
          )}

          {poolData && (
            <>
              <div style={styles.poolStats}>
                <div style={styles.poolStat}>
                  <span style={styles.poolStatLabel}>{t('teamConfig.cbr.candidatePool.teamSize')}</span>
                  <span style={styles.poolStatValue}>{poolData.teamSize}</span>
                </div>
                <div style={styles.poolStatMultiply}>×</div>
                <div style={styles.poolStat}>
                  <span style={styles.poolStatLabel}>{t('teamConfig.cbr.candidatePool.multiplierLabel')}</span>
                  <input
                    type="number"
                    min={POOL_MULTIPLIER_MIN}
                    max={POOL_MULTIPLIER_MAX}
                    value={localMultiplier}
                    onChange={(e) => handlePoolMultiplierChange(e.target.value)}
                    style={styles.poolMultiplierInput}
                    disabled={poolLoading}
                  />
                </div>
                <div style={styles.poolStatEquals}>=</div>
                <div style={styles.poolStat}>
                  <span style={styles.poolStatLabel}>{t('teamConfig.cbr.candidatePool.effectiveTopN')}</span>
                  <span style={styles.poolStatValueHighlight}>
                    {poolData.teamSize * localMultiplier}
                  </span>
                </div>
              </div>

              <div style={styles.poolSliderContainer}>
                <input
                  type="range"
                  min={POOL_MULTIPLIER_MIN}
                  max={POOL_MULTIPLIER_MAX}
                  step="1"
                  value={localMultiplier}
                  onChange={(e) => handlePoolMultiplierChange(e.target.value)}
                  style={styles.slider}
                  disabled={poolLoading}
                />
                <div style={styles.sliderLabels}>
                  <span>×{POOL_MULTIPLIER_MIN}</span>
                  <span>×{POOL_MULTIPLIER_MAX}</span>
                </div>
              </div>

              <p style={styles.poolEffectiveDescription}>
                {t('teamConfig.cbr.candidatePool.effectiveDescription', {
                  topN: poolData.teamSize * localMultiplier
                })}
              </p>

              <p style={styles.hint}>{t('teamConfig.cbr.candidatePool.multiplierHint')}</p>

              {hasMultiplierChanged && (
                <button
                  onClick={handlePoolMultiplierSave}
                  disabled={poolLoading}
                  style={styles.poolSaveButton}
                >
                  {poolLoading
                    ? t('teamConfig.saving')
                    : t('teamConfig.cbr.candidatePool.multiplierLabel')}
                </button>
              )}

              {poolMessage && (
                <div style={{
                  ...styles.poolMessage,
                  ...(poolMessage.type === 'success' ? styles.poolMessageSuccess : styles.poolMessageError)
                }}>
                  {poolMessage.type === 'success'
                    ? <CheckCircle size={16} />
                    : <AlertCircle size={16} />
                  }
                  <span>{poolMessage.text}</span>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <div style={styles.infoBox}>
        <Info size={18} color="#1E40AF" style={styles.infoIcon} />
        <span style={styles.infoText}>{t('teamConfig.cbr.info')}</span>
      </div>
    </div>
  );
}

function WeightSlider({ label, value, onChange, error }) {
  return (
    <div style={styles.sliderContainer}>
      <div style={styles.sliderHeader}>
        <label style={styles.label}>{label}</label>
        <span style={styles.valueDisplay}>{(value * 100).toFixed(0)}%</span>
      </div>
      
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={styles.slider}
      />
      
      <div style={styles.sliderLabels}>
        <span>0%</span>
        <span>100%</span>
      </div>
      
      {error && <div style={styles.error}>{error}</div>}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827'
  },
  description: {
    margin: 0,
    fontSize: '14px',
    color: '#6B7280',
    lineHeight: 1.5
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '16px',
    backgroundColor: '#F9FAFB',
    borderRadius: '8px',
    border: '1px solid #E5E7EB'
  },
  sectionTitle: {
    margin: 0,
    fontSize: '15px',
    fontWeight: '600',
    color: '#111827'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151'
  },
  input: {
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  hint: {
    margin: 0,
    fontSize: '13px',
    color: '#6B7280',
    fontStyle: 'italic'
  },
  sliderContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  sliderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  valueDisplay: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#F59E0B',
    padding: '2px 8px',
    backgroundColor: '#FEF3C7',
    borderRadius: '4px'
  },
  slider: {
    width: '100%',
    height: '6px',
    borderRadius: '3px',
    outline: 'none',
    backgroundColor: '#E5E7EB',
    appearance: 'none',
    WebkitAppearance: 'none',
    cursor: 'pointer'
  },
  sliderLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#9CA3AF'
  },
  error: {
    fontSize: '13px',
    color: '#EF4444',
    marginTop: '4px'
  },
  totalBar: {
    padding: '12px 16px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    border: '2px solid'
  },
  totalBarSuccess: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
    color: '#065F46'
  },
  totalBarError: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
    color: '#991B1B'
  },
  totalLabel: {
    fontSize: '14px',
    fontWeight: '600'
  },
  totalValue: {
    fontSize: '16px',
    fontWeight: '700'
  },
  totalError: {
    fontSize: '13px',
    marginLeft: 'auto'
  },
  infoBox: {
    display: 'flex',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: '#EFF6FF',
    border: '1px solid #BFDBFE',
    borderRadius: '8px'
  },
  infoIcon: {
    flex: '0 0 auto',
    marginTop: '2px'
  },
  infoText: {
    fontSize: '13px',
    color: '#1E40AF',
    lineHeight: 1.5
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  poolStats: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    border: '1px solid #E5E7EB',
    flexWrap: 'wrap'
  },
  poolStat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px'
  },
  poolStatLabel: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  poolStatValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827'
  },
  poolStatValueHighlight: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#8B5CF6'
  },
  poolStatMultiply: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#9CA3AF'
  },
  poolStatEquals: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#9CA3AF'
  },
  poolMultiplierInput: {
    width: '70px',
    padding: '8px 12px',
    fontSize: '20px',
    fontWeight: '700',
    textAlign: 'center',
    border: '2px solid #8B5CF6',
    borderRadius: '8px',
    outline: 'none',
    color: '#111827',
    backgroundColor: '#F5F3FF'
  },
  poolSliderContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  poolEffectiveDescription: {
    margin: 0,
    fontSize: '13px',
    color: '#4B5563',
    lineHeight: 1.5,
    padding: '8px 12px',
    backgroundColor: '#F5F3FF',
    borderRadius: '6px',
    border: '1px solid #DDD6FE'
  },
  poolSaveButton: {
    alignSelf: 'flex-end',
    padding: '8px 20px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#FFFFFF',
    backgroundColor: '#8B5CF6',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  poolMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500'
  },
  poolMessageSuccess: {
    backgroundColor: '#D1FAE5',
    color: '#065F46'
  },
  poolMessageError: {
    backgroundColor: '#FEE2E2',
    color: '#991B1B'
  }
};
