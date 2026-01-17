import React from 'react';
import { useTranslation } from 'react-i18next';
import { getRiskScoreInfo } from '../../types/projectTypes';

/**
 * Project Risk Score Component
 * Displays risk score with visual indicator
 */
export default function ProjectRiskScore({ score }) {
  const { t } = useTranslation();
  const riskInfo = getRiskScoreInfo(score);

  return (
    <div style={styles.container}>
      <div 
        style={{
          ...styles.indicator,
          background: riskInfo.color
        }}
      />
      <div style={styles.content}>
        <div style={styles.score}>{score}</div>
        <div style={styles.label}>{t(riskInfo.label)}</div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    background: '#F9FAFB',
    borderRadius: '12px',
    border: '1px solid #E5E7EB'
  },
  indicator: {
    width: '8px',
    height: '40px',
    borderRadius: '4px'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  score: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#111'
  },
  label: {
    fontSize: '12px',
    color: '#6B7280',
    fontWeight: '500'
  }
};
