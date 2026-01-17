import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { useQuestionnaire } from './useQuestionnaire';
import PhaseProgress from './PhaseProgress';
import PhaseForm from './PhaseForm';
import './CVQuestionnaire.css';

/**
 * CVQuestionnaire - Main questionnaire component
 * Manages multi-phase questionnaire flow
 */
const CVQuestionnaire = ({ onComplete }) => {
  const { state, updateResponse, submitPhase } = useQuestionnaire();

  // If backend sends no questions, it means this phase is already complete
  // Show a message or complete immediately
  useEffect(() => {
    if (state.questions && state.questions.length === 0 && !state.isLoading && !state.error) {
      console.log('CVQuestionnaire - Phase has no questions, marking as complete...');
      // Don't POST to backend - just complete locally
      onComplete?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.questions?.length, state.isLoading, state.error]);

  const handleQuestionChange = (field, value) => {
    updateResponse(field, value);
  };

  const handleNextPhase = async () => {
    // No validation - backend decides what's required
    // Frontend only sends what user has filled
    
    try {
      console.log('CVQuestionnaire - Submitting phase with responses:', state.responses);
      const result = await submitPhase();
      
      console.log('CVQuestionnaire - Submit result:', result);
      
      if (result.isComplete) {
        // Backend indicates completion
        console.log('✓ Questionnaire completed!');
        onComplete?.();
      }
    } catch (error) {
      console.error('CVQuestionnaire - Error submitting phase:', error);
    }
  };

  // Allow user to proceed even if not all required fields are filled
  // Backend will handle validation and return appropriate response

  if (state.isComplete) {
    return (
      <div className="questionnaire-complete">
        <div className="success-icon">
          <CheckCircle size={64} className="check-icon" />
        </div>
        <h2>Profile Completed!</h2>
        <p>Your CV is now 100% complete</p>
      </div>
    );
  }

  // Show loading while auto-submitting empty phases
  if (state.questions && state.questions.length === 0) {
    return (
      <div className="cv-questionnaire">
        <PhaseProgress
          currentPhase={state.currentPhase?.index || 1}
          totalPhases={state.currentPhase?.total || 5}
          completenessScore={state.completenessScore}
        />
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading next phase...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cv-questionnaire">
      <PhaseProgress
        currentPhase={state.currentPhase?.index || 1}
        totalPhases={state.currentPhase?.total || 5}
        completenessScore={state.completenessScore}
      />

      {state.error && (
        <div className="error-banner">
          {state.error}
        </div>
      )}

      <PhaseForm
        phase={state.currentPhase}
        questions={state.questions}
        responses={state.responses}
        onQuestionChange={handleQuestionChange}
      />

      <div className="questionnaire-actions">
        <button
          onClick={handleNextPhase}
          disabled={state.isLoading}
          className="btn-next"
        >
          {state.isLoading ? 'Submitting...' : 
           state.currentPhase?.index === state.currentPhase?.total ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default CVQuestionnaire;
