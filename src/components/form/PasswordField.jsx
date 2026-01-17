import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Lock, Eye, EyeOff } from 'lucide-react';

/**
 * PasswordField Component
 * Password input with show/hide toggle
 */
export default function PasswordField({
  id,
  label,
  value,
  onChange,
  onKeyPress,
  placeholder = '••••••••',
  required = false,
  disabled = false,
  error = null,
  ariaDescribedBy,
  showIcon = true,
  controlled = false,
  showPasswordProp,
  onTogglePassword
}) {
  const { t } = useTranslation();
  const [internalShowPassword, setInternalShowPassword] = useState(false);
  
  const showPassword = controlled ? showPasswordProp : internalShowPassword;
  const togglePassword = controlled ? onTogglePassword : () => setInternalShowPassword(!internalShowPassword);

  return (
    <div style={styles.container}>
      {label && (
        <label htmlFor={id} style={styles.label}>
          {label}
          {required && <span style={styles.required} aria-label={t('form.required')}> *</span>}
        </label>
      )}
      <div style={styles.inputWrapper}>
        {showIcon && (
          <div style={styles.iconWrapper}>
            <Lock size={18} color="#666" aria-hidden="true" />
          </div>
        )}
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyPress={onKeyPress}
          disabled={disabled}
          autoComplete="current-password"
          required={required}
          aria-required={required}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={ariaDescribedBy}
          style={{
            ...styles.input,
            ...(showIcon ? styles.inputWithIcons : styles.inputWithToggleOnly),
            ...(disabled ? styles.inputDisabled : {})
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#111';
            e.target.style.boxShadow = '0 0 0 3px rgba(17,17,17,0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(102,102,102,0.25)';
            e.target.style.boxShadow = 'none';
          }}
        />
        <button
          type="button"
          onClick={togglePassword}
          disabled={disabled}
          aria-label={showPassword ? t('form.aria.hidePassword') : t('form.aria.showPassword')}
          style={{
            ...styles.toggleButton,
            ...(disabled ? styles.toggleButtonDisabled : {})
          }}
        >
          {showPassword ? (
            <EyeOff size={20} color="#1a1a1a" aria-hidden="true" />
          ) : (
            <Eye size={20} color="#1a1a1a" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#1a1a1a'
  },
  required: {
    color: '#c0392b'
  },
  inputWrapper: {
    position: 'relative',
    width: '100%'
  },
  iconWrapper: {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center'
  },
  input: {
    width: '100%',
    height: '56px',
    borderRadius: '12px',
    border: '1px solid rgba(102,102,102,0.25)',
    fontSize: '16px',
    outline: 'none',
    transition: 'all 0.15s',
    fontFamily: 'inherit',
    background: 'white',
    boxSizing: 'border-box'
  },
  inputWithIcons: {
    padding: '0 48px'
  },
  inputWithToggleOnly: {
    padding: '0 48px 0 16px'
  },
  inputDisabled: {
    background: '#f5f5f5',
    cursor: 'not-allowed'
  },
  toggleButton: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  toggleButtonDisabled: {
    cursor: 'not-allowed',
    opacity: 0.5
  }
};
