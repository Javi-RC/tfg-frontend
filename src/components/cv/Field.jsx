import React from 'react';

/**
 * Field Component
 * Unified component for editable/read-only fields
 * Reduces duplication between edit and read modes
 */
export default function Field({ 
  editable, 
  value, 
  onChange, 
  label, 
  type = 'text',
  multiline = false,
  rows = 4,
  placeholder = '',
  style = {},
  options = [],
  required = false
}) {
  // Verificar si el campo está vacío y es requerido
  const isEmpty = !value || (typeof value === 'string' && value.trim() === '');
  const hasError = required && editable && isEmpty;

  const baseInputStyle = {
    width: '100%',
    padding: '10px 12px',
    border: hasError ? '2px solid #fc8181' : '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '15px',
    color: '#2d3748',
    fontFamily: 'inherit',
    transition: 'all 0.15s ease',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: hasError ? '#fff5f5' : 'white',
    ...style
  };

  const focusStyle = {
    borderColor: '#4299e1',
    boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.1)'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    color: '#4a5568',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px'
  };

  const requiredIndicator = required && editable ? (
    <span style={{ color: '#e53e3e', marginLeft: '4px' }} aria-label="required">*</span>
  ) : null;

  const readOnlyStyle = {
    fontSize: '15px',
    color: '#2d3748',
    lineHeight: '1.6',
    wordBreak: 'break-word'
  };

  if (!editable) {
    return (
      <div>
        {label && <div style={labelStyle}>{label}</div>}
        <div style={readOnlyStyle}>
          {value || <span style={{ color: '#a0aec0', fontStyle: 'italic' }}>Not provided</span>}
        </div>
      </div>
    );
  }

  const handleFocus = (e) => {
    Object.assign(e.target.style, focusStyle);
  };

  const handleBlur = (e) => {
    if (hasError) {
      e.target.style.borderColor = '#fc8181';
      e.target.style.boxShadow = 'none';
    } else {
      e.target.style.borderColor = '#e2e8f0';
      e.target.style.boxShadow = 'none';
    }
  };

  return (
    <div>
      {label && <label style={labelStyle}>{label}{requiredIndicator}</label>}
      {hasError && (
        <div style={{
          fontSize: '12px',
          color: '#e53e3e',
          marginBottom: '6px',
          fontWeight: '500'
        }}>
          This field is required
        </div>
      )}
      {multiline ? (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          rows={rows}
          placeholder={placeholder}
          style={{
            ...baseInputStyle,
            resize: 'vertical',
            minHeight: '80px'
          }}
        />
      ) : type === 'select' ? (
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={{
            ...baseInputStyle,
            cursor: 'pointer',
            backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
            backgroundSize: '20px',
            paddingRight: '40px',
            appearance: 'none'
          }}
        >
          <option value="">{placeholder || 'Select an option'}</option>
          {options.map((option) => {
            const optionValue = typeof option === 'string' ? option : option?.value;
            const optionLabel = typeof option === 'string' ? option : (option?.label ?? option?.value);

            if (!optionValue) {
              return null;
            }

            return (
              <option key={optionValue} value={optionValue}>
                {optionLabel}
              </option>
            );
          })}
        </select>
      ) : (
        <input
          type={type}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          style={baseInputStyle}
        />
      )}
    </div>
  );
}

