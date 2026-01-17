import React from 'react';

/**
 * DateQuestion - Handles date inputs
 */
const DateQuestion = ({ question, value, onChange }) => {
  return (
    <input
      type="date"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="form-input"
      required={question.required}
    />
  );
};

export default DateQuestion;
