import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, ClipboardList, Star, Send, AlertCircle } from 'lucide-react';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';

/**
 * Modal for post-project completion questionnaire
 * Shown when a project is completed and user hasn't filled the questionnaire yet
 */
export default function ProjectCompletionQuestionnaireModal({
  project,
  onClose,
  onSubmit,
  onSkip
}) {
  const { t } = useTranslation();
  const [responses, setResponses] = useState({
    overallSatisfaction: 0,
    teamCollaboration: 0,
    projectManagement: 0,
    communicationQuality: 0,
    wouldWorkAgain: null,
    highlights: '',
    improvements: '',
    additionalComments: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const ratingQuestions = [
    { key: 'overallSatisfaction', label: t('projectQuestionnaire.questions.overallSatisfaction') },
    { key: 'teamCollaboration', label: t('projectQuestionnaire.questions.teamCollaboration') },
    { key: 'projectManagement', label: t('projectQuestionnaire.questions.projectManagement') },
    { key: 'communicationQuality', label: t('projectQuestionnaire.questions.communicationQuality') }
  ];

  const handleRatingChange = (key, value) => {
    setResponses(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const handleTextChange = (key, value) => {
    setResponses(prev => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    ratingQuestions.forEach(q => {
      if (!responses[q.key] || responses[q.key] < 1) {
        newErrors[q.key] = t('projectQuestionnaire.errors.ratingRequired');
      }
    });

    if (responses.wouldWorkAgain === null) {
      newErrors.wouldWorkAgain = t('projectQuestionnaire.errors.selectionRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await onSubmit(responses);
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
    // Mark as skipped in localStorage to avoid showing again
    const skippedKey = `questionnaire_skipped_${project._id}`;
    localStorage.setItem(skippedKey, Date.now().toString());
    onSkip?.();
  };

  const RatingStars = ({ value, onChange, error }) => (
    <div>
      <div style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            style={{
              ...styles.starButton,
              color: star <= value ? '#F59E0B' : '#D1D5DB'
            }}
            aria-label={t('projectQuestionnaire.starRating', { rating: star })}
          >
            <Star size={28} fill={star <= value ? '#F59E0B' : 'none'} />
          </button>
        ))}
      </div>
      {error && <span style={styles.errorText}>{error}</span>}
    </div>
  );

  return (
    <div style={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="questionnaire-title">
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerIcon}>
            <ClipboardList size={24} color="#6366F1" />
          </div>
          <div style={styles.headerText}>
            <h2 id="questionnaire-title" style={styles.title}>
              {t('projectQuestionnaire.title')}
            </h2>
            <p style={styles.subtitle}>
              {t('projectQuestionnaire.subtitle', { projectName: project.projectName })}
            </p>
          </div>
          <button style={styles.closeButton} onClick={onClose} aria-label={t('common.close')}>
            <X size={20} />
          </button>
        </div>

        {/* Info Banner */}
        <div style={styles.infoBanner}>
          <AlertCircle size={18} color="#6366F1" />
          <span>{t('projectQuestionnaire.infoBanner')}</span>
        </div>

        {/* Form Content */}
        <div style={styles.content}>
          {/* Rating Questions */}
          {ratingQuestions.map(question => (
            <div key={question.key} style={styles.questionGroup}>
              <label style={styles.questionLabel}>{question.label}</label>
              <RatingStars
                value={responses[question.key]}
                onChange={(val) => handleRatingChange(question.key, val)}
                error={errors[question.key]}
              />
            </div>
          ))}

          {/* Would Work Again */}
          <div style={styles.questionGroup}>
            <label style={styles.questionLabel} id="wouldWorkAgain-label">
              {t('projectQuestionnaire.questions.wouldWorkAgain')}
            </label>
            <div style={styles.radioGroup} role="radiogroup" aria-labelledby="wouldWorkAgain-label">
              {['yes', 'maybe', 'no'].map(option => (
                <label key={option} style={styles.radioLabel} htmlFor={`wouldWorkAgain-${option}`}>
                  <input
                    type="radio"
                    name="wouldWorkAgain"
                    id={`wouldWorkAgain-${option}`}
                    checked={responses.wouldWorkAgain === option}
                    onChange={() => handleRatingChange('wouldWorkAgain', option)}
                    style={styles.radioInput}
                    aria-checked={responses.wouldWorkAgain === option}
                  />
                  <span style={{
                    ...styles.radioButton,
                    ...(responses.wouldWorkAgain === option && styles.radioButtonSelected)
                  }}>
                    {t(`projectQuestionnaire.options.${option}`)}
                  </span>
                </label>
              ))}
            </div>
            {errors.wouldWorkAgain && (
              <span id="wouldWorkAgain-error" style={styles.errorText} role="alert" aria-live="polite">{errors.wouldWorkAgain}</span>
            )}
          </div>

          {/* Text Questions */}
          <div style={styles.questionGroup}>
            <label style={styles.questionLabel} htmlFor="questionnaire-highlights">
              {t('projectQuestionnaire.questions.highlights')}
              <span style={styles.optional}> ({t('common.optional')})</span>
            </label>
            <textarea
              id="questionnaire-highlights"
              value={responses.highlights}
              onChange={(e) => handleTextChange('highlights', e.target.value)}
              placeholder={t('projectQuestionnaire.placeholders.highlights')}
              style={styles.textarea}
              rows={3}
            />
          </div>

          <div style={styles.questionGroup}>
            <label style={styles.questionLabel} htmlFor="questionnaire-improvements">
              {t('projectQuestionnaire.questions.improvements')}
              <span style={styles.optional}> ({t('common.optional')})</span>
            </label>
            <textarea
              id="questionnaire-improvements"
              value={responses.improvements}
              onChange={(e) => handleTextChange('improvements', e.target.value)}
              placeholder={t('projectQuestionnaire.placeholders.improvements')}
              style={styles.textarea}
              rows={3}
            />
          </div>

          <div style={styles.questionGroup}>
            <label style={styles.questionLabel} htmlFor="questionnaire-additionalComments">
              {t('projectQuestionnaire.questions.additionalComments')}
              <span style={styles.optional}> ({t('common.optional')})</span>
            </label>
            <textarea
              id="questionnaire-additionalComments"
              value={responses.additionalComments}
              onChange={(e) => handleTextChange('additionalComments', e.target.value)}
              placeholder={t('projectQuestionnaire.placeholders.additionalComments')}
              style={styles.textarea}
              rows={3}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <SecondaryButton onClick={handleSkip} disabled={submitting}>
            {t('projectQuestionnaire.skipForNow')}
          </SecondaryButton>
          <PrimaryButton 
            onClick={handleSubmit} 
            disabled={submitting}
            leftIcon={<Send size={16} />}
          >
            {submitting ? t('common.submitting') : t('projectQuestionnaire.submit')}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 23, 42, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  },
  modal: {
    background: 'white',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '640px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 48px rgba(15, 23, 42, 0.25)'
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    padding: '28px 28px 20px',
    borderBottom: '1px solid #E5E7EB'
  },
  headerIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: '#EEF2FF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  headerText: {
    flex: 1
  },
  title: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#111',
    margin: 0
  },
  subtitle: {
    fontSize: '14px',
    color: '#6B7280',
    margin: '4px 0 0'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    padding: '8px',
    cursor: 'pointer',
    color: '#9CA3AF',
    borderRadius: '8px',
    transition: 'all 0.2s'
  },
  infoBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 28px',
    background: '#EEF2FF',
    fontSize: '14px',
    color: '#4338CA'
  },
  content: {
    padding: '28px',
    overflowY: 'auto',
    flex: 1
  },
  questionGroup: {
    marginBottom: '28px'
  },
  questionLabel: {
    display: 'block',
    fontSize: '15px',
    fontWeight: '600',
    color: '#111',
    marginBottom: '12px'
  },
  optional: {
    fontWeight: '400',
    color: '#9CA3AF'
  },
  starsContainer: {
    display: 'flex',
    gap: '8px',
    marginBottom: '4px'
  },
  starButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    transition: 'transform 0.15s'
  },
  radioGroup: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  radioLabel: {
    cursor: 'pointer'
  },
  radioInput: {
    position: 'absolute',
    opacity: 0,
    width: 0,
    height: 0
  },
  radioButton: {
    display: 'inline-block',
    padding: '10px 20px',
    borderRadius: '8px',
    border: '2px solid #E5E7EB',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    transition: 'all 0.2s'
  },
  radioButtonSelected: {
    borderColor: '#6366F1',
    background: '#EEF2FF',
    color: '#4338CA'
  },
  textarea: {
    width: '100%',
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid #E5E7EB',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box'
  },
  errorText: {
    display: 'block',
    fontSize: '13px',
    color: '#DC2626',
    marginTop: '6px'
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    padding: '16px 24px',
    borderTop: '1px solid #E5E7EB',
    background: '#F9FAFB',
    borderRadius: '0 0 16px 16px'
  }
};
