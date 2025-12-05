import React from 'react';

/**
 * CVWrapper Component
 * Main content wrapper with professional styling
 */
export default function CVWrapper({ children }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '56px 64px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
      border: '1px solid #e2e8f0'
    }}>
      {children}
    </div>
  );
}
