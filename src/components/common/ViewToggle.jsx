import React from 'react';

/**
 * ViewToggle Component
 * Toggle between different view modes
 */
export default function ViewToggle({
  options,
  activeView,
  onChange,
  ariaLabel = 'View toggle'
}) {
  return (
    <div style={styles.container} role="group" aria-label={ariaLabel}>
      {options.map((option) => {
        const Icon = option.icon;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            style={{
              ...styles.button,
              ...(activeView === option.value ? styles.buttonActive : {})
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
    background: '#F3F4F6',
    borderRadius: '8px'
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
    color: '#6B7280',
    transition: 'all 0.2s ease'
  },
  buttonActive: {
    background: 'white',
    color: '#2563EB',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  }
};
