import React from 'react';

/**
 * TabNavigation Component
 * Reusable tab navigation
 */
export default function TabNavigation({
  tabs,
  activeTab,
  onChange,
  ariaLabel = 'Navigation tabs'
}) {
  return (
    <div style={styles.container} role="tablist" aria-label={ariaLabel}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            role="tab"
            aria-selected={isActive}
            aria-controls={`${tab.id}-panel`}
            style={{
              ...styles.tab,
              ...(isActive ? styles.tabActive : {})
            }}
          >
            {Icon && <Icon size={16} />}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto 24px',
    display: 'flex',
    gap: '8px',
    borderBottom: '2px solid #E5E7EB'
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '12px 24px',
    background: 'none',
    border: 'none',
    fontSize: '15px',
    fontWeight: '600',
    color: '#6B7280',
    cursor: 'pointer',
    transition: 'all 0.2s',
    borderBottomWidth: '2px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'transparent',
    marginBottom: '-2px'
  },
  tabActive: {
    color: '#111',
    borderBottomColor: '#111'
  }
};
