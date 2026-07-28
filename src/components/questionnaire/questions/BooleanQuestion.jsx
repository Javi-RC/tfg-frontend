import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * BooleanQuestion - Handles boolean and select inputs
 */
const BooleanQuestion = ({ question, value, onChange }) => {
  const { t } = useTranslation();

  const options = question.options || [
    { label: t('common.yes'), value: true },
    { label: t('common.no'), value: false },
  ];
  const groupLabel = question.label || question.question || question.field || t('questionnaire.aria.selectOption');

  return (
    <div
      className="boolean-options"
      role="radiogroup"
      aria-label={groupLabel}
      aria-required={question.required}
    >
      {options.map((option) => (
        <label
          key={String(option.value)}
          className="radio-label"
          htmlFor={`${question.field}-${String(option.value)}`}
        >
          <input
            type="radio"
            name={question.field}
            id={`${question.field}-${String(option.value)}`}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            aria-checked={value === option.value}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default BooleanQuestion;
