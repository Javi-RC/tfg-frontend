import React from 'react';

/**
 * CVCard Component
 * Styled card container for CV sections with color-coded borders
 */
export default function CVCard({ 
  children, 
  editMode, 
  borderColor = '#4299e1', 
  onRemove, 
  removeLabel,
  style = {}
}) {
  return (
    <div style={{
      marginBottom: '36px',
      paddingLeft: '24px',
      paddingTop: '4px',
      paddingBottom: '4px',
      borderLeft: `4px solid ${borderColor}`,
      position: 'relative',
      background: editMode ? '#f7fafc' : 'transparent',
      borderRadius: editMode ? '0 8px 8px 0' : '0',
      padding: editMode ? '20px 20px 20px 24px' : '4px 0 4px 24px',
      ...style
    }}>
      {editMode && onRemove && (
        <button
          onClick={onRemove}
          style={{
            position: 'absolute',
            top: editMode ? '20px' : '4px',
            right: editMode ? '20px' : '0',
            background: '#fee',
            border: '1px solid #fcc',
            color: '#c0392b',
            borderRadius: '4px',
            padding: '4px 8px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
          aria-label={removeLabel || 'Remove entry'}
        >
          Remove
        </button>
      )}
      {children}
    </div>
  );
}
