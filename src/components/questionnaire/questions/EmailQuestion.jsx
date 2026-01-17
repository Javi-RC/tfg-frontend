import React from 'react';

/**
 * EmailQuestion - Handles text, email, number inputs
 */
const EmailQuestion = ({ question, value, onChange }) => {
  const inputType = question.type === 'email' ? 'email' : 
                    question.type === 'number' ? 'number' : 
                    question.type === 'phone' ? 'tel' : 'text';

  return (
    <input
      type={inputType}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={question.placeholder || ''}
      className="form-input"
      required={question.required}
    />
  );
};

export default EmailQuestion;
