import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * ViewToggle Component
 * Toggle between different view modes
 */
export default function ViewToggle({ options, activeView, onChange, ariaLabel }) {
  const { t } = useTranslation();
  const displayAriaLabel = ariaLabel ?? t('common.viewToggle');
  return (
    <div style={styles.container} role="group" aria-label={displayAriaLabel}>
      {options.map((option) => {
        const Icon = option.icon;
        return (
          <button
            type="button"
            key={option.value}
            onClick={() => onChange(option.value)}
            style={{
              ...styles.button,
              ...(activeView === option.value ? styles.buttonActive : {}),
            }}
            aria-pressed={activeView === option.value}
          >
            {Icon && <Icon size={18} />}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    gap: '8px',
    padding: '4px',
    background: 'var(--color-bg-subtle)',
    borderRadius: '8px',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    border: 'none',
    background: 'transparent',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--color-text-muted)',
    transition: 'all 0.2s ease',
  },
  buttonActive: {
    background: 'white',
    color: 'var(--color-primary)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
};
