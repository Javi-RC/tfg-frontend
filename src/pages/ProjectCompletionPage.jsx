import React, { useReducer, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, ArrowLeft, Save, X, Network, List, Info } from 'lucide-react';
import { showError } from '../utils/toast';
import { getOutcomeFormData } from '../api/riskService';
import { markRiskOccurred, markRiskAvoided, submitProjectOutcome } from '../api/manualRisks';
import RisksSection from '../components/outcome/RisksSection';
import ResultsModal from '../components/outcome/ResultsModal';
import RiskFlowMap from '../components/outcome/RiskFlowMap';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';

const initialFormState = {
  completed: true,
  actualCompletedDate: new Date().toISOString(),
  budgetOverrun: 0,
  qualityScore: 3,
  clientSatisfaction: 3,
  teamMorale: 3,
  actualizedRisks: [],
  lessonsLearned: [],
  successfulPractices: [],
  unsuccessfulPractices: [],
  metrics: {},
};

const initialState = {
  loading: true,
  submitting: false,
  error: null,
  projectData: null,
  predictedRisks: [],
  manualRisks: [],
  formData: initialFormState,
  showResults: false,
  outcomeResult: null,
  riskViewMode: 'list',
};

function completionReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_SUBMITTING':
      return { ...state, submitting: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_PROJECT_DATA':
      return { ...state, projectData: action.payload };
    case 'SET_PREDICTED_RISKS':
      return { ...state, predictedRisks: action.payload };
    case 'SET_MANUAL_RISKS':
      return { ...state, manualRisks: action.payload };
    case 'SET_FORM_DATA':
      return { ...state, formData: typeof action.payload === 'function' ? action.payload(state.formData) : { ...state.formData, ...action.payload } };
    case 'SET_RISK_VIEW_MODE':
      return { ...state, riskViewMode: action.payload };
    case 'SET_SHOW_RESULTS':
      return { ...state, showResults: action.payload };
    case 'SUBMIT_SUCCESS':
      return { ...state, submitting: false, outcomeResult: action.payload, showResults: true };
    case 'LOAD_SUCCESS':
      return {
        ...state,
        loading: false,
        projectData: action.projectData,
        predictedRisks: action.predictedRisks,
        manualRisks: action.manualRisks,
        formData: { ...state.formData, actualizedRisks: action.actualizedRisks },
      };
    case 'LOAD_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

function validateForm() {
  return true;
}

/**
 * Project Completion Page
 * Allows Project Managers to capture project outcomes for CBR learning
 */
export default function ProjectCompletionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [state, dispatch] = useReducer(completionReducer, initialState);

  const { loading, submitting, error, projectData, predictedRisks, manualRisks, formData, showResults, outcomeResult, riskViewMode } = state;

  useEffect(() => {
    loadFormData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadFormData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await getOutcomeFormData(id);
      const data = response.data?.success ? response.data.data : response.data;

      let projectInfo = data.projectInfo || data.project;

      if (!projectInfo?.status) {
        const { getProjectById } = await import('../api/projects');
        const projectResponse = await getProjectById(id);
        const fetchedProjectData = projectResponse.data?.success
          ? projectResponse.data.data
          : projectResponse.data;
        projectInfo = fetchedProjectData;
      }

      if (projectInfo?.status !== 'completed') {
        dispatch({
          type: 'LOAD_ERROR',
          payload: t('projects.completionPage.errors.statusNotCompleted', {
            status: projectInfo?.status || t('common.notAvailable'),
          }),
        });
        return;
      }

      if (projectInfo?.hasOutcome || projectInfo?.projectOutcome?.completed) {
        dispatch({ type: 'LOAD_ERROR', payload: t('projects.completionPage.errors.outcomeAlreadyCaptured') });
        return;
      }

      const predRisks = data.predictedRisks || [];
      const manRisks = data.manualRisks || [];

      const initialRisks = predRisks.map((risk, index) => ({
        riskId: String(risk?._id ?? risk?.id ?? (risk?.type ? `${risk.type}-${index}` : index)),
        type: risk.type,
        occurred: undefined,
        severity: risk.severity,
        source: risk.source || 'predicted',
      }));

      const manualRiskEntries = manRisks.map((risk, index) => ({
        riskId: String(risk?._id ?? risk?.id ?? `manual-${index}`),
        type: risk.type,
        occurred: undefined,
        severity: risk.severity,
        source: 'manual',
        description: risk.description,
      }));

      const allInitialRisks = [...initialRisks, ...manualRiskEntries];

      dispatch({
        type: 'LOAD_SUCCESS',
        projectData: projectInfo,
        predictedRisks: predRisks,
        manualRisks: manRisks,
        actualizedRisks: allInitialRisks,
      });
    } catch (err) {
      console.error('Error loading form data:', err);
      dispatch({ type: 'LOAD_ERROR', payload: err.response?.data?.error || t('projects.completionPage.errors.loadFailed') });
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      dispatch({ type: 'SET_SUBMITTING', payload: true });

      const risksToUpdate = (formData.actualizedRisks || []).filter((risk) => {
        return risk.occurred !== undefined && risk.occurred !== null;
      });

      const normalizeList = (list) => {
        if (!Array.isArray(list)) return undefined;
        const normalized = list.flatMap((v) => {
          const s = String(v ?? '').trim();
          return s.length > 0 ? [s] : [];
        });
        return normalized.length > 0 ? normalized : undefined;
      };

      const buildOccurredDetails = (risk) => {
        const details = {
          title: risk.title ? String(risk.title).trim() : undefined,
          description: risk.description ? String(risk.description).trim() : undefined,
          severity: risk.severity ? String(risk.severity) : undefined,
          rootCause: risk.rootCause ? String(risk.rootCause).trim() : undefined,
          recommendations: normalizeList(risk.recommendations),
          indicators: normalizeList(risk.indicators),
        };

        for (const key of Object.keys(details)) {
          if (details[key] === undefined) delete details[key];
        }
        return details;
      };

      const riskUpdatePromises = risksToUpdate.map(async (risk) => {
        try {
          const predictedRisk = predictedRisks.find(
            (r) => String(r.id || r._id) === String(risk.riskId)
          );
          const manualRisk = manualRisks.find((r) => String(r.id || r._id) === String(risk.riskId));
          const actualRiskId = predictedRisk?._id || manualRisk?._id || risk.riskId;

          if (risk.occurred === true) {
            const details = buildOccurredDetails(risk);
            return await markRiskOccurred(id, actualRiskId, details);
          }

          return await markRiskAvoided(id, actualRiskId);
        } catch (err) {
          console.error('Error updating risk:', risk.riskId, err);
          throw err;
        }
      });

      await Promise.all(riskUpdatePromises);

      // Capture the outcome itself. This is what persists project.projectOutcome,
      // reconciles the risk predictions and retains the project as a CBR case,
      // so it must run after every individual risk has been marked.
      const outcomeResponse = await submitProjectOutcome(id, formData);
      const result = outcomeResponse.data;

      // ResultsModal renders nothing without both fields; fall back to navigating
      // away so the user is never left on a page with no way forward.
      if (result?.data?.predictionAccuracy && result?.data?.learningReport) {
        dispatch({ type: 'SUBMIT_SUCCESS', payload: result });
      } else {
        navigate(`/projects/${id}`);
      }
    } catch (err) {
      console.error('Error submitting outcome:', err);
      showError(err.response?.data?.error || t('projects.completionPage.errors.captureFailed'));
    } finally {
      dispatch({ type: 'SET_SUBMITTING', payload: false });
    }
  };

  const handleCloseResults = () => {
    dispatch({ type: 'SET_SHOW_RESULTS', payload: false });
    navigate(`/projects/${id}`);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>{t('projects.completionPage.loadingProjectData')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}>
            <AlertTriangle size={64} color="#dc2626" />
          </div>
          <h2 style={styles.errorTitle}>{t('common.error')}</h2>
          <p style={styles.errorMessage}>{error}</p>
          <SecondaryButton onClick={() => navigate('/projects')} leftIcon={<ArrowLeft size={16} />}>
            {t('projects.backToProjects')}
          </SecondaryButton>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            {t('projects.completionPage.title', {
              name:
                projectData?.projectName ||
                projectData?.name ||
                t('projects.completionPage.projectFallbackName'),
            })}
          </h1>
          <p style={styles.subtitle}>{t('projects.completionPage.subtitle')}</p>
        </div>
      </div>

      {/* Info Banner */}
      <div style={styles.infoBanner}>
        <Info size={20} color="#004085" style={{ flexShrink: 0 }} />
        <div>
          <strong>{t('projects.completionPage.whyImportantTitle')}</strong>
          <p style={styles.infoText}>{t('projects.completionPage.whyImportantText')}</p>
        </div>
      </div>

      {/* Form Content */}
      <div style={styles.content}>
        {/* View Toggle */}
        <div style={styles.viewToggle}>
          <button type="button"
            onClick={() => dispatch({ type: 'SET_RISK_VIEW_MODE', payload: 'list' })}
            style={{
              ...styles.viewButton,
              ...(riskViewMode === 'list' ? styles.viewButtonActive : {}),
            }}
          >
            <List size={18} />
            <span>{t('projects.completionPage.riskView.listView')}</span>
          </button>
          <button type="button"
            onClick={() => dispatch({ type: 'SET_RISK_VIEW_MODE', payload: 'flow' })}
            style={{
              ...styles.viewButton,
              ...(riskViewMode === 'flow' ? styles.viewButtonActive : {}),
            }}
          >
            <Network size={18} />
            <span>{t('projects.completionPage.riskView.visualMap')}</span>
          </button>
        </div>

        {/* Conditional Rendering based on view mode */}
        {riskViewMode === 'list' ? (
          <RisksSection
            formData={formData}
            setFormData={(value) => dispatch({ type: 'SET_FORM_DATA', payload: value })}
            predictedRisks={predictedRisks}
            manualRisks={manualRisks}
          />
        ) : (
          <div style={styles.flowContainer}>
            <div style={styles.flowDescription}>
              <AlertTriangle size={20} color="#F59E0B" />
              <span>{t('projects.completionPage.flowHint')}</span>
            </div>
            <RiskFlowMap
              predictedRisks={predictedRisks}
              actualizedRisks={formData.actualizedRisks}
              projectName={
                projectData?.projectName || t('projects.completionPage.projectFallbackName')
              }
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={styles.navigation}>
        <div style={styles.navLeft} />

        <div style={styles.navRight}>
          <SecondaryButton onClick={() => navigate('/projects')} leftIcon={<X size={16} />}>
            {t('common.cancel')}
          </SecondaryButton>

          <PrimaryButton onClick={handleSubmit} disabled={submitting} leftIcon={<Save size={16} />}>
            {submitting ? t('common.saving') : t('projects.completionPage.saveAndLearn')}
          </PrimaryButton>
        </div>
      </div>

      {/* Results Modal */}
      <ResultsModal show={showResults} results={outcomeResult} onClose={handleCloseResults} />

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '100px 20px 40px 20px',
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '80px 20px',
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid var(--color-border)',
    borderTop: '4px solid var(--color-primary)',
    borderRadius: '50%',
    margin: '0 auto 16px',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    fontSize: '16px',
    color: 'var(--color-text-muted)',
  },
  errorContainer: {
    textAlign: 'center',
    padding: '80px 20px',
  },
  errorIcon: {
    fontSize: '64px',
    marginBottom: '16px',
  },
  errorTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--color-text-heading)',
    marginBottom: '8px',
  },
  errorMessage: {
    fontSize: '16px',
    color: 'var(--color-text-muted)',
    marginBottom: '24px',
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: 'var(--color-text-heading)',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: 'var(--color-text-muted)',
    marginBottom: '0',
  },
  infoBanner: {
    display: 'flex',
    gap: '16px',
    padding: '20px 24px',
    background: '#EFF6FF',
    border: '1px solid #BFDBFE',
    borderRadius: '12px',
    marginBottom: '32px',
  },
  infoIcon: {
    fontSize: '24px',
    flexShrink: 0,
  },
  infoText: {
    fontSize: '14px',
    color: '#1E40AF',
    margin: '4px 0 0 0',
  },
  stepsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    padding: '0 20px',
  },
  step: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
    opacity: 0.5,
    transition: 'opacity 0.3s',
  },
  stepActive: {
    opacity: 1,
  },
  stepCompleted: {
    opacity: 1,
  },
  stepIcon: {
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--color-bg-subtle)',
    borderRadius: '50%',
    fontSize: '20px',
    fontWeight: '600',
    border: '2px solid transparent',
  },
  stepText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  stepNumber: {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
    fontWeight: '500',
  },
  stepTitle: {
    fontSize: '14px',
    color: 'var(--color-text-heading)',
    fontWeight: '600',
  },
  stepConnector: {
    flex: 1,
    height: '2px',
    background: 'var(--color-border)',
    margin: '0 16px',
  },
  stepConnectorCompleted: {
    background: 'var(--color-success)',
  },
  content: {
    marginBottom: '32px',
  },
  viewToggle: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    padding: '4px',
    background: 'var(--color-bg-subtle)',
    borderRadius: '8px',
    width: 'fit-content',
  },
  viewButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    border: 'none',
    background: 'transparent',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--color-text-muted)',
    transition: 'all 0.2s ease',
  },
  viewButtonActive: {
    background: 'white',
    color: 'var(--color-primary)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  flowContainer: {
    marginTop: '16px',
  },
  flowDescription: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    background: '#FFFBEB',
    border: '1px solid #FCD34D',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
    color: 'var(--color-warning-dark)',
  },
  navigation: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    background: '#FFFFFF',
    borderRadius: '8px',
    border: '1px solid var(--color-border)',
    position: 'sticky',
    bottom: '20px',
    boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  navLeft: {
    display: 'flex',
    gap: '12px',
  },
  navRight: {
    display: 'flex',
    gap: '12px',
  },
};
