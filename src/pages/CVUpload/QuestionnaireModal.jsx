import React from 'react';
import { Target, Clock, ClipboardList } from 'lucide-react';
import CVQuestionnaire from '../../components/questionnaire/CVQuestionnaire';
import { QuestionnaireProvider } from '../../components/questionnaire/QuestionnaireContext';
import './QuestionnaireModal.css';

/**
 * QuestionnaireModal - Modal wrapper for the questionnaire
 */
const QuestionnaireModal = ({ initialData, onComplete, onSkip }) => {
  return (
    <div className="questionnaire-modal-overlay">
      <div className="questionnaire-modal">
        <div className="modal-header">
          <h2>
            <Target size={24} className="title-icon" />
            Complete Your Profile!
          </h2>
          <p className="modal-description">
            Your CV is {initialData.currentPhase ? '45' : '0'}% complete.
            <br />
            Answer these quick questions to get better recommendations.
          </p>
          <div className="modal-stats">
            <span className="stat-item">
              <Clock size={18} className="stat-icon" />
              {initialData.estimatedTime || '5-10 minutes'}
            </span>
            <span className="stat-item">
              <ClipboardList size={18} className="stat-icon" />
              {initialData.totalPhases || 5} phases
            </span>
          </div>
        </div>

        <QuestionnaireProvider initialSessionData={initialData}>
          <CVQuestionnaire 
            onComplete={onComplete}
          />
        </QuestionnaireProvider>

        <div className="modal-footer">
          <button onClick={onSkip} className="btn-skip">
            Complete Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireModal;
