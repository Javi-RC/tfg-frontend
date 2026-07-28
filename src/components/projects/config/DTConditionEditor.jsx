import React, { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function CollapsibleSection({ title, children, isExpanded, onToggle, tier, icon: Icon }) {
  const { t } = useTranslation();
  return (
    <div style={styles.section}>
      <div
        style={styles.sectionHeader}
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        <div style={styles.sectionTitleRow}>
          {Icon && <Icon size={18} color="#10B981" />}
          <h4 style={styles.sectionTitle}>{title}</h4>
          {tier === 1 && <span style={styles.tierBadge}>{t('risk.dt.tier1')}</span>}
          {tier === 2 && <span style={styles.tierBadge2}>{t('risk.dt.tier2')}</span>}
        </div>
        {isExpanded ? (
          <ChevronUp size={20} color="#6B7280" />
        ) : (
          <ChevronDown size={20} color="#6B7280" />
        )}
      </div>
      {isExpanded && <div style={styles.sectionContent}>{children}</div>}
    </div>
  );
}

export function WeightSlider({ label, value, onChange, error, formatDisplay, hint }) {
  const sliderId = useId();
  const display = formatDisplay ? formatDisplay(value) : `${(value * 100).toFixed(0)}%`;

  return (
    <div style={styles.sliderContainer}>
      <div style={styles.sliderHeader}>
        <label htmlFor={sliderId} style={styles.label}>{label}</label>
        <span style={styles.valueDisplay}>{display}</span>
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

      {hint && <p style={styles.hint}>{hint}</p>}
      {error && <div style={styles.error}>{error}</div>}
    </div>
  );
}

export function NumberSlider({ label, value, onChange, error, min, max, step, formatDisplay, hint }) {
  const sliderId = useId();
  const display = formatDisplay ? formatDisplay(value) : value;

  return (
    <div style={styles.sliderContainer}>
      <div style={styles.sliderHeader}>
        <label htmlFor={sliderId} style={styles.label}>{label}</label>
        <span style={styles.valueDisplay}>{display}</span>
      </div>

      <input
        id={sliderId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={styles.slider}
      />

      <div style={styles.sliderLabels}>
        <span>{min}</span>
        <span>{max}</span>
      </div>

      {hint && <p style={styles.hint}>{hint}</p>}
      {error && <div style={styles.error}>{error}</div>}
    </div>
  );
}

function DTValidationMessages({ errors }) {
  if (!errors || Object.keys(errors).length === 0) return null;

  return (
    <div style={styles.validationSummary}>
      {Object.entries(errors).map(([field, message]) =>
        message ? (
          <div key={field} style={styles.validationItem}>
            {message}
          </div>
        ) : null,
      )}
    </div>
  );
}

const styles = {
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '16px',
    borderRadius: '8px',
    backgroundColor: '#FFFFFF',
    border: '1px solid var(--color-border)',
    transition: 'all 0.2s ease',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    userSelect: 'none',
  },
  sectionTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  sectionTitle: {
    margin: 0,
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--color-text-heading)',
  },
  tierBadge: {
    fontSize: '11px',
    fontWeight: '700',
    color: 'var(--color-warning-dark)',
    backgroundColor: '#FCD34D',
    padding: '2px 8px',
    borderRadius: '4px',
    letterSpacing: '0.5px',
  },
  tierBadge2: {
    fontSize: '11px',
    fontWeight: '700',
    color: 'var(--color-text-heading)',
    backgroundColor: 'var(--color-border-strong)',
    padding: '2px 8px',
    borderRadius: '4px',
    letterSpacing: '0.5px',
  },
  sectionContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid rgba(0,0,0,0.1)',
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
    color: 'var(--color-success)',
    padding: '2px 8px',
    backgroundColor: 'var(--color-success-bg)',
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
  hint: {
    margin: 0,
    fontSize: '12px',
    color: 'var(--color-text-muted)',
    fontStyle: 'italic',
    lineHeight: 1.4,
  },
  error: {
    fontSize: '13px',
    color: 'var(--color-danger-icon)',
    marginTop: '4px',
  },
  validationSummary: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  validationItem: {
    fontSize: '13px',
    color: 'var(--color-danger-icon)',
  },
};
