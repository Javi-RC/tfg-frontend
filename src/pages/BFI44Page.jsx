import React, { useReducer, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sparkles, CheckCircle, Users } from 'lucide-react';
import { getQuestions, submitResponses, getMyProfile, hasProfile } from '../api/bfi44';
import { getBFI44ConsentStatus } from '../api/personalityConsent';
import ProgressIndicator from '../components/personality/ProgressIndicator';
import BFI44ResultsView from '../components/personality/BFI44ResultsView';
import BFI44QuestionnaireView from '../components/personality/BFI44QuestionnaireView';
import ConsentStatusBadge from '../components/personality/ConsentStatusBadge';
import ConsentGateView from '../components/personality/ConsentGateView';
import PersonalityConsentModal from '../components/personality/PersonalityConsentModal';
import { useAuth } from '../hooks/useAuth';

const initialState = {
  loading: true,
  submitting: false,
  error: null,
  questions: [],
  responses: {},
  results: null,
  hasExistingProfile: false,
  currentPage: 0,
  completedAt: null,
  hasConsent: null,
  showConsentModal: false,
};

function bfi44Reducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_SUBMITTING':
      return { ...state, submitting: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_QUESTIONS':
      return { ...state, questions: action.payload };
    case 'SET_RESPONSE':
      return { ...state, responses: { ...state.responses, [action.questionId]: action.value }, error: null };
    case 'SET_RESULTS':
      return { ...state, results: action.payload };
    case 'SET_HAS_EXISTING_PROFILE':
      return { ...state, hasExistingProfile: action.payload };
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SET_COMPLETED_AT':
      return { ...state, completedAt: action.payload };
    case 'SET_HAS_CONSENT':
      return { ...state, hasConsent: action.payload };
    case 'SET_SHOW_CONSENT_MODAL':
      return { ...state, showConsentModal: action.payload };
    case 'LOAD_INITIAL_DATA':
      return {
        ...state,
        loading: false,
        hasConsent: action.hasConsent,
        hasExistingProfile: action.hasExistingProfile,
        results: action.results || null,
        completedAt: action.completedAt || null,
        questions: action.questions || [],
      };
    case 'SUBMIT_SUCCESS':
      return {
        ...state,
        submitting: false,
        results: action.results,
        completedAt: action.completedAt,
        hasExistingProfile: true,
      };
    case 'RETAKE_RESET':
      return {
        ...state,
        loading: false,
        questions: action.questions,
        results: null,
        responses: {},
        currentPage: 0,
        completedAt: null,
        error: null,
      };
    case 'CONSENT_ACCEPTED':
      return {
        ...state,
        showConsentModal: false,
        hasConsent: true,
        error: null,
        questions: action.questions || state.questions,
      };
    default:
      return state;
  }
}

/**
 * BFI-44 Page Component
 * Displays the Big Five Inventory questionnaire and results
 */
