import React from 'react';
import { useTranslation } from 'react-i18next';
import { Database, Info } from 'lucide-react';

/**
 * CBR Configuration Form
 * Controls Case-Based Reasoning parameters
 */
export default function CBRConfigForm({ config, onChange, errors = {} }) {
  const { t } = useTranslation();

  const handleChange = (field, value) => {
    onChange({
      ...config,
      [field]: field === 'k' ? parseInt(value) || 1 : parseFloat(value) || 0
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Database size={20} color="#F59E0B" />
        <h3 style={styles.title}>{t('teamConfig.cbr.title')}</h3>
      </div>
      
      <p style={styles.description}>
        {t('teamConfig.cbr.description')}
      </p>

      <div style={styles.formGroup}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>{t('teamConfig.cbr.k')}</label>
          <input
            type="number"
            min="1"
            max="10"
            value={config.k || 3}
            onChange={(e) => handleChange('k', e.target.value)}
            style={styles.input}
          />
          <p style={styles.hint}>{t('teamConfig.cbr.kHint')}</p>
          {errors.k && <div style={styles.error}>{errors.k}</div>}
        </div>

        <WeightSlider
          label={t('teamConfig.cbr.similarityThreshold')}
          value={config.similarityThreshold || 0}
          onChange={(val) => handleChange('similarityThreshold', val)}
          error={errors.similarityThreshold}
          min={0}
          max={1}
        />
        
        <WeightSlider
          label={t('teamConfig.cbr.successWeight')}
          value={config.successWeight || 0}
          onChange={(val) => handleChange('successWeight', val)}
          error={errors.successWeight}
          min={0}
          max={1}
        />
      </div>

      <div style={styles.infoBox}>
        <Info size={18} color="#1E40AF" style={styles.infoIcon} />
        <span style={styles.infoText}>{t('teamConfig.cbr.info')}</span>
      </div>
    </div>
  );
}

function WeightSlider({ label, value, onChange, error, min = 0, max = 1 }) {
  return (
    <div style={styles.sliderContainer}>
      <div style={styles.sliderHeader}>
        <label style={styles.label}>{label}</label>
        <span style={styles.valueDisplay}>{(value * 100).toFixed(0)}%</span>
      </div>
      
      <input
        type="range"
        min={min}
        max={max}
        step="0.05"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={styles.slider}
      />
      
      <div style={styles.sliderLabels}>
        <span>{(min * 100).toFixed(0)}%</span>
        <span>{(max * 100).toFixed(0)}%</span>
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
