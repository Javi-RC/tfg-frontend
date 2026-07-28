import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, AlertTriangle } from 'lucide-react';

export default function TabNavigation({ activeTab, onTabChange, selectedCount, riskCount }) {
  const { t } = useTranslation();

  return (
    <div style={styles.tabContainer}>
      <button type="button"
        onClick={() => onTabChange('team')}
        style={{
          ...styles.tab,
          ...(activeTab === 'team' ? styles.activeTab : {}),
        }}
      >
        <Users size={18} />
        {t('draftTeamAnalysis.teamBuilder')}
        {selectedCount > 0 && <span style={styles.badge}>{selectedCount}</span>}
      </button>
      <button type="button"
        onClick={() => onTabChange('risks')}
        style={{
          ...styles.tab,
          ...(activeTab === 'risks' ? styles.activeTab : {}),
        }}
      >
        <AlertTriangle size={18} />
        {t('draftTeamAnalysis.riskAnalysis')}
        {riskCount > 0 && <span style={styles.badge}>{riskCount}</span>}
      </button>
    </div>
  );
}

const styles = {
  tabContainer: {
    display: 'flex',
    borderBottom: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-bg-muted)',
    padding: '0 24px',
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '16px 24px',
    border: 'none',
    background: 'transparent',
    fontSize: '15px',
    fontWeight: '500',
    color: 'var(--color-text-secondary)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    borderBottomWidth: '3px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'transparent',
    position: 'relative',
  },
  activeTab: {
    color: '#007bff',
    borderBottomColor: '#007bff',
    backgroundColor: '#fff',
  },
  badge: {
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '11px',
    fontWeight: '600',
    padding: '2px 6px',
    borderRadius: '10px',
    minWidth: '18px',
    textAlign: 'center',
  },
};
