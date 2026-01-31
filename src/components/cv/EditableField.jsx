import React, { useId } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * EditableField Component
 * Simplified editable field for forms with professional styling
 */
export default function EditableField({ label, value, editMode, onChange, required = false }) {
  const { t } = useTranslation();
  const inputId = useId();
  const isEmpty = !value || (typeof value === 'string' && value.trim() === '');
  const hasError = required && editMode && isEmpty;
  const errorId = hasError ? `${inputId}-error` : undefined;

  const requiredIndicator = required && editMode ? (
    <span style={{ color: '#e53e3e', marginLeft: '4px' }} aria-label={t('form.required')}>*</span>
  ) : null;

  return (
    <div>
      <label style={{
        display: 'block',
        fontSize: '12px',
        fontWeight: '600',
        color: '#4a5568',
        marginBottom: '8px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }} htmlFor={inputId}>
        {label}{requiredIndicator}
      </label>
      {hasError && (
        <div style={{
          fontSize: '12px',
          color: '#e53e3e',
          marginBottom: '6px',
          fontWeight: '500'
        }} id={errorId} role="alert" aria-live="polite">
          {t('form.requiredField')}
        </div>
      )}
      {editMode ? (
        <input
          type="text"
          id={inputId}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={hasError}
          aria-describedby={errorId}
          style={{
            width: '100%',
            padding: '12px 14px',
            border: hasError ? '2px solid #fc8181' : '2px solid #e2e8f0',
            borderRadius: '6px',
            fontSize: '15px',
            outline: 'none',
            transition: 'all 0.2s',
            color: '#2d3748',
            boxSizing: 'border-box',
            backgroundColor: hasError ? '#fff5f5' : 'white'
          }}
          onFocus={(e) => { 
            e.target.style.borderColor = '#4299e1'; 
            e.target.style.boxShadow = '0 0 0 3px rgba(66,153,225,0.1)'; 
          }}
          onBlur={(e) => { 
            e.target.style.borderColor = '#e2e8f0'; 
            e.target.style.boxShadow = 'none'; 
          }}
        />
      ) : (
        <p style={{
          fontSize: '15px',
          color: '#2d3748',
          fontWeight: '500',
          lineHeight: '1.6'
        }}>
          {value || '—'}
        </p>
      )}
    </div>
  );
}
