import React, { useId } from 'react';
import { useTranslation } from 'react-i18next';
import './EditableTextarea.css';

/**
 * EditableTextarea Component
 * Multiline text field with professional styling
 */
export default function EditableTextarea({ label, value, editMode, onChange, required = false }) {
  const { t } = useTranslation();
  const inputId = useId();
  const isEmpty = !value || (typeof value === 'string' && value.trim() === '');
  const hasError = required && editMode && isEmpty;
  const errorId = hasError ? `${inputId}-error` : undefined;

  const requiredIndicator =
    required && editMode ? (
      <span className="editabletextarea-required" aria-label={t('form.required')}>
        *
      </span>
    ) : null;

  return (
    <div>
      <label
        className="editabletextarea-label"
        htmlFor={inputId}
      >
        {label}
        {requiredIndicator}
      </label>
      {hasError && (
        <div
          className="editabletextarea-error"
          id={errorId}
          role="alert"
          aria-live="polite"
        >
          {t('form.requiredField')}
        </div>
      )}
      {editMode ? (
        <textarea
          id={inputId}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          aria-invalid={hasError}
          aria-describedby={errorId}
          className={`editabletextarea-input ${hasError ? 'editabletextarea-input--error' : ''}`}
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
          className="editabletextarea-value"
        >
          {value || '—'}
        </p>
      )}
    </div>
  );
}
