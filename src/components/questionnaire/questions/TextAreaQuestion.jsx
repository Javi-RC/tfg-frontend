import React from 'react';

/**
 * TextAreaQuestion - Handles multi-line text inputs
 */
const TextAreaQuestion = ({ question, value, onChange }) => {
  const inputId = question.field || question.id || 'question-textarea';
  const ariaLabel = question.label || question.question || question.field || 'Text response';
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
