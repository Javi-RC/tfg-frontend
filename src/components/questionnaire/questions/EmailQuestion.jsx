import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * EmailQuestion - Handles text, email, number inputs
 */
const EmailQuestion = ({ question, value, onChange }) => {
  const { t } = useTranslation();
  const inputType =
    question.type === 'email'
      ? 'email'
      : question.type === 'number'
        ? 'number'
        : question.type === 'phone'
          ? 'tel'
          : 'text';
  const inputId = question.field || question.id || 'question-input';
  const ariaLabel = question.label || question.question || question.field || t('questionnaire.aria.response');

  return (
    <input
      type={inputType}
      id={inputId}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={question.placeholder || ''}
      className="form-input"
      required={question.required}
      aria-label={ariaLabel}
    />
  );
};

export default EmailQuestion;
