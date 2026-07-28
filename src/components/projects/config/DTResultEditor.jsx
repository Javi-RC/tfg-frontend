import React from 'react';
import { useTranslation } from 'react-i18next';
import { Lightbulb } from 'lucide-react';

export default function DTResultEditor() {
  const { t } = useTranslation();

  return (
    <div style={styles.infoBox}>
      <Lightbulb size={18} color="#065F46" style={styles.infoIcon} />
      <span style={styles.infoText}>{t('teamConfig.decisionTree.info')}</span>
    </div>
  );
}

const styles = {
  infoBox: {
    display: 'flex',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: '#ECFDF5',
    border: '1px solid #A7F3D0',
    borderRadius: '8px',
  },
  infoIcon: {
    flex: '0 0 auto',
    marginTop: '2px',
  },
  infoText: {
    fontSize: '13px',
    color: 'var(--color-success-dark)',
    lineHeight: 1.5,
  },
};
