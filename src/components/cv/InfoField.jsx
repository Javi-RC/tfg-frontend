import React from 'react';

/**
 * InfoField Component
 * Displays an editable or read-only field with professional styling
 */
export default function InfoField({ label, value, editMode, onChange, fullWidth = false }) {
  return (
    <div style={fullWidth ? { gridColumn: '1 / -1' } : {}}>
      <label style={{
        display: 'block',
        fontSize: '12px',
        fontWeight: '600',
        color: '#4a5568',
        marginBottom: '8px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        {label}
      </label>
      {editMode ? (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 14px',
            border: '2px solid #e2e8f0',
            borderRadius: '6px',
            fontSize: '15px',
            outline: 'none',
            transition: 'all 0.2s',
            color: '#2d3748'
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
          padding: '0',
          lineHeight: '1.6'
        }}>
          {value || '—'}
        </p>
      )}
    </div>
  );
}
