import React from 'react';

/**
 * DateQuestion - Handles date inputs
 */
const DateQuestion = ({ question, value, onChange }) => {
  const inputId = question.field || question.id || 'question-date';
  const ariaLabel = question.label || question.question || question.field || 'Select date';
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
