import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Info, ClipboardList } from 'lucide-react';
import RiskCard from './RiskCard';

/**
 * Risks Group Component
 * Groups and displays risks by severity
 */
export default function RisksGroup({ title, severity, risks, dataCompleteness }) {
  const { t } = useTranslation();
  if (!risks || risks.length === 0) {
    return null;
  }

  const getSeverityStyle = () => {
    const baseStyle = {
      padding: '16px',
      borderRadius: '12px',
      marginBottom: '24px'
    };

    switch (severity) {
      case 'high':
        return {
          ...baseStyle,
          background: '#FEF2F2',
          border: '2px solid #FEE2E2'
        };
      case 'medium':
        return {
          ...baseStyle,
          background: '#FFFBEB',
          border: '2px solid #FEF3C7'
        };
      case 'low':
        return {
          ...baseStyle,
          background: '#F0FDF4',
          border: '2px solid #D1FAE5'
        };
      default:
        return {
          ...baseStyle,
          background: '#F9FAFB',
          border: '2px solid #E5E7EB'
        };
    }
  };

  const getTitleStyle = () => {
    const baseStyle = {
      fontSize: '16px',
      fontWeight: '700',
      margin: '0 0 16px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    };

    switch (severity) {
      case 'high':
        return { ...baseStyle, color: '#DC2626' };
      case 'medium':
        return { ...baseStyle, color: '#D97706' };
      case 'low':
        return { ...baseStyle, color: '#059669' };
      default:
        return { ...baseStyle, color: '#6B7280' };
    }
  };

  const getIcon = () => {
    switch (severity) {
      case 'high': return <AlertTriangle size={24} color="#dc2626" />;
      case 'medium': return <AlertTriangle size={24} color="#f59e0b" />;
      case 'low': return <Info size={24} color="#10b981" />;
      default: return <ClipboardList size={24} color="#6B7280" />;
    }
  };

  return (
    <div style={getSeverityStyle()}>
      <h3 style={getTitleStyle()}>
        <span>{getIcon()}</span>
        <span>{title}</span>
        <span style={styles.count}>{t('risksGroup.count', { count: risks.length })}</span>
      </h3>
      <div style={styles.risksList}>
        {risks.map((risk, idx) => (
          <RiskCard 
            key={idx} 
            risk={risk} 
            dataCompleteness={dataCompleteness}
          />
        ))}
      </div>
    </div>
  );
}

const styles = {
  count: {
    fontSize: '14px',
    fontWeight: '600',
    opacity: 0.7
  },
  risksList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  }
};
