import React from 'react';
import { useTranslation } from 'react-i18next';
import { Activity } from 'lucide-react';

/**
 * Phase 1 Configuration Form
 * Controls weights for technical matching phase
 */
export default function Phase1ConfigForm({ config, onChange, errors = {} }) {
  const { t } = useTranslation();

  const clamp01 = (num) => Math.max(0, Math.min(1, num));

  const getTotal = (cfg) => (cfg.skillsWeight || 0) +
    (cfg.experienceWeight || 0) +
    (cfg.availabilityWeight || 0);

  const handleChange = (field, value) => {
    const parsed = parseFloat(value) || 0;
    
    // Calculate the sum of other weights (excluding the current field)
    const otherWeightsSum = Object.keys(config)
      .filter(key => ['skillsWeight', 'experienceWeight', 'availabilityWeight'].includes(key) && key !== field)
      .reduce((sum, key) => sum + (config[key] || 0), 0);
    
    // Maximum allowed for this field is what remains to reach 1.0 (100%)
    const maxAllowed = 1.0 - otherWeightsSum;
    
    // Clamp the value between 0 and maxAllowed
    const clamped = Math.max(0, Math.min(maxAllowed, parsed));

    onChange({
      ...config,
      [field]: clamped
    });
  };
  
  // Helper to calculate max allowed for each field
  const getMaxAllowed = (field) => {
    const otherWeightsSum = Object.keys(config)
      .filter(key => ['skillsWeight', 'experienceWeight', 'availabilityWeight'].includes(key) && key !== field)
      .reduce((sum, key) => sum + (config[key] || 0), 0);
    return 1.0 - otherWeightsSum;
  };

  const total = getTotal(config);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Activity size={20} color="#3B82F6" />
        <h3 style={styles.title}>{t('teamConfig.phase1.title')}</h3>
      </div>
      
      <p style={styles.description}>
        {t('teamConfig.phase1.description')}
      </p>

      <div style={{
        ...styles.totalBar,
        ...(Math.abs(total - 1.0) > 0.001 ? styles.totalBarError : styles.totalBarSuccess)
      }}>
        <span style={styles.totalLabel}>{t('teamConfig.totalWeight')}:</span>
        <span style={styles.totalValue}>{(total * 100).toFixed(1)}%</span>
        {Math.abs(total - 1.0) > 0.001 && (
          <span style={styles.totalError}>
            {t('teamConfig.mustEqual100')}
          </span>
        )}
      </div>

      <div style={styles.formGroup}>
        <WeightSlider
          label={t('teamConfig.phase1.skillsWeight')}
          value={config.skillsWeight || 0}
          onChange={(val) => handleChange('skillsWeight', val)}
          error={errors.skillsWeight}
        />
        
        <WeightSlider
          label={t('teamConfig.phase1.experienceWeight')}
          value={config.experienceWeight || 0}
          onChange={(val) => handleChange('experienceWeight', val)}
          error={errors.experienceWeight}
        />
        
        <WeightSlider
          label={t('teamConfig.phase1.availabilityWeight')}
          value={config.availabilityWeight || 0}
          onChange={(val) => handleChange('availabilityWeight', val)}
          error={errors.availabilityWeight}
        />
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
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
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
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151'
  },
  valueDisplay: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#3B82F6',
    padding: '2px 8px',
    backgroundColor: '#EFF6FF',
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
  }
};
