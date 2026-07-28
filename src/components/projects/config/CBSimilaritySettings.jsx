import React, { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { CBR_PARAMETER_RANGES } from '../../../utils/cbrConfigDefaults';

export default function CBSimilaritySettings({
  kSimilarCases,
  minSimilarityThreshold,
  errors,
  onKChange,
  onThresholdChange,
}) {
  const { t } = useTranslation();
  const sliderId = useId();

  return (
    <div style={styles.section}>
      <h4 style={styles.sectionTitle}>{t('teamConfig.cbr.parameters')}</h4>

      <div style={styles.inputGroup}>
        <label htmlFor="cbr-kSimilarCases" style={styles.label}>{t('teamConfig.cbr.kSimilarCases')}</label>
        <input
          id="cbr-kSimilarCases"
          type="number"
          min={CBR_PARAMETER_RANGES.kSimilarCases.min}
          max={CBR_PARAMETER_RANGES.kSimilarCases.max}
          value={kSimilarCases}
          onChange={(e) => onKChange(e.target.value)}
          style={styles.input}
        />
        <p style={styles.hint}>{t('teamConfig.cbr.kHint')}</p>
        {errors.kSimilarCases && <div style={styles.error}>{errors.kSimilarCases}</div>}
      </div>

      <div style={styles.sliderContainer}>
        <div style={styles.sliderHeader}>
          <label htmlFor={sliderId} style={styles.label}>{t('teamConfig.cbr.minSimilarityThreshold')}</label>
          <span style={styles.valueDisplay}>{(minSimilarityThreshold * 100).toFixed(0)}%</span>
        </div>

        <input
          id={sliderId}
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={minSimilarityThreshold}
          onChange={(e) => onThresholdChange(parseFloat(e.target.value))}
          style={styles.slider}
        />

        <div style={styles.sliderLabels}>
          <span>0%</span>
          <span>100%</span>
        </div>

        {errors.minSimilarityThreshold && <div style={styles.error}>{errors.minSimilarityThreshold}</div>}
      </div>
    </div>
  );
}

const styles = {
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
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--color-text-strong)',
  },
  input: {
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid var(--color-border-strong)',
    borderRadius: '6px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  hint: {
    margin: 0,
    fontSize: '13px',
    color: 'var(--color-text-muted)',
    fontStyle: 'italic',
  },
  error: {
    fontSize: '13px',
    color: 'var(--color-danger-icon)',
    marginTop: '4px',
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
};
