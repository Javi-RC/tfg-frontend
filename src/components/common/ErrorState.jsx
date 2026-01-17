import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * ErrorState Component
 * Display error messages with optional action
 */
export default function ErrorState({
  message = 'An error occurred',
  action,
  centered = true,
  variant = 'default'
}) {
  const variantStyles = {
    default: {
      background: 'white',
      padding: '40px 20px'
    },
    inline: {
      background: 'rgba(192,57,43,0.08)',
      padding: '12px 16px',
      border: '1px solid rgba(192,57,43,0.2)',
      borderRadius: '10px'
    }
  };

  return (
    <div
      style={{
        ...styles.container,
        ...variantStyles[variant],
        ...(centered ? styles.centered : {})
      }}
    >
      {variant === 'default' && (
        <AlertCircle size={48} color="#c0392b" style={{ marginBottom: '16px' }} />
      )}
      <p style={styles.message}>{message}</p>
      {action && <div style={styles.action}>{action}</div>}
    </div>
  );
}

const styles = {
  container: {
    width: '100%'
  },
  centered: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  message: {
    color: '#c0392b',
    fontSize: '14px',
    margin: 0
  },
  action: {
    marginTop: '16px'
  }
};
