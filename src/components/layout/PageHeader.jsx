import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * PageHeader Component
 * Reusable header for pages with title, subtitle, actions, and back button
 */
export default function PageHeader({
  title,
  subtitle,
  action,
  actions,
  backButton,
  backButtonText,
  children,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      {backButton && (
        <button type="button" style={styles.backButton} onClick={() => navigate(backButton)}>
          <ArrowLeft size={18} style={{ marginRight: '8px' }} />
          {backButtonText || t('layout.back')}
        </button>
      )}

      <div style={styles.content}>
        <div style={styles.left}>
          {title && <h1 style={styles.title}>{title}</h1>}
          {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
          {children}
        </div>

        {(action || actions) && (
          <div style={styles.actions}>
            {action}
            {actions &&
              actions.map((actionItem, index) => (
                <React.Fragment key={index}>{actionItem}</React.Fragment>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    marginBottom: '32px',
  },
  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    color: 'var(--color-text-muted)',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '8px 12px 8px 0',
    marginBottom: '16px',
    transition: 'color 0.2s, transform 0.2s',
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '20px',
    flexWrap: 'wrap',
  },
  left: {
    flex: 1,
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: 'var(--color-text-primary)',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '16px',
    color: 'var(--color-text-muted)',
    margin: 0,
  },
  actions: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
};
