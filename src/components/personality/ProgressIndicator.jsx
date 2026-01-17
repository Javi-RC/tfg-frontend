import React from 'react';

/**
 * ProgressIndicator Component
 * Displays progress bar and count for BFI-44 questionnaire completion
 * 
 * @param {number} answeredCount - Number of questions answered
 * @param {number} totalQuestions - Total number of questions (default 44)
 */
export default function ProgressIndicator({ answeredCount, totalQuestions = 44 }) {
  const percentage = Math.round((answeredCount / totalQuestions) * 100);

  return (
    <div style={styles.progressSection} role="region" aria-label="Questionnaire progress">
      <div style={styles.progressInfo}>
        <span>Progress: {percentage}%</span>
        <span>{answeredCount} of {totalQuestions} answered</span>
      </div>
      <div style={styles.mainProgressBar} role="progressbar" aria-valuenow={percentage} aria-valuemin="0" aria-valuemax="100">
        <div
          style={{
            ...styles.mainProgressFill,
            width: `${percentage}%`
          }}
        />
      </div>
    </div>
  );
}

const styles = {
  progressSection: {
    marginTop: '16px'
  },
  progressInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.95)',
    marginBottom: '8px'
  },
  mainProgressBar: {
    height: '8px',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  mainProgressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
    borderRadius: '4px',
    transition: 'width 0.3s ease'
  }
};
