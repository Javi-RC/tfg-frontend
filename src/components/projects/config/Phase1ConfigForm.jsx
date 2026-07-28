import React, { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Activity } from 'lucide-react';

/**
 * Phase 1 Configuration Form
 * Controls weights for technical matching phase
 */
const getTotal = (cfg) =>
  (cfg.skillsWeight || 0) + (cfg.experienceWeight || 0) + (cfg.availabilityWeight || 0);

export default function Phase1ConfigForm({ config, onChange, errors = {} }) {
  const { t } = useTranslation();

  const handleChange = (field, value) => {
    const parsed = parseFloat(value) || 0;

    // Calculate the sum of other weights (excluding the current field)
    const otherWeightsSum = Object.keys(config)
      .filter(
        (key) =>
          ['skillsWeight', 'experienceWeight', 'availabilityWeight'].includes(key) && key !== field
      )
      .reduce((sum, key) => sum + (config[key] || 0), 0);

    // Maximum allowed for this field is what remains to reach 1.0 (100%)
    const maxAllowed = 1.0 - otherWeightsSum;

    // Clamp the value between 0 and maxAllowed
    const clamped = Math.max(0, Math.min(maxAllowed, parsed));

    onChange({
      ...config,
      [field]: clamped,
    });
  };

  const total = getTotal(config);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Activity size={20} color="#3B82F6" />
        <h3 style={styles.title}>{t('teamConfig.phase1.title')}</h3>
      </div>

      <p style={styles.description}>{t('teamConfig.phase1.description')}</p>

      <div
        style={{
          ...styles.totalBar,
          ...(Math.abs(total - 1.0) > 0.001 ? styles.totalBarError : styles.totalBarSuccess),
        }}
      >
        <span style={styles.totalLabel}>{t('teamConfig.totalWeight')}:</span>
        <span style={styles.totalValue}>{(total * 100).toFixed(1)}%</span>
        {Math.abs(total - 1.0) > 0.001 && (
          <span style={styles.totalError}>{t('teamConfig.mustEqual100')}</span>
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
  const sliderId = useId();
  return (
    <div style={styles.sliderContainer}>
      <div style={styles.sliderHeader}>
        <label htmlFor={sliderId} style={styles.label}>{label}</label>
        <span style={styles.valueDisplay}>{(value * 100).toFixed(0)}%</span>
      </div>

      <input
        id={sliderId}
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
    gap: '24px',
  },
  sliderContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  sliderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--color-text-strong)',
  },
  valueDisplay: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#3B82F6',
    padding: '2px 8px',
    backgroundColor: '#EFF6FF',
    borderRadius: '4px',
  },
  slider: {
    width: '100%',
    height: '6px',
    borderRadius: '3px',
    outline: 'none',
    backgroundColor: 'var(--color-border)',
    appearance: 'none',
    WebkitAppearance: 'none',
    cursor: 'pointer',
  },
  sliderLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: 'var(--color-text-muted)',
  },
  error: {
    fontSize: '13px',
    color: 'var(--color-danger-icon)',
    marginTop: '4px',
  },
  totalBar: {
    padding: '12px 16px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    border: '2px solid',
  },
  totalBarSuccess: {
    backgroundColor: 'var(--color-success-bg)',
    borderColor: 'var(--color-success)',
    color: 'var(--color-success-dark)',
  },
  totalBarError: {
    backgroundColor: 'var(--color-danger-bg)',
    borderColor: 'var(--color-danger-icon)',
    color: 'var(--color-danger-strong)',
  },
  totalLabel: {
    fontSize: '14px',
    fontWeight: '600',
  },
  totalValue: {
    fontSize: '16px',
    fontWeight: '700',
  },
  totalError: {
    fontSize: '13px',
    marginLeft: 'auto',
  },
};
