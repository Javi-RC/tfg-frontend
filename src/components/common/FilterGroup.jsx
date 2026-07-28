import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * FilterGroup Component
 * Reusable filter dropdown
 */
export default function FilterGroup({
  label,
  value,
  onChange,
  options,
  placeholder,
  minWidth = '180px',
}) {
  const { t } = useTranslation();
  const displayPlaceholder = placeholder ?? t('common.selectDefault');
  const filterId = `filter-${(label || '').toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <div style={styles.container}>
      {label && <label htmlFor={filterId} style={styles.label}>{label}:</label>}
      <select id={filterId} value={value} onChange={onChange} style={{ ...styles.select, minWidth }}>
        {displayPlaceholder && <option value="">{displayPlaceholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--color-text-primary)',
  },
  select: {
    padding: '10px 16px',
    border: '2px solid var(--color-border)',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
    cursor: 'pointer',
    background: 'white',
  },
};
