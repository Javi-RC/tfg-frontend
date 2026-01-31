import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * QuestionCard Component
 * Displays a single BFI-44 question with Likert scale response options
 * 
 * @param {Object} question - Question object with id and text
 * @param {number} selectedValue - Currently selected response value (1-5)
 * @param {Function} onResponseChange - Callback when response changes
 */
export default function QuestionCard({ question, selectedValue, onResponseChange }) {
  const { t } = useTranslation();

  const SCALE_LABELS = {
    1: t('bfi44.scale.disagreeStrongly'),
    2: t('bfi44.scale.disagreeALittle'),
    3: t('bfi44.scale.neitherAgreeNorDisagree'),
    4: t('bfi44.scale.agreeALittle'),
    5: t('bfi44.scale.agreeStrongly')
  };
  return (
    <div style={styles.questionCard} role="group" aria-labelledby={`question-${question.id}`}>
      <div style={styles.questionHeader}>
        <span style={styles.questionNumber}>{question.id}.</span>
        <span style={styles.questionText} id={`question-${question.id}`}>
          {t('bfi44.questionPrefix')} {question.text.toLowerCase()}
        </span>
      </div>
      <div style={styles.optionsRow} role="radiogroup" aria-labelledby={`question-${question.id}`}>
        {[1, 2, 3, 4, 5].map((value) => (
          <div key={value} style={styles.optionWrapper}>
            <button
              type="button"
              onClick={() => onResponseChange(question.id, value)}
              style={{
                ...styles.optionButton,
                ...(selectedValue === value ? styles.optionButtonSelected : {})
              }}
              aria-label={`${SCALE_LABELS[value]} - ${value}`}
              aria-pressed={selectedValue === value}
              role="radio"
              aria-checked={selectedValue === value}
            >
              {value}
            </button>
            <span style={styles.optionLabel}>{SCALE_LABELS[value]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  questionCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px 24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
  },
  questionHeader: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px'
  },
  questionNumber: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#3b82f6',
    minWidth: '28px'
  },
  questionText: {
    fontSize: '15px',
    color: '#1a1a1a',
    lineHeight: '1.5'
  },
  optionsRow: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center'
  },
  optionWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px'
  },
  optionLabel: {
    fontSize: '11px',
    color: '#666',
    textAlign: 'center',
    maxWidth: '48px',
    lineHeight: '1.2'
  },
  optionButton: {
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f7fafc',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#4a5568',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  optionButtonSelected: {
    background: '#3b82f6',
    borderColor: '#3b82f6',
    color: 'white'
  }
};
