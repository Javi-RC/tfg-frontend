import React from 'react';
import { useTranslation } from 'react-i18next';

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
  iconOpacity = 0.3,
}) {
  const { t } = useTranslation();
  return (
    <div style={styles.container} role="status" aria-label={title || description || t('common.emptyState')}>
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
    background: 'var(--color-bg-muted)',
    borderRadius: '16px',
    border: '2px dashed var(--color-border)',
  },
  iconWrapper: {
    marginBottom: '16px',
  },
  title: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--color-text-primary)',
    marginBottom: '8px',
    margin: '0 0 8px 0',
  },
  description: {
    fontSize: '15px',
    color: 'var(--color-text-muted)',
    marginBottom: '24px',
    margin: '0 0 24px 0',
  },
  action: {
    marginTop: '24px',
  },
};
