import React from 'react';
import { Target, Clock, ClipboardList } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CVQuestionnaire from '../../components/questionnaire/CVQuestionnaire';
import { QuestionnaireProvider } from '../../components/questionnaire/QuestionnaireContext';
import './QuestionnaireModal.css';

/**
 * QuestionnaireModal - Modal wrapper for the questionnaire
 */
const QuestionnaireModal = ({ initialData, onComplete, onSkip }) => {
  const { t } = useTranslation();

  return (
    <div className="questionnaire-modal-overlay">
      <div className="questionnaire-modal">
        <div className="modal-header">
          <h2>
            <Target size={24} className="title-icon" />
            {t('questionnaire.modal.title')}
          </h2>
          <p className="modal-description">
            {t('questionnaire.modal.cvProgress', { percent: initialData.currentPhase ? '45' : '0' })}
            <br />
            {t('questionnaire.modal.description')}
          </p>
          <div className="modal-stats">
            <span className="stat-item">
              <Clock size={18} className="stat-icon" />
              {initialData.estimatedTime || t('questionnaire.modal.estimatedTime')}
            </span>
            <span className="stat-item">
              <ClipboardList size={18} className="stat-icon" />
              {t('questionnaire.modal.phases', { count: initialData.totalPhases || 5 })}
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
            {t('questionnaire.modal.completeLater')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireModal;
