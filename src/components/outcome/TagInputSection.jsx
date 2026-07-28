import React from 'react';
import { useTranslation } from 'react-i18next';

const styles = {
  formGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: 700,
    color: 'var(--color-text-strong)',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid var(--color-border-strong)',
    borderRadius: '10px',
    outline: 'none',
  },
  inlineRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  smallButton: {
    background: 'var(--color-text-heading)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 12px',
    fontSize: '13px',
    fontWeight: 800,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  list: {
    margin: '10px 0 0 0',
    padding: 0,
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
    padding: '10px 12px',
    background: 'var(--color-bg-muted)',
    border: '1px solid var(--color-border)',
    borderRadius: '10px',
  },
  listText: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--color-text-heading)',
  },
  removeButton: {
    background: 'var(--color-danger-bg)',
    border: 'none',
    color: 'var(--color-danger-hover)',
    borderRadius: '10px',
    padding: '8px 10px',
    fontSize: '12px',
    fontWeight: 800,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
};

export default function TagInputSection({
  labelKey,
  placeholderKey,
  idPrefix,
  items,
  draft,
  setDraft,
  onAdd,
  onRemove,
}) {
  const { t } = useTranslation();
  return (
    <div style={styles.formGroup}>
      <label htmlFor={idPrefix} style={styles.label}>{t(labelKey)}</label>
      <div style={styles.inlineRow}>
        <input
          id={idPrefix}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          style={styles.input}
          placeholder={t(placeholderKey)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onAdd();
            }
          }}
        />
        <button type="button" onClick={onAdd} style={styles.smallButton}>
          {t('common.add')}
        </button>
      </div>
      {items.length > 0 && (
        <ul style={styles.list}>
          {items.map((item, index) => (
            <li key={item} style={styles.listItem}>
              <span style={styles.listText}>{item}</span>
              <button
                type="button"
                onClick={() => onRemove(index)}
                style={styles.removeButton}
                aria-label={`Remove ${t(labelKey)}`}
              >
                {t('common.remove')}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
