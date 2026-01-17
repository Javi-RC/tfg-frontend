import React from 'react';
import QuestionRenderer from './QuestionRenderer';
import './PhaseForm.css';

/**
 * PhaseForm - Renders questions for a specific phase
 */
const PhaseForm = ({ 
  phase, 
  questions, 
  responses, 
  validationErrors = {}, 
  onQuestionChange 
}) => {
  if (!phase || !questions) return null;

  return (
    <div className="phase-form">
      <div className="phase-header">
        <h2>{phase.title}</h2>
        <p className="phase-description">{phase.description}</p>
      </div>

      <div className="questions-list">
        {questions.map(question => (
          <QuestionRenderer
            key={question.id}
            question={question}
            value={responses?.[question.field]}
            onChange={(value) => onQuestionChange(question.field, value)}
            error={validationErrors?.[question.field]}
          />
        ))}
      </div>
    </div>
  );
};

export default PhaseForm;
