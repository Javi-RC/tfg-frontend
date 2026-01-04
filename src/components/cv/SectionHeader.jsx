import React from 'react';
import { Plus } from 'lucide-react';
import SecondaryButton from '../SecondaryButton';

/**
 * SectionHeader Component
 * Consistent header for CV sections with optional add button
 */
export default function SectionHeader({ id, title, editMode, onAdd, addLabel }) {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      marginBottom: '28px',
      gap: '20px'
    }}>
      <h2 id={id} style={{
        fontSize: '18px',
        fontWeight: '700',
        color: '#2d3748',
        borderBottom: '2px solid #e2e8f0',
        paddingBottom: '10px',
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
        margin: 0
      }}>
        {title}
      </h2>
      {editMode && onAdd && (
        <SecondaryButton 
          onClick={onAdd}
          style={{ 
            padding: '10px 20px', 
            fontSize: '14px',
            fontWeight: '600',
            minWidth: '100px',
            flexShrink: 0
          }}
          aria-label={addLabel || `Add new ${title.toLowerCase()} entry`}
          leftIcon={<Plus size={16} />}
        >
          Add
        </SecondaryButton>
      )}
    </div>
  );
}
