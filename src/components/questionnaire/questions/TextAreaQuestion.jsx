import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * TextAreaQuestion - Handles multi-line text inputs
 */
const TextAreaQuestion = ({ question, value, onChange }) => {
  const { t } = useTranslation();
  const inputId = question.field || question.id || 'question-textarea';
  const ariaLabel = question.label || question.question || question.field || t('questionnaire.aria.textResponse');
  return (
    <textarea
      id={inputId}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={question.placeholder || ''}
      className="form-textarea"
      required={question.required}
      aria-label={ariaLabel}
      rows={4}
    />
  );
};

export default TextAreaQuestion;