export default function BFI44Page() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const canManageTeam = user?.role === 'org_admin' || user?.isProjectManager === true;
  const [state, dispatch] = useReducer(bfi44Reducer, initialState);

  const { loading, submitting, error, questions, responses, results, hasExistingProfile, currentPage, completedAt, hasConsent, showConsentModal } = state;

  const QUESTIONS_PER_PAGE = 11;
  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);

  useEffect(() => {
    loadInitialData(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadInitialData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const consentRes = await getBFI44ConsentStatus();
      const consentData = consentRes?.data;
      const hasConsentValue = consentData?.hasConsent === true;

      const profileCheck = await hasProfile();
      const userHasProfile = profileCheck.data?.hasProfile;

      let loadedResults = null;
      let loadedCompletedAt = null;
      let loadedQuestions = [];

      if (userHasProfile) {
        const profileRes = await getMyProfile();
        loadedResults = profileRes.data?.results || profileRes.data;
        loadedCompletedAt = profileRes.data?.completedAt;
      } else if (hasConsentValue) {
        const questionsRes = await getQuestions();
        loadedQuestions = questionsRes.data?.questions || [];
      }

      dispatch({
        type: 'LOAD_INITIAL_DATA',
        hasConsent: hasConsentValue,
        hasExistingProfile: userHasProfile,
        results: loadedResults,
        completedAt: loadedCompletedAt,
        questions: loadedQuestions,
      });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.response?.data?.error || t('bfi44.errors.loadError') });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleResponseChange = (questionId, value) => {
    dispatch({ type: 'SET_RESPONSE', questionId, value });
  };

  const handleSubmit = async () => {
    const answeredCount = Object.keys(responses).length;
    if (answeredCount < 44) {
      dispatch({ type: 'SET_ERROR', payload: t('bfi44.pleaseAnswerAllQuestions', { answered: answeredCount, total: 44 }) });
      return;
    }

    try {
      dispatch({ type: 'SET_SUBMITTING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const res = await submitResponses(responses);
      dispatch({
        type: 'SUBMIT_SUCCESS',
        results: res.data?.results,
        completedAt: res.data?.completedAt,
      });
    } catch (err) {
      const errorMsg = err.response?.data?.error;
      if (errorMsg === 'PERSONALITY_CONSENT_REQUIRED') {
        dispatch({ type: 'SET_HAS_CONSENT', payload: false });
        dispatch({ type: 'SET_SHOW_CONSENT_MODAL', payload: true });
        dispatch({ type: 'SET_ERROR', payload: t('personalityConsent.consentRequiredToSubmit') });
      } else {
        dispatch({ type: 'SET_ERROR', payload: err.response?.data?.error || t('bfi44.errorSubmittingQuestionnaire') });
      }
    } finally {
      dispatch({ type: 'SET_SUBMITTING', payload: false });
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      dispatch({ type: 'SET_CURRENT_PAGE', payload: currentPage + 1 });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      dispatch({ type: 'SET_CURRENT_PAGE', payload: currentPage - 1 });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleConsentAccepted = async () => {
    let loadedQuestions = state.questions;

    if (!hasExistingProfile && state.questions.length === 0) {
      try {
        const questionsRes = await getQuestions();
        loadedQuestions = questionsRes.data?.questions || [];
      } catch {
        dispatch({ type: 'SET_ERROR', payload: t('bfi44.errorLoadingQuestionnaire') });
      }
    }

    dispatch({ type: 'CONSENT_ACCEPTED', questions: loadedQuestions });
  };

  const retakeQuestionnaire = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const questionsRes = await getQuestions();
      dispatch({ type: 'RETAKE_RESET', questions: questionsRes.data?.questions || [] });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      dispatch({ type: 'SET_ERROR', payload: t('bfi44.errors.reloadError') });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingWrapper}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>{t('bfi44.loading')}</p>
        </div>
      </div>
    );
  }

  // Consent required — show consent gate
  if (hasConsent === false && !hasExistingProfile) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <ConsentGateView onShowConsentModal={() => dispatch({ type: 'SET_SHOW_CONSENT_MODAL', payload: true })} />
        </div>

        <PersonalityConsentModal
          key={showConsentModal ? 'open' : 'closed'}
          show={showConsentModal}
          onClose={() => dispatch({ type: 'SET_SHOW_CONSENT_MODAL', payload: false })}
          onAccepted={handleConsentAccepted}
        />
      </div>
    );
  }

  // Results view
  if (results && hasExistingProfile) {
    return (
      <div style={styles.container}>
        <div style={styles.contentWide}>
          {/* Header */}
          <div style={styles.headerCard}>
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
            >
              <h1 style={{ ...styles.title, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={32} />
                {t('bfi44.yourProfile')}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {canManageTeam && (
                  <button
                    type="button"
                    onClick={() => navigate('/bfi-44/admin')}
                    style={styles.adminLinkButton}
                    aria-label={t('bfi44.goToAdminPanel')}
                  >
                    <Users size={16} />
                    {t('bfi44.adminPanel')}
                  </button>
                )}
                <ConsentStatusBadge hasConsent={hasConsent} />
              </div>
            </div>
            <p style={styles.subtitle}>{t('bfi44.resultsSubtitle')}</p>
            {completedAt && (
              <p
                style={{
                  ...styles.completedDate,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <CheckCircle size={16} />
                {t('bfi44.completedOn')}{' '}
                {new Date(completedAt).toLocaleDateString(i18n.language, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            )}
          </div>

          <BFI44ResultsView
            results={results}
            onRetake={retakeQuestionnaire}
            onNavigateBack={() => navigate('/')}
          />
        </div>
      </div>
    );
  }

  // Questionnaire view
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.headerCard}>
          <div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
          >
            <h1 style={styles.title}>{t('bfi44.bigFiveInventory')}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {canManageTeam && (
                <button
                  type="button"
                  onClick={() => navigate('/bfi-44/admin')}
                  style={styles.adminLinkButton}
                  aria-label={t('bfi44.goToAdminPanel')}
                >
                  <Users size={16} />
                  {t('bfi44.adminPanel')}
                </button>
              )}
              <ConsentStatusBadge
                hasConsent={hasConsent}
                onClick={() => dispatch({ type: 'SET_SHOW_CONSENT_MODAL', payload: true })}
              />
            </div>
          </div>
          <p style={styles.subtitle}>{t('bfi44.rateStatements')}</p>

          <ProgressIndicator answeredCount={Object.keys(responses).length} totalQuestions={44} />
        </div>

        <BFI44QuestionnaireView
          questions={questions}
          responses={responses}
          onResponseChange={handleResponseChange}
          currentPage={currentPage}
          onNextPage={goToNextPage}
          onPrevPage={goToPrevPage}
          onSubmit={handleSubmit}
          submitting={submitting}
          error={error}
          questionsPerPage={QUESTIONS_PER_PAGE}
        />
      </div>

      <PersonalityConsentModal
        key={showConsentModal ? 'open' : 'closed'}
        show={showConsentModal}
        onClose={() => dispatch({ type: 'SET_SHOW_CONSENT_MODAL', payload: false })}
        onAccepted={handleConsentAccepted}
      />
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'var(--gradient-page)',
    padding: '104px 20px 40px',
    fontFamily:
      'Poppins, Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
  },
  content: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  contentWide: {
    maxWidth: '1400px',
    margin: '0 auto',
  },
  loadingWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid var(--color-primary-track)',
    borderTopColor: 'var(--color-primary)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '16px',
    fontSize: '16px',
    color: 'var(--color-text-muted)',
  },
  headerCard: {
    background: 'var(--gradient-primary)',
    borderRadius: '18px',
    padding: '40px',
    marginBottom: '36px',
    boxShadow: 'var(--shadow-primary)',
    color: 'white',
  },
  title: {
    fontSize: '38px',
    fontWeight: '700',
    color: 'white',
    marginBottom: '10px',
    margin: 0,
  },
  subtitle: {
    fontSize: '17px',
    color: 'rgba(255, 255, 255, 0.95)',
    margin: 0,
  },
  completedDate: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
    margin: 0,
    fontWeight: '500',
  },
  consentGateCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '40px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    border: '1px solid var(--color-border)',
  },
  consentGateText: {
    fontSize: '16px',
    color: 'var(--color-text-secondary)',
    marginBottom: '24px',
    lineHeight: '1.6',
  },
  consentGateButton: {
    background: 'var(--color-primary)',
    color: 'white',
    borderRadius: '32px',
    padding: '14px 40px',
    fontWeight: '600',
    fontSize: '15px',
    border: 'none',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-primary-sm)',
  },
  adminLinkButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(255, 255, 255, 0.15)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },
};

// `spin` and `slideIn` are declared once in src/index.css. They used to be
// injected into <head> from this module, which meant importing the page had the
// side effect of mutating the document.
