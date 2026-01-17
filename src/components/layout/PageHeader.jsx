import React from 'react';
import { useNavigate } from 'react-router-dom';

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
  backButtonText = '← Back',
  children
}) {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      {backButton && (
        <button
          style={styles.backButton}
          onClick={() => navigate(backButton)}
        >
          {backButtonText}
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
            {actions && actions.map((actionItem, index) => (
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
    marginBottom: '32px'
  },
  backButton: {
    background: 'none',
    border: 'none',
    color: '#6B7280',
    fontSize: '14px',
    cursor: 'pointer',
    padding: '8px 0',
    marginBottom: '16px',
    display: 'inline-block',
    transition: 'color 0.2s'
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '20px',
    flexWrap: 'wrap'
  },
  left: {
    flex: 1
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#111',
    margin: '0 0 8px 0'
  },
  subtitle: {
    fontSize: '16px',
    color: '#6B7280',
    margin: 0
  },
  actions: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap'
  }
};
