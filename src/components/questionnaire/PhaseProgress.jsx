import React from 'react';
import { useTranslation } from 'react-i18next';
import './PhaseProgress.css';

/**
 * PhaseProgress - Visual progress indicator for questionnaire phases
 */
const PhaseProgress = ({ currentPhase, totalPhases, completenessScore }) => {
  const { t } = useTranslation();
  const progressPercentage = (currentPhase / totalPhases) * 100;

  return (
    <div className="phase-progress">
      <div className="progress-header">
        <div className="phase-info">
          <span className="phase-label">
            {t('questionnaire.phase', { current: currentPhase, total: totalPhases })}
          </span>
          <span className="completeness-badge">
            {t('questionnaire.percentComplete', { percent: completenessScore })}
          </span>
        </div>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }} />
      </div>

      <div className="phase-dots">
        {Array.from({ length: totalPhases }, (_, i) => (
          <div
            key={i}
            className={`phase-dot ${i + 1 === currentPhase ? 'active' : ''} ${i + 1 < currentPhase ? 'completed' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PhaseProgress;
