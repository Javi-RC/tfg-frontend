import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users } from 'lucide-react';

/**
 * Phase 2 Configuration Form
 * Controls synergy weights (backend: phase2.synergyWeights)
 */
export default function Phase2ConfigForm({ config, onChange, errors = {} }) {
  const { t } = useTranslation();

  const clampPercent = (num) => Math.max(0, Math.min(100, num));

  const enabled = config?.enabled ?? true;
  const synergyWeights = config?.synergyWeights || {};

  const getTotal = (weights) => (
    (weights.roleDiversityWeight || 0) +
    (weights.complementarityWeight || 0) +
    (weights.projectFitWeight || 0) +
    (weights.conflictRiskWeight || 0) +
    (weights.balanceWeight || 0)
  );

  const total = getTotal(synergyWeights);
  const isTotalOk = Math.abs(total - 100) <= 1;

  const handleEnabledChange = (checked) => {
    onChange({
      ...config,
      enabled: checked
    });
  };

  const handleWeightChange = (field, nextValue) => {
    const parsed = clampPercent(parseFloat(nextValue) || 0);
    const currentValue = clampPercent(synergyWeights[field] || 0);
    const currentTotal = getTotal(synergyWeights);

    // If increasing this field would push total above 100, clamp the increase.
    const delta = parsed - currentValue;
    let finalValue = parsed;
    if (delta > 0) {
      const remaining = Math.max(0, 100 - currentTotal);
      const allowed = Math.min(delta, remaining);
      finalValue = clampPercent(currentValue + allowed);
    }

    onChange({
      ...config,
      synergyWeights: {
        ...synergyWeights,
        [field]: finalValue
      }
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Users size={20} color="#8B5CF6" />
        <h3 style={styles.title}>{t('teamConfig.phase2.title')}</h3>
      </div>
      
      <p style={styles.description}>
        {t('teamConfig.phase2.description')}
      </p>

      <div style={styles.toggleRow}>
        <label style={styles.toggleLabel}>
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => handleEnabledChange(e.target.checked)}
            style={styles.checkbox}
          />
          <span>{t('teamConfig.phase2.enabledLabel')}</span>
        </label>
        <span style={styles.toggleHint}>{t('teamConfig.phase2.enabledHint')}</span>
      </div>

      <div style={{
        ...styles.totalBar,
        ...(!enabled ? styles.totalBarDisabled : (isTotalOk ? styles.totalBarSuccess : styles.totalBarError))
      }}>
        <span style={styles.totalLabel}>{t('teamConfig.totalWeight')}:</span>
        <span style={styles.totalValue}>{total.toFixed(1)}%</span>
        {enabled && !isTotalOk && (
          <span style={styles.totalError}>
            {t('teamConfig.mustEqual100')}
          </span>
        )}
      </div>

      <div style={{
        ...styles.formGroup,
        ...(enabled ? {} : styles.formGroupDisabled)
      }}>
        <WeightSlider
          label={t('teamConfig.phase2.roleDiversityWeight')}
          value={synergyWeights.roleDiversityWeight || 0}
          onChange={(val) => handleWeightChange('roleDiversityWeight', val)}
          error={errors.roleDiversityWeight}
          disabled={!enabled}
        />
        
        <WeightSlider
          label={t('teamConfig.phase2.complementarityWeight')}
          value={synergyWeights.complementarityWeight || 0}
          onChange={(val) => handleWeightChange('complementarityWeight', val)}
          error={errors.complementarityWeight}
          disabled={!enabled}
        />
        
        <WeightSlider
          label={t('teamConfig.phase2.projectFitWeight')}
          value={synergyWeights.projectFitWeight || 0}
          onChange={(val) => handleWeightChange('projectFitWeight', val)}
          error={errors.projectFitWeight}
          disabled={!enabled}
        />

        <WeightSlider
          label={t('teamConfig.phase2.conflictRiskWeight')}
          value={synergyWeights.conflictRiskWeight || 0}
          onChange={(val) => handleWeightChange('conflictRiskWeight', val)}
          error={errors.conflictRiskWeight}
          disabled={!enabled}
          inverted
        />

        <WeightSlider
          label={t('teamConfig.phase2.balanceWeight')}
          value={synergyWeights.balanceWeight || 0}
          onChange={(val) => handleWeightChange('balanceWeight', val)}
          error={errors.balanceWeight}
          disabled={!enabled}
        />
      </div>
    </div>
  );
}

function WeightSlider({ label, value, onChange, error, disabled = false, inverted = false }) {
  return (
    <div style={styles.sliderContainer}>
      <div style={styles.sliderHeader}>
        <label style={styles.label}>{label}</label>
        <span style={styles.valueDisplay}>{Math.round(value)}%</span>
      </div>
      
      <input
        type="range"
        min="0"
        max="100"
        step="1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={{
          ...styles.slider,
          ...(disabled ? styles.sliderDisabled : {}),
          ...(inverted ? styles.sliderInverted : {})
        }}
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
  formGroupDisabled: {
    opacity: 0.6
  },
  toggleRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    padding: '12px 14px',
    backgroundColor: '#F9FAFB',
    border: '1px solid #E5E7EB',
    borderRadius: '10px'
  },
  toggleLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#111827',
    cursor: 'pointer'
  },
  toggleHint: {
    fontSize: '13px',
    color: '#6B7280',
    lineHeight: 1.4,
    paddingLeft: '28px'
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer'
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
    color: '#8B5CF6',
    padding: '2px 8px',
    backgroundColor: '#F5F3FF',
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
  sliderDisabled: {
    cursor: 'not-allowed',
    opacity: 0.8
  },
  // purely visual hint (conflict risk is "inverted" meaning lower is better)
  sliderInverted: {
    filter: 'hue-rotate(200deg)'
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
  totalBarDisabled: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
    color: '#6B7280'
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
