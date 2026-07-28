import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * FormField Component
 * Reusable input field with icon, label, and validation
 */
export default function FormField({
  id,
  type = 'text',
  label,
  value,
  onChange,
  onKeyDown,
  placeholder,
  icon: Icon,
  required = false,
  disabled = false,
  error = null,
  autoFocus = false,
  autoComplete,
  ariaDescribedBy,
}) {
  const { t } = useTranslation();
  return (
    <div style={styles.container}>
      {label && (
        <label htmlFor={id} style={styles.label}>
          {label}
          {required && (
            <span style={styles.required} aria-label={t('form.required')}>
              {' '}
              *
            </span>
          )}
        </label>
      )}
      <div style={styles.inputWrapper}>
        {Icon && (
          <div style={styles.iconWrapper}>
            <Icon size={18} color="#666" aria-hidden="true" />
          </div>
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          disabled={disabled}
          autoComplete={autoComplete}
          required={required}
          autoFocus={autoFocus}
          aria-required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={ariaDescribedBy}
          style={{
            ...styles.input,
            ...(Icon ? styles.inputWithIcon : {}),
            ...(disabled ? styles.inputDisabled : {}),
            ...(error ? { border: '2px solid var(--color-error)' } : {}),
          }}
          onFocus={(e) => {
            e.target.style.borderColor = error ? 'var(--color-error)' : 'var(--color-border-focus)';
            e.target.style.boxShadow = '0 0 0 3px rgba(17,17,17,0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(102,102,102,0.25)';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>
      {error && (
        <p style={{ color: 'var(--color-error)', fontSize: '13px', marginTop: '6px', marginBottom: 0 }} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--color-text-primary)',
  },
  required: {
    color: 'var(--color-error)',
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
  },
  iconWrapper: {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: '56px',
    borderRadius: '12px',
    border: '1px solid rgba(102,102,102,0.25)',
    padding: '0 16px',
    fontSize: '16px',
    outline: 'none',
    transition: 'all 0.15s',
    fontFamily: 'inherit',
    background: 'white',
    boxSizing: 'border-box',
  },
  inputWithIcon: {
    paddingLeft: '48px',
  },
  inputDisabled: {
    background: '#f5f5f5',
    cursor: 'not-allowed',
  },
};
