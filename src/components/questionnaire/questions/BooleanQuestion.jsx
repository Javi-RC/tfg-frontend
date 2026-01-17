import React from 'react';

/**
 * BooleanQuestion - Handles boolean and select inputs
 */
const BooleanQuestion = ({ question, value, onChange }) => {
  const options = question.options || [
    { label: 'Yes', value: true },
    { label: 'No', value: false }
  ];

  return (
    <div className="boolean-options">
      {options.map(option => (
        <label key={String(option.value)} className="radio-label">
          <input
            type="radio"
            name={question.field}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default BooleanQuestion;
