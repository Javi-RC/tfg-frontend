import React from 'react';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';
import QuestionCard, { SCALE_LABELS } from './QuestionCard';

/**
 * BFI44QuestionnaireView Component
 * Displays the questionnaire with pagination
 * 
 * @param {Array} questions - All questions
 * @param {Object} responses - Current responses {questionId: value}
 * @param {Function} onResponseChange - Callback for response change
 * @param {number} currentPage - Current page index
 * @param {Function} onNextPage - Next page callback
 * @param {Function} onPrevPage - Previous page callback
 * @param {Function} onSubmit - Submit callback
 * @param {boolean} submitting - Whether submission is in progress
 * @param {string} error - Error message
 * @param {number} questionsPerPage - Questions per page (default 11)
 */
export default function BFI44QuestionnaireView({
  questions,
  responses,
  onResponseChange,
  currentPage,
  onNextPage,
  onPrevPage,
  onSubmit,
  submitting,
  error,
  questionsPerPage = 11
}) {
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  
  const getCurrentPageQuestions = () => {
    const start = currentPage * questionsPerPage;
    const end = start + questionsPerPage;
    return questions.slice(start, end);
  };

  const canGoNext = () => {
    const pageQuestions = getCurrentPageQuestions();
    return pageQuestions.every(q => responses[q.id] !== undefined);
  };

  return (
    <>
      {error && (
        <div style={styles.errorBanner} role="alert" aria-live="assertive">
          {error}
        </div>
      )}

      {/* Scale legend */}
      <div style={styles.scaleLegend}>
        <p style={styles.legendTitle}>Rating Scale:</p>
        <div style={styles.legendItems}>
          {Object.entries(SCALE_LABELS).map(([value, label]) => (
            <div key={value} style={styles.legendItem}>
              <span style={styles.legendNumber}>{value}</span>
              <span style={styles.legendLabel}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Questions */}
      <div style={styles.questionsContainer}>
        <div style={styles.pageIndicator} aria-live="polite">
          Page {currentPage + 1} of {totalPages}
        </div>

        {getCurrentPageQuestions().map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            selectedValue={responses[question.id]}
            onResponseChange={onResponseChange}
          />
        ))}
      </div>

      {/* Navigation */}
      <div style={styles.navigationRow}>
        <SecondaryButton
          onClick={onPrevPage}
          disabled={currentPage === 0}
          style={{ opacity: currentPage === 0 ? 0.5 : 1 }}
          aria-label="Previous page"
        >
          Previous
        </SecondaryButton>

        {currentPage === totalPages - 1 ? (
          <PrimaryButton
            onClick={onSubmit}
            disabled={submitting || Object.keys(responses).length < questions.length}
            aria-label={submitting ? 'Submitting questionnaire' : 'Submit questionnaire'}
          >
            {submitting ? 'Submitting...' : 'Submit Questionnaire'}
          </PrimaryButton>
        ) : (
          <PrimaryButton
            onClick={onNextPage}
            disabled={!canGoNext()}
            aria-label="Next page"
          >
            Next
          </PrimaryButton>
        )}
      </div>
    </>
  );
}

const styles = {
  errorBanner: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#dc2626',
    padding: '12px 16px',
    borderRadius: '12px',
    marginBottom: '24px',
    fontSize: '14px'
  },
  scaleLegend: {
    background: 'white',
    borderRadius: '12px',
    padding: '16px 24px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
  },
  legendTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '12px'
  },
  legendItems: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  legendNumber: {
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f0f4f8',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#4a5568'
  },
  legendLabel: {
    fontSize: '13px',
    color: '#666'
  },
  questionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  pageIndicator: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px'
  },
  navigationRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '32px',
    gap: '16px'
  }
};
