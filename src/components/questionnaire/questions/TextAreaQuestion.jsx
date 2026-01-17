import React from 'react';

/**
 * TextAreaQuestion - Handles multi-line text inputs
 */
const TextAreaQuestion = ({ question, value, onChange }) => {
  return (
    <textarea
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={question.placeholder || ''}
      className="form-textarea"
      required={question.required}
      rows={4}
    />
  );
};

export default TextAreaQuestion;
