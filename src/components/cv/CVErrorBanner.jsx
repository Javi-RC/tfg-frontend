import React from 'react';
import './CVErrorBanner.css';

/**
 * CVErrorBanner Component
 * Displays error messages
 */
export default function CVErrorBanner({ error }) {
  if (!error) return null;

  // If the error contains line breaks, split it into multiple lines
  const errorLines = error.split('\n').filter((line) => line.trim() !== '');
  const isMultiLine = errorLines.length > 1;

  return (
    <div
      className="cverrorbanner-container"
      role="alert"
      aria-live="assertive"
    >
      {isMultiLine ? (
        <>
          <div className="cverrorbanner-first-line">{errorLines[0]}</div>
          <ul className="cverrorbanner-list">
            {errorLines.slice(1).map((line) => (
              <li key={line} className="cverrorbanner-list-item">
                {line}
              </li>
            ))}
          </ul>
        </>
      ) : (
        error
      )}
    </div>
  );
}
