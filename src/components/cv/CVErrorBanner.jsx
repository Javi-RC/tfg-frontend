import React from 'react';

/**
 * CVErrorBanner Component
 * Displays error messages
 */
export default function CVErrorBanner({ error }) {
  if (!error) return null;

  // If the error contains line breaks, split it into multiple lines
  const errorLines = error.split('\n').filter(line => line.trim() !== '');
  const isMultiLine = errorLines.length > 1;

  return (
    <div style={{
      padding: '16px 20px',
      background: '#fee',
      border: '1px solid #fcc',
      borderRadius: '8px',
      color: '#c0392b',
      fontSize: '14px',
      marginBottom: '20px',
      lineHeight: '1.6'
    }} role="alert" aria-live="assertive">
      {isMultiLine ? (
        <>
          <div style={{ fontWeight: '600', marginBottom: '8px' }}>{errorLines[0]}</div>
          <ul style={{ margin: '0', paddingLeft: '20px' }}>
            {errorLines.slice(1).map((line, index) => (
              <li key={index} style={{ marginBottom: '4px' }}>{line}</li>
            ))}
          </ul>
        </>
      ) : (
        error
      )}
    </div>
  );
}
