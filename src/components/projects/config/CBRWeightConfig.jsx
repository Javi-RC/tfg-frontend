import React, { useId } from 'react';
import { useTranslation } from 'react-i18next';

export default function CBRWeightConfig({
  dimensionWeights,
  errors,
  onDimensionWeightChange,
  totalWeight,
  isTotalOk,
}) {
  const { t } = useTranslation();

  const dimensions = [
    { key: 'coordination', label: t('teamConfig.cbr.coordination') },
    { key: 'technical', label: t('teamConfig.cbr.technical') },
    { key: 'team', label: t('teamConfig.cbr.team') },
    { key: 'management', label: t('teamConfig.cbr.management') },
    { key: 'organizational', label: t('teamConfig.cbr.organizational') },
  ];

  return (
    <>
      <div
        style={{
          ...styles.totalBar,
          ...(isTotalOk ? styles.totalBarSuccess : styles.totalBarError),
        }}
      >
        <span style={styles.totalLabel}>{t('teamConfig.totalWeight')}:</span>
        <span style={styles.totalValue}>{(totalWeight * 100).toFixed(1)}%</span>
        {!isTotalOk && <span style={styles.totalError}>{t('teamConfig.mustEqual100')}</span>}
      </div>

      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>{t('teamConfig.cbr.dimensionWeights')}</h4>

        {dimensions.map(({ key, label }) => (
          <WeightSlider
            key={key}
            label={label}
            value={dimensionWeights[key] || 0}
            onChange={(val) => onDimensionWeightChange(key, val)}
            error={errors[key]}
          />
        ))}
      </div>
    </>
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
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '16px',
    backgroundColor: 'var(--color-bg-muted)',
    borderRadius: '8px',
    border: '1px solid var(--color-border)',
  },
  sectionTitle: {
    margin: 0,
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--color-text-heading)',
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
    color: 'var(--color-warning)',
    padding: '2px 8px',
    backgroundColor: 'var(--color-warning-bg)',
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
};
