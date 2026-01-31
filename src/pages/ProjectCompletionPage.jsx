import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Save, X, Network, List, Info } from 'lucide-react';
import { getOutcomeFormData } from '../api/riskService';
import { markRiskOccurred, markRiskAvoided } from '../api/manualRisks';
import RisksSection from '../components/outcome/RisksSection';
import ResultsModal from '../components/outcome/ResultsModal';
import RiskFlowMap from '../components/outcome/RiskFlowMap';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';

/**
 * Project Completion Page
 * Allows Project Managers to capture project outcomes for CBR learning
 */
export default function ProjectCompletionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const [projectData, setProjectData] = useState(null);
  const [predictedRisks, setPredictedRisks] = useState([]);
  const [manualRisks, setManualRisks] = useState([]);
  
  const [formData, setFormData] = useState({
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
    metrics: {}
  });
  
  const [, setErrors] = useState({});
  const [results] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [riskViewMode, setRiskViewMode] = useState('list'); // 'list' or 'flow'

  useEffect(() => {
    loadFormData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadFormData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getOutcomeFormData(id);
      const data = response.data?.success ? response.data.data : response.data;
      
      // If projectInfo doesn't have status, get the full project
      let projectInfo = data.projectInfo || data.project;
      
      if (!projectInfo?.status) {
        const { getProjectById } = await import('../api/projects');
        const projectResponse = await getProjectById(id);
        const projectData = projectResponse.data?.success ? projectResponse.data.data : projectResponse.data;
        projectInfo = projectData;
      }
      
      setProjectData(projectInfo);
      setPredictedRisks(data.predictedRisks || []);
      setManualRisks(data.manualRisks || []);
      
      // Verify project is in completed status
      if (projectInfo?.status !== 'completed') {
        setError(
          t('projects.completionPage.errors.statusNotCompleted', {
            status: projectInfo?.status || t('common.notAvailable')
          })
        );
        return;
      }
      
      // Check if outcome already captured
      if (projectInfo?.hasOutcome || projectInfo?.projectOutcome?.completed) {
        setError(t('projects.completionPage.errors.outcomeAlreadyCaptured'));
        return;
      }
      
      // Pre-fill actualizedRisks with predicted risks structure
      const initialRisks = (data.predictedRisks || []).map((risk, index) => ({
        riskId: String(risk?._id ?? risk?.id ?? (risk?.type ? `${risk.type}-${index}` : index)),
        type: risk.type,
        occurred: undefined, // Will be set to true/false when user evaluates
        severity: risk.severity,
        source: risk.source || 'predicted' // DT, CBR, or predicted
      }));
      
      // IMPORTANT: Include manual risks added by PM during the project
      // These must be sent to CBR for learning
      const manualRiskEntries = (data.manualRisks || []).map((risk, index) => ({
        riskId: String(risk?._id ?? risk?.id ?? `manual-${index}`),
        type: risk.type,
        occurred: undefined, // Will be set to true/false when user evaluates
        severity: risk.severity,
        source: 'manual',
        description: risk.description
      }));
      
      // Combine predicted and manual risks
      const allInitialRisks = [...initialRisks, ...manualRiskEntries];
      
      setFormData(prev => ({
        ...prev,
        actualizedRisks: allInitialRisks
      }));
      
    } catch (error) {
      console.error('Error loading form data:', error);
      setError(error.response?.data?.error || t('projects.completionPage.errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      
      // NEW FLOW: Mark each risk individually using PUT /api/projects/:id/risks/:riskId
      const risksToUpdate = (formData.actualizedRisks || []).filter(risk => {
        // Only update risks that have been decided (occurred = true or false)
        return risk.occurred !== undefined && risk.occurred !== null;
      });

      console.log('📝 Marking', risksToUpdate.length, 'risks...');

      const normalizeList = (list) => {
        if (!Array.isArray(list)) return undefined;
        const normalized = list
          .map((v) => String(v ?? '').trim())
          .filter((v) => v.length > 0);
        return normalized.length > 0 ? normalized : undefined;
      };

      const buildOccurredDetails = (risk) => {
        const details = {
          title: risk.title ? String(risk.title).trim() : undefined,
          description: risk.description ? String(risk.description).trim() : undefined,
          severity: risk.severity ? String(risk.severity) : undefined,
          rootCause: risk.rootCause ? String(risk.rootCause).trim() : undefined,
          recommendations: normalizeList(risk.recommendations),
          indicators: normalizeList(risk.indicators)
        };

        for (const key of Object.keys(details)) {
          if (details[key] === undefined) delete details[key];
        }
        return details;
      };

      // Mark each risk in parallel
      const riskUpdatePromises = risksToUpdate.map(async (risk) => {
        try {
          // Find the actual risk ID from predictedRisks or manualRisks
          const predictedRisk = predictedRisks.find(r => String(r.id || r._id) === String(risk.riskId));
          const manualRisk = manualRisks.find(r => String(r.id || r._id) === String(risk.riskId));
          const actualRiskId = predictedRisk?._id || manualRisk?._id || risk.riskId;

          console.log('🔄 Updating risk:', actualRiskId, 'occurred:', risk.occurred);

          if (risk.occurred === true) {
            console.log('  ✅ Marking as occurred');
            const details = buildOccurredDetails(risk);
            return await markRiskOccurred(id, actualRiskId, details);
          }

          console.log('  ⛔ Marking as avoided');
          return await markRiskAvoided(id, actualRiskId);
        } catch (err) {
          console.error('❌ Error updating risk:', risk.riskId, err);
          console.error('   Error details:', err.response?.data);
          throw err;
        }
      });

      await Promise.all(riskUpdatePromises);
      console.log('✅ All risks updated successfully');

      // Navigate directly to project detail page
      navigate(`/projects/${id}`);
      
    } catch (error) {
      console.error('Error submitting outcome:', error);
      alert(error.response?.data?.error || t('projects.completionPage.errors.captureFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseResults = () => {
    setShowResults(false);
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
          <div style={styles.errorIcon}><AlertTriangle size={64} color="#dc2626" /></div>
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
              name: projectData?.projectName || projectData?.name || t('projects.completionPage.projectFallbackName')
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
          <p style={styles.infoText}>
            {t('projects.completionPage.whyImportantText')}
          </p>
        </div>
      </div>

      {/* Form Content */}
      <div style={styles.content}>
        {/* View Toggle */}
        <div style={styles.viewToggle}>
          <button
            onClick={() => setRiskViewMode('list')}
            style={{
              ...styles.viewButton,
              ...(riskViewMode === 'list' ? styles.viewButtonActive : {})
            }}
          >
            <List size={18} />
            <span>{t('projects.completionPage.riskView.listView')}</span>
          </button>
          <button
            onClick={() => setRiskViewMode('flow')}
            style={{
              ...styles.viewButton,
              ...(riskViewMode === 'flow' ? styles.viewButtonActive : {})
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
            setFormData={setFormData}
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
              projectName={projectData?.projectName || t('projects.completionPage.projectFallbackName')}
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

          <PrimaryButton 
            onClick={handleSubmit}
            disabled={submitting}
            leftIcon={<Save size={16} />}
          >
            {submitting ? t('common.saving') : t('projects.completionPage.saveAndLearn')}
          </PrimaryButton>
        </div>
      </div>

      {/* Results Modal */}
      <ResultsModal
        show={showResults}
        results={results}
        onClose={handleCloseResults}
      />
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '100px 20px 40px 20px'
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '80px 20px'
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #E5E7EB',
    borderTop: '4px solid #2563EB',
    borderRadius: '50%',
    margin: '0 auto 16px',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    fontSize: '16px',
    color: '#6B7280'
  },
  errorContainer: {
    textAlign: 'center',
    padding: '80px 20px'
  },
  errorIcon: {
    fontSize: '64px',
    marginBottom: '16px'
  },
  errorTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '8px'
  },
  errorMessage: {
    fontSize: '16px',
    color: '#6B7280',
    marginBottom: '24px'
  },
  header: {
    marginBottom: '32px'
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '16px',
    color: '#6B7280',
    marginBottom: '0'
  },
  infoBanner: {
    display: 'flex',
    gap: '16px',
    padding: '20px 24px',
    background: '#EFF6FF',
    border: '1px solid #BFDBFE',
    borderRadius: '12px',
    marginBottom: '32px'
  },
  infoIcon: {
    fontSize: '24px',
    flexShrink: 0
  },
  infoText: {
    fontSize: '14px',
    color: '#1E40AF',
    margin: '4px 0 0 0'
  },
  stepsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    padding: '0 20px'
  },
  step: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
    opacity: 0.5,
    transition: 'opacity 0.3s'
  },
  stepActive: {
    opacity: 1
  },
  stepCompleted: {
    opacity: 1
  },
  stepIcon: {
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#F3F4F6',
    borderRadius: '50%',
    fontSize: '20px',
    fontWeight: '600',
    border: '2px solid transparent'
  },
  stepText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  stepNumber: {
    fontSize: '12px',
    color: '#6B7280',
    fontWeight: '500'
  },
  stepTitle: {
    fontSize: '14px',
    color: '#111827',
    fontWeight: '600'
  },
  stepConnector: {
    flex: 1,
    height: '2px',
    background: '#E5E7EB',
    margin: '0 16px'
  },
  stepConnectorCompleted: {
    background: '#10B981'
  },
  content: {
    marginBottom: '32px'
  },
  viewToggle: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    padding: '4px',
    background: '#F3F4F6',
    borderRadius: '8px',
    width: 'fit-content'
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
    color: '#6B7280',
    transition: 'all 0.2s ease'
  },
  viewButtonActive: {
    background: 'white',
    color: '#2563EB',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  },
  flowContainer: {
    marginTop: '16px'
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
    color: '#92400E'
  },
  navigation: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    background: '#FFFFFF',
    borderRadius: '8px',
    border: '1px solid #E5E7EB',
    position: 'sticky',
    bottom: '20px',
    boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)'
  },
  navLeft: {
    display: 'flex',
    gap: '12px'
  },
  navRight: {
    display: 'flex',
    gap: '12px'
  }
};

// Add spinner animation
const styleSheet = document.styleSheets[0];
const keyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
try {
  styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
} catch {
  // Ignore if animation already exists
}
