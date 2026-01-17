import React from 'react';

/**
 * LoadingState Component
 * Display while loading data
 */
export default function LoadingState({
  message = 'Loading...',
  size = 'medium',
  centered = true
}) {
  const sizeStyles = {
    small: { padding: '20px', fontSize: '14px' },
    medium: { padding: '60px', fontSize: '16px' },
    large: { padding: '100px', fontSize: '18px' }
  };

  return (
    <div
      style={{
        ...styles.container,
        ...sizeStyles[size],
        ...(centered ? styles.centered : {})
      }}
    >
      <p style={styles.text}>{message}</p>
    </div>
  );
}

const styles = {
  container: {
    width: '100%'
  },
  centered: {
    textAlign: 'center'
  },
  text: {
    color: '#6B7280',
    margin: 0
  }
};
