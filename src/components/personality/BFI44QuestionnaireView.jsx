import React from 'react';
import { useTranslation } from 'react-i18next';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';
import QuestionCard from './QuestionCard';

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
  questionsPerPage = 11,
}) {
  const { t } = useTranslation();
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  const getCurrentPageQuestions = () => {
    const start = currentPage * questionsPerPage;
    const end = start + questionsPerPage;
    return questions.slice(start, end);
  };

  const canGoNext = () => {
    const pageQuestions = getCurrentPageQuestions();
    return pageQuestions.every((q) => responses[q.id] !== undefined);
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
        <p style={styles.legendTitle}>{t('bfi44.ratingScale')}:</p>
        <div style={styles.legendItems}>
          {[1, 2, 3, 4, 5].map((value) => (
            <div key={value} style={styles.legendItem}>
              <span style={styles.legendNumber}>{value}</span>
              <span style={styles.legendLabel}>{t(`bfi44.scale.${value}`)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Questions */}
      <div style={styles.questionsContainer}>
        <div style={styles.pageIndicator} aria-live="polite">
          {t('bfi44.pageIndicator', { current: currentPage + 1, total: totalPages })}
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
          aria-label={t('bfi44.previousPage')}
        >
          {t('bfi44.previous')}
        </SecondaryButton>

        {currentPage === totalPages - 1 ? (
          <PrimaryButton
            onClick={onSubmit}
            disabled={submitting || Object.keys(responses).length < questions.length}
            aria-label={
              submitting ? t('bfi44.submittingQuestionnaire') : t('bfi44.submitQuestionnaire')
            }
          >
            {submitting ? t('bfi44.submitting') : t('bfi44.submitQuestionnaire')}
          </PrimaryButton>
        ) : (
          <PrimaryButton
            onClick={onNextPage}
            disabled={!canGoNext()}
            aria-label={t('bfi44.nextPage')}
          >
            {t('bfi44.next')}
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
    color: 'var(--color-danger)',
    padding: '12px 16px',
    borderRadius: '12px',
    marginBottom: '24px',
    fontSize: '14px',
  },
  scaleLegend: {
    background: 'white',
    borderRadius: '12px',
    padding: '16px 24px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  },
  legendTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--color-text-primary)',
    marginBottom: '12px',
  },
  legendItems: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
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
    color: 'var(--color-text-secondary)',
  },
  legendLabel: {
    fontSize: '13px',
    color: 'var(--color-text-muted)',
  },
  questionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  pageIndicator: {
    textAlign: 'center',
    fontSize: '14px',
    color: 'var(--color-text-muted)',
    marginBottom: '8px',
  },
  navigationRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '32px',
    gap: '16px',
  },
};
