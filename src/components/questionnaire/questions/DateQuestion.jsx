import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * DateQuestion - Handles date inputs
 */
const DateQuestion = ({ question, value, onChange }) => {
  const { t } = useTranslation();
  const inputId = question.field || question.id || 'question-date';
  const ariaLabel = question.label || question.question || question.field || t('questionnaire.aria.selectDate');
  return (
    <input
      type="date"
      id={inputId}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="form-input"
      required={question.required}
      aria-label={ariaLabel}
    />
  );
};

export default DateQuestion;
