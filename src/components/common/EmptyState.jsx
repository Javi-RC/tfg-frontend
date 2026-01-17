import React from 'react';

/**
 * EmptyState Component
 * Display when no data is available
 */
export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  iconSize = 64,
  iconColor = '#6c757d',
  iconOpacity = 0.3
}) {
  return (
    <div style={styles.container}>
      {Icon && (
        <div style={styles.iconWrapper}>
          <Icon size={iconSize} color={iconColor} style={{ opacity: iconOpacity }} />
        </div>
      )}
      {title && <h3 style={styles.title}>{title}</h3>}
      {description && <p style={styles.description}>{description}</p>}
      {action && <div style={styles.action}>{action}</div>}
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '80px 20px',
    background: '#F9FAFB',
    borderRadius: '16px',
    border: '2px dashed #E5E7EB'
  },
  iconWrapper: {
    marginBottom: '16px'
  },
  title: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#111',
    marginBottom: '8px',
    margin: '0 0 8px 0'
  },
  description: {
    fontSize: '15px',
    color: '#6B7280',
    marginBottom: '24px',
    margin: '0 0 24px 0'
  },
  action: {
    marginTop: '24px'
  }
};
