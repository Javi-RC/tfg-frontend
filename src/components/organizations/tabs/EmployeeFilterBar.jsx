import React from 'react';
import { useTranslation } from 'react-i18next';

export default function EmployeeFilterBar({ filter, setFilter, styles }) {
  const { t } = useTranslation();
  return (
    <div style={styles.filterButtons}>
      {['all', 'active', 'pending', 'inactive'].map((f) => (
        <button
          key={f}
          type="button"
          style={filter === f ? styles.filterActive : styles.filterButton}
          onClick={() => setFilter(f)}
        >
          {t(`organizations.employees.filters.${f}`)}
        </button>
      ))}
    </div>
  );
}
