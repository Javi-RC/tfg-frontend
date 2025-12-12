import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { getQuestions, submitResponses, getMyProfile, hasProfile } from '../api/bfi44';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';

/**
 * Likert scale labels
 */
const SCALE_LABELS = {
  1: 'Disagree strongly',
  2: 'Disagree a little',
  3: 'Neither agree nor disagree',
  4: 'Agree a little',
  5: 'Agree strongly'
};

/**
 * Factor display configuration
 */
const FACTOR_CONFIG = {
  Extraversion: { 
    color: '#3b82f6', 
    icon: '🗣️', 
    description: 'Sociability, assertiveness, positive emotions',
    interpretation: {
      low: 'Introverted, reserved, prefers solitude',
      medium: 'Balanced social engagement',
      high: 'Extroverted, sociable, enjoys interaction'
    }
  },
  Agreeableness: { 
    color: '#10b981', 
    icon: '🤝', 
    description: 'Cooperation, trust, empathy',
    interpretation: {
      low: 'Independent, competitive, critical',
      medium: 'Balanced interpersonal approach',
      high: 'Cooperative, empathetic, altruistic'
    }
  },
  Conscientiousness: { 
    color: '#8b5cf6', 
    icon: '🎯', 
    description: 'Organization, dependability, self-discipline',
    interpretation: {
      low: 'Spontaneous, disorganized, flexible',
      medium: 'Balanced approach to structure',
      high: 'Organized, disciplined, reliable'
    }
  },
  Neuroticism: { 
    color: '#ef4444', 
    icon: '😰', 
    description: 'Emotional instability, anxiety, moodiness',
    interpretation: {
      low: 'Emotionally stable, resilient',
      medium: 'Balanced emotional responsiveness',
      high: 'Prone to anxiety, emotional reactivity'
    }
  },
  Openness: { 
    color: '#f59e0b', 
    icon: '🎨', 
    description: 'Creativity, curiosity, openness to experience',
    interpretation: {
      low: 'Practical, traditional, conventional',
      medium: 'Balanced openness to experience',
      high: 'Creative, curious, intellectually adventurous'
    }
  }
};

/**
 * BFI-44 Page Component
 * Displays the Big Five Inventory questionnaire and results
 */
