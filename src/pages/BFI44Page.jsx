import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sparkles, CheckCircle } from 'lucide-react';
import { getQuestions, submitResponses, getMyProfile, hasProfile } from '../api/bfi44';
import { ProgressIndicator, BFI44ResultsView, BFI44QuestionnaireView } from '../components/personality';



/**
 * BFI-44 Page Component
 * Displays the Big Five Inventory questionnaire and results
 */
export default function BFI44Page() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [results, setResults] = useState(null);
  const [hasExistingProfile, setHasExistingProfile] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [completedAt, setCompletedAt] = useState(null);

  const QUESTIONS_PER_PAGE = 11;
  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if user already has a profile
      const profileCheck = await hasProfile();
      const userHasProfile = profileCheck.data?.hasProfile;
      setHasExistingProfile(userHasProfile);

      if (userHasProfile) {
        // Load existing results
        const profileRes = await getMyProfile();
        setResults(profileRes.data?.results || profileRes.data);
        setCompletedAt(profileRes.data?.completedAt);
      } else {
        // Load questions for new questionnaire
        const questionsRes = await getQuestions();
        setQuestions(questionsRes.data?.questions || []);
      }
    } catch (err) {
      console.error('Error loading BFI-44 data:', err);
      setError(err.response?.data?.error || 'Error loading questionnaire');
    } finally {
      setLoading(false);
    }
  };

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
    if (error) setError(null);
  };

  const handleSubmit = async () => {
    // Validate all questions answered
    const answeredCount = Object.keys(responses).length;
    if (answeredCount < 44) {
      setError(t('bfi44.pleaseAnswerAllQuestions', { answered: answeredCount, total: 44 }));
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const res = await submitResponses(responses);
      setResults(res.data?.results);
      setCompletedAt(res.data?.completedAt);
      setHasExistingProfile(true);
    } catch (err) {
      console.error('Error submitting BFI-44:', err);
      setError(err.response?.data?.error || t('bfi44.errorSubmittingQuestionnaire'));
    } finally {
      setSubmitting(false);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const retakeQuestionnaire = async () => {
    try {
      setLoading(true);
      // Reload questions for new questionnaire
      const questionsRes = await getQuestions();
      setQuestions(questionsRes.data?.questions || []);
      setResults(null);
      setResponses({});
      setCurrentPage(0);
      setCompletedAt(null);
      setError(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error reloading questionnaire:', err);
      setError('Error reloading questionnaire');
    } finally {
      setLoading(false);
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

  // Results view
  if (results && hasExistingProfile) {
    return (
      <div style={styles.container}>
        <div style={styles.contentWide}>
          {/* Header */}
          <div style={styles.headerCard}>
            <h1 style={{...styles.title, display: 'flex', alignItems: 'center', gap: '8px'}}>
              <Sparkles size={32} />
              {t('bfi44.yourProfile')}
            </h1>
            <p style={styles.subtitle}>{t('bfi44.resultsSubtitle')}</p>
            {completedAt && (
              <p style={{...styles.completedDate, display: 'flex', alignItems: 'center', gap: '6px'}}>
                <CheckCircle size={16} />
                {t('bfi44.completedOn')} {new Date(completedAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
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
          <h1 style={styles.title}>{t('bfi44.bigFiveInventory')}</h1>
          <p style={styles.subtitle}>
            {t('bfi44.rateStatements')}
          </p>
          
          <ProgressIndicator 
            answeredCount={Object.keys(responses).length} 
            totalQuestions={44} 
          />
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
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e8edf2 100%)',
    padding: '104px 20px 40px',
    fontFamily: 'Poppins, Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial'
  },
  content: {
    maxWidth: '1000px',
    margin: '0 auto'
  },
  contentWide: {
    maxWidth: '1400px',
    margin: '0 auto'
  },
  loadingWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh'
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #e2e8f0',
    borderTopColor: '#3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    marginTop: '16px',
    fontSize: '16px',
    color: '#666'
  },
  headerCard: {
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    borderRadius: '16px',
    padding: '40px',
    marginBottom: '36px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
    color: 'white'
  },
  title: {
    fontSize: '38px',
    fontWeight: '700',
    color: 'white',
    marginBottom: '10px',
    margin: 0
  },
  subtitle: {
    fontSize: '17px',
    color: 'rgba(255, 255, 255, 0.95)',
    margin: 0
  },
  completedDate: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
    margin: 0,
    fontWeight: '500'
  }
};

// Add keyframes for spinner animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(styleSheet);
