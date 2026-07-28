import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle } from 'lucide-react';

export default function RiskAnalysisEmpty() {
  const { t } = useTranslation();

  return (
    <div style={styles.emptyState} role="status">
      <CheckCircle
        size={48}
        color="#28a745"
        style={{ opacity: 0.5, marginBottom: '16px' }}
        aria-hidden="true"
      />
      <h3 style={styles.emptyTitle}>{t('projects.riskAnalysisTab.empty.noRisksTitle')}</h3>
      <p style={styles.emptyText}>{t('projects.riskAnalysisTab.empty.noRisksText')}</p>
    </div>
  );
}

const styles = {
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    textAlign: 'center',
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: 'var(--color-text-primary)',
    margin: '0 0 12px 0',
  },
  emptyText: {
    fontSize: '15px',
    color: 'var(--color-text-secondary)',
    margin: 0,
    maxWidth: '400px',
    lineHeight: '1.6',
  },
};
