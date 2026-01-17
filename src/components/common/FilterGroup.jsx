import React from 'react';

/**
 * FilterGroup Component
 * Reusable filter dropdown
 */
export default function FilterGroup({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select...',
  minWidth = '180px'
}) {
  return (
    <div style={styles.container}>
      {label && <label style={styles.label}>{label}:</label>}
      <select
        value={value}
        onChange={onChange}
        style={{ ...styles.select, minWidth }}
      >
        {placeholder && <option value="">{placeholder}</option>}
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
    gap: '12px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#111'
  },
  select: {
    padding: '10px 16px',
    border: '2px solid #E5E7EB',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
    cursor: 'pointer',
    background: 'white'
  }
};