export default function BFI44Page() {
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
      setError(`Please answer all questions. You have answered ${answeredCount} of 44.`);
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
      setError(err.response?.data?.error || 'Error submitting questionnaire');
    } finally {
      setSubmitting(false);
    }
  };

  const getProgressPercentage = () => {
    return Math.round((Object.keys(responses).length / 44) * 100);
  };

  const getCurrentPageQuestions = () => {
    const start = currentPage * QUESTIONS_PER_PAGE;
    const end = start + QUESTIONS_PER_PAGE;
    return questions.slice(start, end);
  };

  const canGoNext = () => {
    const pageQuestions = getCurrentPageQuestions();
    return pageQuestions.every(q => responses[q.id] !== undefined);
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

  const getInterpretation = (factor, score) => {
    const config = FACTOR_CONFIG[factor];
    const maxScore = factor === 'Openness' ? 50 : (factor === 'Extraversion' || factor === 'Neuroticism' ? 40 : 45);
    const percentage = score / maxScore;
    
    if (percentage < 0.4) return config.interpretation.low;
    if (percentage > 0.65) return config.interpretation.high;
    return config.interpretation.medium;
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

  const prepareRadarData = () => {
    if (!results) return [];
    
    return [
      {
        factor: 'Extraversion',
        value: results.Extraversion || 0,
        maxScore: 40,
        fill: '#3b82f6'
      },
      {
        factor: 'Agreeableness',
        value: results.Agreeableness || 0,
        maxScore: 45,
        fill: '#10b981'
      },
      {
        factor: 'Conscientiousness',
        value: results.Conscientiousness || 0,
        maxScore: 45,
        fill: '#8b5cf6'
      },
      {
        factor: 'Neuroticism',
        value: results.Neuroticism || 0,
        maxScore: 40,
        fill: '#ef4444'
      },
      {
        factor: 'Openness',
        value: results.Openness || 0,
        maxScore: 50,
        fill: '#f59e0b'
      }
    ];
  };

  // Loading state
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingWrapper}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Loading personality assessment...</p>
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
            <h1 style={styles.title}>✨ Your Personality Profile</h1>
            <p style={styles.subtitle}>Big Five Inventory Results (BFI-44)</p>
            {completedAt && (
              <p style={styles.completedDate}>
                ✓ Completed on {new Date(completedAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            )}
          </div>

          {/* Two Column Layout: Factors Left, Radar Right */}
          <div style={styles.resultsLayout}>
            {/* Left Column: Factor Cards */}
            <div style={styles.factorsColumn}>
              {Object.entries(results).map(([factor, score], index) => {
                const config = FACTOR_CONFIG[factor] || { color: '#666', icon: '📊', description: '', interpretation: {} };
                const maxScore = factor === 'Openness' ? 50 : (factor === 'Extraversion' || factor === 'Neuroticism' ? 40 : 45);
                const percentage = Math.round((score / maxScore) * 100);
                const interpretation = getInterpretation(factor, score);

                return (
                  <div key={factor} style={{...styles.factorCard, animation: `slideIn 0.5s ease forwards ${index * 0.1}s`, opacity: 0, borderTopColor: config.color}}>
                    <div style={styles.factorHeader}>
                      <span style={styles.factorIcon}>{config.icon}</span>
                      <div style={{ flex: 1 }}>
                        <h3 style={{...styles.factorName, color: config.color}}>{factor}</h3>
                        <p style={styles.factorDescription}>{config.description}</p>
                      </div>
                    </div>
                    
                    <div style={styles.scoreWrapper}>
                      <div style={styles.progressBar}>
                        <div
                          style={{
                            ...styles.progressFill,
                            width: `${percentage}%`,
                            background: `linear-gradient(90deg, ${config.color}, ${config.color}dd)`
                          }}
                        />
                      </div>
                      <div style={styles.scoreInfo}>
                        <span style={{ ...styles.scoreValue, color: config.color }}>{score}</span>
                        <span style={styles.scoreMax}>/{maxScore}</span>
                      </div>
                    </div>

                    <div style={{...styles.interpretationBox, borderLeftColor: config.color, background: `${config.color}08`}}>
                      <p style={styles.interpretationText}>💡 {interpretation}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Radar Chart */}
            <div style={styles.radarColumn}>
              <div style={styles.radarCard}>
                <h2 style={styles.radarTitle}>📊 Visual Overview</h2>
                <p style={styles.radarSubtitle}>Your personality across five dimensions</p>
                <div style={styles.radarContainer}>
                  <ResponsiveContainer width="100%" height={500}>
                    <RadarChart data={prepareRadarData()} cx="50%" cy="50%" outerRadius="70%">
                      <PolarGrid stroke="#cbd5e0" strokeDasharray="3 3" />
                      <PolarAngleAxis 
                        dataKey="factor" 
                        tick={{ fontSize: 12, fill: '#1a1a1a', fontWeight: '600' }}
                        tickLine={false}
                      />
                      <PolarRadiusAxis 
                        angle={90}
                        domain={[0, 50]}
                        tick={{ fontSize: 11, fill: '#666' }}
                        axisLine={false}
                      />
                      <Radar 
                        name="Your Score" 
                        dataKey="value" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        fill="#3b82f6" 
                        fillOpacity={0.3}
                      />
                      <Tooltip 
                        contentStyle={{
                          background: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                          padding: '12px 16px'
                        }}
                        formatter={(value, name, props) => {
                          const maxScore = props.payload.maxScore;
                          return [`${value} / ${maxScore}`, 'Score'];
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div style={styles.radarLegend}>
                  <div style={styles.legendItem}>
                    <div style={styles.legendDot} />
                    <span style={styles.legendText}>Larger area = Higher scores across traits</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={styles.actionsRow}>
            <PrimaryButton onClick={retakeQuestionnaire} style={{ minWidth: '200px' }}>
              🔄 Retake Assessment
            </PrimaryButton>
            <SecondaryButton onClick={() => navigate('/')} style={{ minWidth: '200px' }}>
              ← Back to Profile
            </SecondaryButton>
          </div>
        </div>
      </div>
    );
  }

  // Questionnaire view
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.headerCard}>
          <h1 style={styles.title}>Big Five Inventory</h1>
          <p style={styles.subtitle}>
            Please rate each statement based on how well it describes you.
          </p>
          
          {/* Progress bar */}
          <div style={styles.progressSection}>
            <div style={styles.progressInfo}>
              <span>Progress: {getProgressPercentage()}%</span>
              <span>{Object.keys(responses).length} of 44 answered</span>
            </div>
            <div style={styles.mainProgressBar}>
              <div
                style={{
                  ...styles.mainProgressFill,
                  width: `${getProgressPercentage()}%`
                }}
              />
            </div>
          </div>
        </div>

        {error && (
          <div style={styles.errorBanner}>
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
          <div style={styles.pageIndicator}>
            Page {currentPage + 1} of {totalPages}
          </div>

          {getCurrentPageQuestions().map((question, index) => (
            <div key={question.id} style={styles.questionCard}>
              <div style={styles.questionHeader}>
                <span style={styles.questionNumber}>{question.id}.</span>
                <span style={styles.questionText}>I see myself as someone who {question.text.toLowerCase()}</span>
              </div>
              <div style={styles.optionsRow}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <div key={value} style={styles.optionWrapper}>
                    <button
                      type="button"
                      onClick={() => handleResponseChange(question.id, value)}
                      style={{
                        ...styles.optionButton,
                        ...(responses[question.id] === value ? styles.optionButtonSelected : {})
                      }}
                      aria-label={`${SCALE_LABELS[value]} - ${value}`}
                    >
                      {value}
                    </button>
                    <span style={styles.optionLabel}>{SCALE_LABELS[value]}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div style={styles.navigationRow}>
          <SecondaryButton
            onClick={goToPrevPage}
            disabled={currentPage === 0}
            style={{ opacity: currentPage === 0 ? 0.5 : 1 }}
          >
            Previous
          </SecondaryButton>

          {currentPage === totalPages - 1 ? (
            <PrimaryButton
              onClick={handleSubmit}
              disabled={submitting || Object.keys(responses).length < 44}
            >
              {submitting ? 'Submitting...' : 'Submit Questionnaire'}
            </PrimaryButton>
          ) : (
            <PrimaryButton
              onClick={goToNextPage}
              disabled={!canGoNext()}
            >
              Next
            </PrimaryButton>
          )}
        </div>
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
  },
  progressSection: {
    marginTop: '16px'
  },
  progressInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px'
  },
  mainProgressBar: {
    height: '8px',
    background: '#e2e8f0',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  mainProgressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
    borderRadius: '4px',
    transition: 'width 0.3s ease'
  },
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
  questionCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px 24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
  },
  questionHeader: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px'
  },
  questionNumber: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#3b82f6',
    minWidth: '28px'
  },
  questionText: {
    fontSize: '15px',
    color: '#1a1a1a',
    lineHeight: '1.5'
  },
  optionsRow: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center'
  },
  optionWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px'
  },
  optionLabel: {
    fontSize: '11px',
    color: '#666',
    textAlign: 'center',
    maxWidth: '48px',
    lineHeight: '1.2'
  },
  optionButton: {
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f7fafc',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#4a5568',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  optionButtonSelected: {
    background: '#3b82f6',
    borderColor: '#3b82f6',
    color: 'white'
  },
  navigationRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '32px',
    gap: '16px'
  },
  resultsLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr 500px',
    gap: '32px',
    marginBottom: '40px',
    alignItems: 'start',
    '@media (max-width: 1200px)': {
      gridTemplateColumns: '1fr',
      gap: '24px'
    }
  },
  factorsColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  radarColumn: {
    position: 'sticky',
    top: '120px',
    '@media (max-width: 1200px)': {
      position: 'relative',
      top: 0
    }
  },
  factorCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '26px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
    borderTop: '4px solid',
    transition: 'all 0.3s ease',
    cursor: 'default'
  },
  factorHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    marginBottom: '20px'
  },
  factorIcon: {
    fontSize: '32px',
    lineHeight: 1
  },
  factorName: {
    fontSize: '20px',
    fontWeight: '700',
    margin: 0,
    marginBottom: '6px'
  },
  factorDescription: {
    fontSize: '13px',
    color: '#64748b',
    lineHeight: '1.5',
    margin: 0
  },
  scoreWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
    marginBottom: '16px'
  },
  progressBar: {
    flex: 1,
    height: '12px',
    background: '#e2e8f0',
    borderRadius: '6px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: '6px',
    transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  scoreInfo: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
    minWidth: '75px'
  },
  scoreValue: {
    fontSize: '24px',
    fontWeight: '800'
  },
  scoreMax: {
    fontSize: '15px',
    color: '#94a3b8',
    fontWeight: '600'
  },
  interpretationBox: {
    padding: '14px 18px',
    borderRadius: '10px',
    borderLeft: '4px solid'
  },
  interpretationText: {
    fontSize: '14px',
    color: '#475569',
    margin: 0,
    lineHeight: '1.6',
    fontWeight: '500'
  },
  actionsRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '48px',
    marginBottom: '40px',
    flexWrap: 'wrap'
  },
  radarCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '32px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
    border: '1px solid rgba(0,0,0,0.04)'
  },
  radarTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '6px',
    margin: 0
  },
  radarSubtitle: {
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '28px',
    margin: 0
  },
  radarContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    padding: '20px 0',
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    borderRadius: '16px'
  },
  radarLegend: {
    marginTop: '24px',
    padding: '16px',
    background: '#f8fafc',
    borderRadius: '12px',
    textAlign: 'center'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px'
  },
  legendDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: '#3b82f6'
  },
  legendText: {
    fontSize: '13px',
    color: '#475569',
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
