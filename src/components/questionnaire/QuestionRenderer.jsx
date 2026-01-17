import React from 'react';
import { AlertCircle } from 'lucide-react';
import EmailQuestion from './questions/EmailQuestion';
import ArrayQuestion from './questions/ArrayQuestion';
import DateQuestion from './questions/DateQuestion';
import BooleanQuestion from './questions/BooleanQuestion';
import TextAreaQuestion from './questions/TextAreaQuestion';
import './QuestionRenderer.css';

const questionComponents = {
  email: EmailQuestion,
  phone: EmailQuestion,
  text: EmailQuestion,
  number: EmailQuestion,
  date: DateQuestion,
  boolean: BooleanQuestion,
  array: ArrayQuestion,
  select: BooleanQuestion,
  textarea: TextAreaQuestion
};

/**
 * QuestionRenderer - Dynamically renders the appropriate question component
 */
const QuestionRenderer = ({ question, value, onChange, error }) => {
  const Component = questionComponents[question.type] || EmailQuestion;

  return (
    <div className={`question-wrapper ${error ? 'has-error' : ''}`}>
      <label className="question-label">
        {question.question}
        {question.required && <span className="required">*</span>}
      </label>
      
      {question.description && (
        <p className="question-description">{question.description}</p>
      )}

      <Component
        question={question}
        value={value}
        onChange={onChange}
      />

      {error && (
        <div className="error-message">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default QuestionRenderer;
