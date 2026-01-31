import React from 'react';

/**
 * Form Input Component
 */
export function FormInput({ 
  label, 
  name, 
  value, 
  onChange, 
  required = false, 
  type = 'text',
  placeholder = '',
  error = '',
  ...props 
}) {
  const inputId = props.id || name;
  const errorId = error ? `${inputId}-error` : undefined;
  return (
    <div style={styles.field}>
      <label style={styles.label} htmlFor={inputId}>
        <span style={styles.labelLeft}>
          {label}
          {required && (
            <span style={styles.required} aria-hidden="true">*</span>
          )}
        </span>
      </label>
      <input
        type={type}
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        style={{
          ...styles.input,
          ...(error && styles.inputError)
        }}
        {...props}
      />
      {error && (
        <span id={errorId} style={styles.errorText} role="alert" aria-live="polite">
          {error}
        </span>
      )}
    </div>
  );
}

/**
 * Form Textarea Component
 */
export function FormTextarea({ 
  label, 
  name, 
  value, 
  onChange, 
  required = false,
  placeholder = '',
  rows = 4,
  maxLength,
  error = '',
  ...props 
}) {
  const inputId = props.id || name;
  const errorId = error ? `${inputId}-error` : undefined;
  return (
    <div style={styles.field}>
      <label style={styles.label} htmlFor={inputId}>
        <span style={styles.labelLeft}>
          {label}
          {required && (
            <span style={styles.required} aria-hidden="true">*</span>
          )}
        </span>
        {maxLength && (
          <span style={styles.charCount}>
            {value?.length || 0} / {maxLength}
          </span>
        )}
      </label>
      <textarea
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        style={{
          ...styles.textarea,
          ...(error && styles.inputError)
        }}
        {...props}
      />
      {error && (
        <span id={errorId} style={styles.errorText} role="alert" aria-live="polite">
          {error}
        </span>
      )}
    </div>
  );
}

/**
 * Form Select Component
 */
export function FormSelect({ 
  label, 
  name, 
  value, 
  onChange, 
  required = false,
  options = [],
  placeholder = 'Select...',
  error = '',
  ...props 
}) {
  const inputId = props.id || name;
  const errorId = error ? `${inputId}-error` : undefined;
  return (
    <div style={styles.field}>
      <label style={styles.label} htmlFor={inputId}>
        <span style={styles.labelLeft}>
          {label}
          {required && (
            <span style={styles.required} aria-hidden="true">*</span>
          )}
        </span>
      </label>
      <select
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        style={{
          ...styles.select,
          ...(error && styles.inputError)
        }}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span id={errorId} style={styles.errorText} role="alert" aria-live="polite">
          {error}
        </span>
      )}
    </div>
  );
}

/**
 * Form Number Input Component
 */
export function FormNumber({ 
  label, 
  name, 
  value, 
  onChange, 
  required = false,
  min,
  max,
  error = '',
  ...props 
}) {
  const inputId = props.id || name;
  const errorId = error ? `${inputId}-error` : undefined;
  return (
    <div style={styles.field}>
      <label style={styles.label} htmlFor={inputId}>
        <span style={styles.labelLeft}>
          {label}
          {required && (
            <span style={styles.required} aria-hidden="true">*</span>
          )}
        </span>
      </label>
      <input
        type="number"
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        style={{
          ...styles.input,
          ...(error && styles.inputError)
        }}
        {...props}
      />
      {error && (
        <span id={errorId} style={styles.errorText} role="alert" aria-live="polite">
          {error}
        </span>
      )}
    </div>
  );
}

/**
 * Form Checkbox Component
 */
export function FormCheckbox({ 
  label, 
  name, 
  checked, 
  onChange,
  ...props 
}) {
  return (
    <div style={styles.checkboxField}>
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={checked}
        onChange={onChange}
        style={styles.checkbox}
        {...props}
      />
      <label htmlFor={name} style={styles.checkboxLabel}>
        {label}
      </label>
    </div>
  );
}

/**
 * Form Section Title Component
 */
export function FormSection({ title, description }) {
  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>{title}</h3>
      {description && <p style={styles.sectionDescription}>{description}</p>}
    </div>
  );
}

const styles = {
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '20px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#111',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  labelLeft: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    minWidth: 0
  },
  required: {
    color: '#EF4444',
    fontWeight: '700',
    lineHeight: 1
  },
  charCount: {
    fontSize: '12px',
    color: '#9CA3AF',
    fontWeight: '400'
  },
  input: {
    padding: '12px 16px',
    border: '2px solid #E5E7EB',
    borderRadius: '10px',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit'
  },
  textarea: {
    padding: '12px 16px',
    border: '2px solid #E5E7EB',
    borderRadius: '10px',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit',
    resize: 'vertical'
  },
  select: {
    padding: '12px 16px',
    border: '2px solid #E5E7EB',
    borderRadius: '10px',
    fontSize: '15px',
    outline: 'none',
    cursor: 'pointer',
    background: 'white',
    fontFamily: 'inherit'
  },
  inputError: {
    borderColor: '#EF4444'
  },
  errorText: {
    fontSize: '13px',
    color: '#EF4444',
    marginTop: '-4px'
  },
  checkboxField: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '16px'
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer'
  },
  checkboxLabel: {
    fontSize: '14px',
    color: '#111',
    cursor: 'pointer',
    userSelect: 'none'
  },
  section: {
    marginBottom: '32px',
    paddingBottom: '24px',
    borderBottom: '1px solid #E5E7EB'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#111',
    margin: '0 0 8px 0'
  },
  sectionDescription: {
    fontSize: '14px',
    color: '#6B7280',
    margin: 0
  }
};
