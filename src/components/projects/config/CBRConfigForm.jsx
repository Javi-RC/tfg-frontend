import React from 'react';
import { useTranslation } from 'react-i18next';
import { Database, Info } from 'lucide-react';
import { getDefaultCBRConfig, normalizeCBRConfig, CBR_PARAMETER_RANGES } from '../../../utils/cbrConfigDefaults';

/**
 * CBR Configuration Form
 * Controls Case-Based Reasoning parameters
 * Backend structure: { dimensionWeights: {...}, kSimilarCases: number, minSimilarityThreshold: number }
 */
export default function CBRConfigForm({ config, onChange, errors = {} }) {
  const { t } = useTranslation();

  // Normalize config with defaults from centralized configuration
  const normalizedConfig = normalizeCBRConfig(config);
  const dimensionWeights = normalizedConfig.dimensionWeights;
  const kSimilarCases = normalizedConfig.kSimilarCases;
  const minSimilarityThreshold = normalizedConfig.minSimilarityThreshold;

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
  
  // Helper to calculate max allowed for each dimension
  const getMaxAllowed = (dimension) => {
    const otherWeightsSum = Object.keys(dimensionWeights)
      .filter(key => key !== dimension)
      .reduce((sum, key) => sum + (dimensionWeights[key] || 0), 0);
    return 1.0 - otherWeightsSum;
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
  }
};
