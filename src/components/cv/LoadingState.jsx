import React from 'react';

/**
 * LoadingState Component
 * Displays while CV is loading
 */
export default function LoadingState() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#fafbfc',
      padding: '40px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <p style={{ fontSize: '16px', color: '#666' }} role="status" aria-live="polite">
        Loading CV...
      </p>
    </div>
  );
}
