import React from 'react';
import { useTranslation } from 'react-i18next';

const styles = {
  choiceRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '16px',
  },
  choiceLabel: {
    fontSize: '14px',
    fontWeight: 800,
    color: 'var(--color-text-heading)',
  },
  choiceGroup: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  choiceOption: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 12px',
    border: '1px solid var(--color-border)',
    borderRadius: '12px',
    cursor: 'pointer',
  },
};

export default function OccurrenceChoice({ occurred, onChoose }) {
  const { t } = useTranslation();
  return (
    <div style={styles.choiceRow}>
      <div style={styles.choiceLabel}>{t('outcome.risks.modal.didRiskOccur')}</div>
      <div style={styles.choiceGroup}>
        <label style={styles.choiceOption}>
          <input
            type="radio"
            name="occurred"
            checked={occurred === true}
            onChange={() => onChoose(true)}
          />
          <span>{t('outcome.risks.modal.yesOccurred')}</span>
        </label>
        <label style={styles.choiceOption}>
          <input
            type="radio"
            name="occurred"
            checked={occurred === false}
            onChange={() => onChoose(false)}
          />
          <span>{t('outcome.risks.modal.noAvoided')}</span>
        </label>
      </div>
    </div>
  );
}
