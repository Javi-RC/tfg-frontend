import React from 'react';
import { useTranslation } from 'react-i18next';
import { GitBranch, Lightbulb } from 'lucide-react';

/**
 * Decision Tree Configuration Form
 * Controls Decision Tree parameters
 */
export default function DecisionTreeConfigForm({ config, onChange, errors = {} }) {
  const { t } = useTranslation();

  const handleChange = (field, value) => {
    onChange({
      ...config,
      [field]: parseFloat(value) || 0
    });
  };

  const handleCheckbox = (field, checked) => {
    onChange({
      ...config,
      [field]: checked
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <GitBranch size={20} color="#10B981" />
        <h3 style={styles.title}>{t('teamConfig.decisionTree.title')}</h3>
      </div>
      
      <p style={styles.description}>
        {t('teamConfig.decisionTree.description')}
      </p>

      <div style={styles.formGroup}>
        <WeightSlider
          label={t('teamConfig.decisionTree.minConfidence')}
          value={config.minConfidence || 0}
          onChange={(val) => handleChange('minConfidence', val)}
          error={errors.minConfidence}
        />
        
        <WeightSlider
          label={t('teamConfig.decisionTree.maxDepth')}
          value={(config.maxDepth || 5) / 20}
          onChange={(val) => handleChange('maxDepth', Math.round(parseFloat(val) * 20))}
          error={errors.maxDepth}
          formatDisplay={(val) => `${Math.round(val * 20)} levels`}
        />

        <div style={styles.checkboxGroup}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={config.useExpertRules ?? true}
              onChange={(e) => handleCheckbox('useExpertRules', e.target.checked)}
              style={styles.checkbox}
            />
            <span>{t('teamConfig.decisionTree.useExpertRules')}</span>
          </label>
          <p style={styles.hint}>{t('teamConfig.decisionTree.expertRulesHint')}</p>
        </div>

        <div style={styles.checkboxGroup}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={config.considerRiskFactors ?? true}
              onChange={(e) => handleCheckbox('considerRiskFactors', e.target.checked)}
              style={styles.checkbox}
            />
            <span>{t('teamConfig.decisionTree.considerRiskFactors')}</span>
          </label>
          <p style={styles.hint}>{t('teamConfig.decisionTree.riskFactorsHint')}</p>
        </div>
      </div>

      <div style={styles.infoBox}>
        <Lightbulb size={18} color="#065F46" style={styles.infoIcon} />
        <span style={styles.infoText}>{t('teamConfig.decisionTree.info')}</span>
      </div>
    </div>
  );
}

function WeightSlider({ label, value, onChange, error, formatDisplay }) {
  const display = formatDisplay ? formatDisplay(value) : `${(value * 100).toFixed(0)}%`;
  
  return (
    <div style={styles.sliderContainer}>
      <div style={styles.sliderHeader}>
        <label style={styles.label}>{label}</label>
        <span style={styles.valueDisplay}>{display}</span>
      </div>
      
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
    color: '#10B981',
    padding: '2px 8px',
    backgroundColor: '#D1FAE5',
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
  checkboxGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    cursor: 'pointer'
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer'
  },
  hint: {
    margin: 0,
    fontSize: '13px',
    color: '#6B7280',
    fontStyle: 'italic',
    paddingLeft: '26px'
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
    backgroundColor: '#ECFDF5',
    border: '1px solid #A7F3D0',
    borderRadius: '8px'
  },
  infoIcon: {
    flex: '0 0 auto',
    marginTop: '2px'
  },
  infoText: {
    fontSize: '13px',
    color: '#065F46',
    lineHeight: 1.5
  }
};
