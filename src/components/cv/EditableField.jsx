import React, { useId } from 'react';
import { useTranslation } from 'react-i18next';
import './EditableField.css';

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

  const requiredIndicator =
    required && editMode ? (
      <span className="editablefield-required" aria-label={t('form.required')}>
        *
      </span>
    ) : null;

  return (
    <div>
      <label
        className="editablefield-label"
        htmlFor={inputId}
      >
        {label}
        {requiredIndicator}
      </label>
      {hasError && (
        <div
          className="editablefield-error"
          id={errorId}
          role="alert"
          aria-live="polite"
        >
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
          className={`editablefield-input ${hasError ? 'editablefield-input--error' : ''}`}
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
        <p
          className="editablefield-value"
        >
          {value || '—'}
        </p>
      )}
    </div>
  );
}
