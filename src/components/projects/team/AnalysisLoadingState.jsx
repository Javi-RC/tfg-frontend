import React from 'react';
import { useTranslation } from 'react-i18next';

export default function AnalysisLoadingState() {
  const { t } = useTranslation();

  return (
    <div style={styles.loadingContainer}>
      <div style={styles.spinner}></div>
      <p style={styles.loadingText}>{t('draftTeamAnalysis.loading')}</p>
    </div>
  );
}

const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid var(--color-accent-gradient-start)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px',
  },
  loadingText: {
    fontSize: '15px',
    color: 'var(--color-text-muted)',
    margin: 0,
  },
};
