import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function RiskCardActions({ isExpanded, onToggle }) {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      onClick={onToggle}
      style={styles.expandButton}
      aria-label={isExpanded ? t('risk.aria.collapseDetails') : t('risk.aria.expandDetails')}
    >
      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
    </button>
  );
}

const styles = {
  expandButton: {
    background: 'none',
    border: 'none',
    padding: '4px',
    cursor: 'pointer',
    color: 'var(--color-text-muted)',
    display: 'flex',
    alignItems: 'center',
    transition: 'color 0.2s',
  },
};
