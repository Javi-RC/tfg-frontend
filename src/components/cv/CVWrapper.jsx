import React from 'react';

/**
 * CVWrapper Component
 * Main content wrapper with professional styling
 */
export default function CVWrapper({ children }) {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: '16px',
        padding: '48px 56px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.04)',
        border: '1px solid var(--color-border)',
      }}
    >
      {children}
    </div>
  );
}
