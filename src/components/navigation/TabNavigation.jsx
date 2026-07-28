import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * TabNavigation Component
 * Reusable tab navigation
 */
export default function TabNavigation({
  tabs,
  activeTab,
  onChange,
  ariaLabel,
}) {
  const { t } = useTranslation();
  const displayAriaLabel = ariaLabel ?? t('common.navigationTabs');
  const handleKeyDown = (e) => {
    const tabIds = tabs.map(t => t.id);
    const currentIndex = tabIds.indexOf(activeTab);

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % tabs.length;
      onChange(tabIds[nextIndex]);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      onChange(tabIds[prevIndex]);
    }
  };

  return (
    <div style={styles.container} role="tablist" aria-label={displayAriaLabel} onKeyDown={handleKeyDown}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            type="button"
            key={tab.id}
            id={`${tab.id}-tab`}
            onClick={() => onChange(tab.id)}
            role="tab"
            aria-selected={isActive}
            aria-controls={`${tab.id}-panel`}
            tabIndex={isActive ? 0 : -1}
            style={{
              ...styles.tab,
              ...(isActive ? styles.tabActive : {}),
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
    borderBottom: '2px solid var(--color-border)',
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
    color: 'var(--color-text-muted)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    borderBottomWidth: '2px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'transparent',
    marginBottom: '-2px',
  },
  tabActive: {
    color: 'var(--color-text-primary)',
    borderBottomColor: 'var(--color-text-primary)',
  },
};
