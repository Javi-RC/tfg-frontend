import React, { useState, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const EMPTY_ARRAY = [];

/**
 * Risk Filters Component
 * Provides search and filtering capabilities for risk lists
 */
export default function RiskFilters({
  onSearchChange,
  onSeverityFilter,
  onTypeFilter,
  searchValue = '',
  selectedSeverities = EMPTY_ARRAY,
  selectedTypes = EMPTY_ARRAY,
  availableTypes = EMPTY_ARRAY,
}) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const selectedTypesSet = useMemo(() => new Set(selectedTypes), [selectedTypes]);

  const severityOptions = [
    { value: 'critical', label: t('risk.severity.critical'), color: 'var(--color-danger)' },
    { value: 'high', label: t('risk.severity.high'), color: 'var(--color-warning)' },
    { value: 'medium', label: t('risk.severity.medium'), color: '#EAB308' },
    { value: 'low', label: t('risk.severity.low'), color: 'var(--color-success)' },
  ];

  const handleSeverityToggle = (severity) => {
    const newSelection = selectedSeverities.includes(severity)
      ? selectedSeverities.filter((s) => s !== severity)
      : [...selectedSeverities, severity];
    onSeverityFilter(newSelection);
  };

  const handleTypeToggle = (type) => {
    const newSelection = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];
    onTypeFilter(newSelection);
  };

  const handleClearFilters = () => {
    onSearchChange('');
    onSeverityFilter([]);
    onTypeFilter([]);
  };

  const hasActiveFilters = searchValue || selectedSeverities.length > 0 || selectedTypes.length > 0;

  return (
    <div style={styles.container}>
      {/* Search Bar */}
      <div style={styles.searchContainer}>
        <Search size={18} color="#6B7280" style={styles.searchIcon} />
        <input
          type="text"
          placeholder={t('risk.filters.searchPlaceholder')}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          style={styles.searchInput}
          aria-label={t('risk.filters.aria.search')}
        />
        {searchValue && (
          <button type="button"
            onClick={() => onSearchChange('')}
            style={styles.clearButton}
            aria-label={t('risk.filters.aria.clearSearch')}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filter Toggle */}
      <div style={styles.filterHeader}>
        <button type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          style={styles.filterButton}
          aria-expanded={isExpanded}
          aria-label={t('risk.filters.aria.toggleFilters')}
        >
          <Filter size={16} />
          {t('risk.filters.title')}
          {hasActiveFilters && (
            <span style={styles.activeFilterBadge}>
              {selectedSeverities.length + selectedTypes.length + (searchValue ? 1 : 0)}
            </span>
          )}
        </button>
        {hasActiveFilters && (
          <button type="button"
            onClick={handleClearFilters}
            style={styles.clearAllButton}
            aria-label={t('risk.filters.aria.clearAll')}
          >
            {t('risk.filters.clearAll')}
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {isExpanded && (
        <div style={styles.filterPanel}>
          {/* Severity Filters */}
          <div style={styles.filterGroup}>
            <div style={styles.filterLabel}>{t('risk.filters.severityLabel')}</div>
            <div style={styles.filterOptions}>
              {severityOptions.map((option) => (
                <label
                  key={option.value}
                  style={styles.checkboxLabel}
                  htmlFor={`severity-${option.value}`}
                >
                  <input
                    type="checkbox"
                    id={`severity-${option.value}`}
                    checked={selectedSeverities.includes(option.value)}
                    onChange={() => handleSeverityToggle(option.value)}
                    style={styles.checkbox}
                    aria-label={option.label}
                  />
                  <span
                    style={{
                      ...styles.severityDot,
                      backgroundColor: option.color,
                    }}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          {/* Type Filters */}
          {availableTypes.length > 0 && (
            <div style={styles.filterGroup}>
              <div style={styles.filterLabel}>{t('risk.filters.typeLabel')}</div>
              <div style={styles.filterOptions}>
                {availableTypes.map((type) => (
                  <label key={type} style={styles.checkboxLabel} htmlFor={`type-${type}`}>
                    <input
                      type="checkbox"
                      id={`type-${type}`}
                      checked={selectedTypesSet.has(type)}
                      onChange={() => handleTypeToggle(type)}
                      style={styles.checkbox}
                      aria-label={type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    />
                    {type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    marginBottom: '16px',
  },
  searchContainer: {
    position: 'relative',
    marginBottom: '12px',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    padding: '10px 40px 10px 40px',
    border: '1px solid var(--color-border-strong)',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box',
  },
  clearButton: {
    position: 'absolute',
    right: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-text-muted)',
    borderRadius: '4px',
  },
  filterHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  filterButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: 'var(--color-bg-subtle)',
    border: '1px solid var(--color-border-strong)',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--color-text-strong)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
  },
  activeFilterBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '20px',
    height: '20px',
    padding: '0 6px',
    backgroundColor: '#3B82F6',
    color: 'white',
    borderRadius: '10px',
    fontSize: '12px',
    fontWeight: '600',
  },
  clearAllButton: {
    padding: '8px 12px',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'var(--color-danger)',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'background-color 0.2s ease',
  },
  filterPanel: {
    padding: '16px',
    backgroundColor: 'var(--color-bg-muted)',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  filterLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--color-text-strong)',
    marginBottom: '4px',
  },
  filterOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#4B5563',
    cursor: 'pointer',
    padding: '4px 0',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
  },
  severityDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    flexShrink: 0,
  },
};
