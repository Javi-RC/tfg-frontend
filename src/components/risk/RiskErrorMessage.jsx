import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, RefreshCw, FileText } from 'lucide-react';

/**
 * Enhanced Error Message Component for Risk Analysis
 * Provides specific error information and actionable steps
 */
export default function RiskErrorMessage({ error, onRetry, onEditProject }) {
  const { t } = useTranslation();
  
  const getErrorDetails = () => {
    if (!error) {
      return {
        title: t('risk.errors.unknownTitle'),
        message: t('risk.errors.unknownMessage'),
        actions: []
      };
    }

    if (error.type === 'validation') {
      return {
        title: t('risk.errors.incompleteTitle'),
        message: error.message || t('risk.errors.incompleteMessage'),
        actions: [
          {
            label: t('risk.errors.completeInfo'),
            icon: FileText,
            onClick: onEditProject,
            primary: true
          }
        ]
      };
    }

    if (error.type === 'api') {
      return {
        title: t('risk.errors.analysisFailedTitle'),
        message: error.message || t('risk.errors.analysisFailedMessage'),
        actions: [
          {
            label: t('risk.errors.retryAnalysis'),
            icon: RefreshCw,
            onClick: onRetry,
            primary: true
          },
          {
            label: t('risk.errors.checkData'),
            icon: FileText,
            onClick: onEditProject,
            primary: false
          }
        ]
      };
    }

    return {
      title: 'Error',
      message: error.message || 'Something went wrong.',
      actions: [
        {
          label: 'Try Again',
          icon: RefreshCw,
          onClick: onRetry,
          primary: true
        }
      ]
    };
  };

  const details = getErrorDetails();

  return (
    <div style={styles.container} role="alert" aria-live="assertive">
      <div style={styles.iconWrapper}>
        <AlertCircle size={32} color="#DC2626" />
      </div>
      <div style={styles.content}>
        <h3 style={styles.title}>{details.title}</h3>
        <p style={styles.message}>{details.message}</p>
        {details.actions.length > 0 && (
          <div style={styles.actions}>
            {details.actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                style={{
                  ...styles.button,
                  ...(action.primary ? styles.primaryButton : styles.secondaryButton)
                }}
                aria-label={action.label}
              >
                {action.icon && <action.icon size={16} />}
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    gap: '16px',
    padding: '24px',
    backgroundColor: '#FEF2F2',
    border: '1px solid #FECACA',
    borderRadius: '8px',
    margin: '16px 0'
  },
  iconWrapper: {
    flexShrink: 0
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  title: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '600',
    color: '#991B1B'
  },
  message: {
    margin: 0,
    fontSize: '14px',
    color: '#7F1D1D',
    lineHeight: '1.5'
  },
  actions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    marginTop: '8px'
  },
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none'
  },
  primaryButton: {
    backgroundColor: '#DC2626',
    color: 'white'
  },
  secondaryButton: {
    backgroundColor: 'white',
    color: '#DC2626',
    border: '1px solid #DC2626'
  }
};
