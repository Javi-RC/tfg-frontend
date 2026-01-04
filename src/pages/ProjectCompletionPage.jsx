import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle, Save, ArrowLeft, Send, ArrowRight, BarChart3, Lightbulb, TrendingUp, X } from 'lucide-react';
import { getOutcomeForm, submitOutcome } from '../api/projects';
import GeneralOutcomeSection from '../components/outcome/GeneralOutcomeSection';
import RisksSection from '../components/outcome/RisksSection';
import LessonsLearnedSection from '../components/outcome/LessonsLearnedSection';
import MetricsSection from '../components/outcome/MetricsSection';
import ResultsModal from '../components/outcome/ResultsModal';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';

/**
 * Project Completion Page
 * Allows Project Managers to capture project outcomes for CBR learning
 */
export default function ProjectCompletionPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const [projectData, setProjectData] = useState(null);
  const [predictedRisks, setPredictedRisks] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  
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
  
  const [errors, setErrors] = useState({});
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    loadFormData();
  }, [id]);

  const loadFormData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getOutcomeForm(id);
      const data = response.data?.success ? response.data.data : response.data;
      
      // If projectInfo doesn't have status, get the full project
      let projectInfo = data.projectInfo || data.project;
      
      if (!projectInfo?.status) {
        console.log('⚠️ Backend did not return status, fetching complete project...');
        const { getProjectById } = await import('../api/projects');
        const projectResponse = await getProjectById(id);
        const projectData = projectResponse.data?.success ? projectResponse.data.data : projectResponse.data;
        projectInfo = projectData;
      }
      
      setProjectData(projectInfo);
      setPredictedRisks(data.predictedRisks || []);
      
      // Verify project is in completed status
      if (projectInfo?.status !== 'completed') {
        setError(`⚠️ The project must be in "Completed" status to capture the outcome.\n\nCurrent status: ${projectInfo?.status || 'unknown'}\n\nPlease go to the project page and click "✓ Complete Project" first.`);
        return;
      }
      
      // Check if outcome already captured
      if (projectInfo?.hasOutcome || projectInfo?.projectOutcome?.completed) {
        setError('✓ This project already has a captured outcome.\n\nIt is not possible to capture the outcome twice.');
        return;
      }
      
      // Pre-fill actualizedRisks with predicted risks structure
      const initialRisks = (data.predictedRisks || []).map(risk => ({
        riskId: risk.id,
        type: risk.type,
        occurred: false,
        severity: risk.severity
      }));
      
      setFormData(prev => ({
        ...prev,
        actualizedRisks: initialRisks
      }));
      
    } catch (error) {
      console.error('Error loading form data:', error);
      setError(error.response?.data?.error || 'Error loading project data');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Step 1 validation
    if (currentStep === 1) {
      if (formData.completed === undefined || formData.completed === null) {
        newErrors.completed = 'You must indicate if the project was completed';
      }
      if (!formData.qualityScore || formData.qualityScore < 1 || formData.qualityScore > 5) {
        newErrors.qualityScore = 'Quality rating required (1-5)';
      }
      if (!formData.clientSatisfaction || formData.clientSatisfaction < 1 || formData.clientSatisfaction > 5) {
        newErrors.clientSatisfaction = 'Client satisfaction required (1-5)';
      }
      if (!formData.teamMorale || formData.teamMorale < 1 || formData.teamMorale > 5) {
        newErrors.teamMorale = 'Team morale required (1-5)';
      }
    }
    
    // Step 2 validation
    if (currentStep === 2) {
      const occurredRisks = (formData.actualizedRisks || []).filter(r => r.occurred);
      
      for (const risk of occurredRisks) {
        if (!risk.description) {
          newErrors.risks = 'Risks that occurred require description';
          break;
        }
        if (!risk.rootCause) {
          newErrors.risks = 'Risks that occurred require root cause';
          break;
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateForm()) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      
      // Transform actualizedRisks to match backend format
      const transformedRisks = (formData.actualizedRisks || []).map(risk => {
        const baseRisk = {
          type: risk.type,
          occurred: risk.occurred
        };
        
        if (risk.occurred) {
          return {
            ...baseRisk,
            severity: risk.severity,
            description: risk.description,
            detectedAt: risk.detectedAt,
            mitigatedAt: risk.mitigatedAt,
            scheduleDelayDays: risk.scheduleDelayDays,
            budgetOverrunPercent: risk.budgetOverrunPercent,
            qualityImpact: risk.qualityImpact,
            rootCause: risk.rootCause
          };
        } else {
          return {
            ...baseRisk,
            avoidanceReason: risk.avoidanceReason
          };
        }
      });
      
      // Transform practices to string format (backend expects [string])
      const transformedSuccessful = (formData.successfulPractices || [])
        .filter(p => p.practice && p.practice.trim())
        .map(p => {
          let text = p.practice;
          if (p.impact && p.impact.trim()) {
            text += ` | Impact: ${p.impact}`;
          }
          if (p.replicable !== undefined) {
            text += ` | Replicable: ${p.replicable ? 'Yes' : 'No'}`;
          }
          return text;
        });
      
      const transformedUnsuccessful = (formData.unsuccessfulPractices || [])
        .filter(p => p.practice && p.practice.trim())
        .map(p => {
          let text = p.practice;
          if (p.impact && p.impact.trim()) {
            text += ` | Impact: ${p.impact}`;
          }
          if (p.reason && p.reason.trim()) {
            text += ` | Reason: ${p.reason}`;
          }
          return text;
        });
      
      const outcomeData = {
        completed: formData.completed,
        actualCompletedDate: formData.actualCompletedDate,
        budgetOverrun: formData.budgetOverrun || 0,
        qualityScore: formData.qualityScore,
        clientSatisfaction: formData.clientSatisfaction,
        teamMorale: formData.teamMorale,
        actualizedRisks: transformedRisks,
        lessonsLearned: (formData.lessonsLearned || []).filter(l => l.trim()),
        successfulPractices: transformedSuccessful,
        unsuccessfulPractices: transformedUnsuccessful,
        metrics: formData.metrics || {}
      };

      const response = await submitOutcome(id, outcomeData);
      
      setResults(response);
      setShowResults(true);
      
    } catch (error) {
      console.error('Error submitting outcome:', error);
      alert(error.response?.data?.error || 'Error capturing project outcome');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseResults = () => {
    setShowResults(false);
    navigate('/projects');
  };

  const steps = [
    {
      number: 1,
      title: 'General Outcome',
      icon: <BarChart3 size={20} />
    },
    {
      number: 2,
      title: 'Risks',
      icon: <AlertTriangle size={20} />
    },
    {
      number: 3,
      title: 'Lessons',
      icon: <Lightbulb size={20} />
    },
    {
      number: 4,
      title: 'Results',
      icon: <TrendingUp size={20} />
    }
  ];

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Loading project data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}><AlertTriangle size={64} color="#dc2626" /></div>
          <h2 style={styles.errorTitle}>Error</h2>
          <p style={styles.errorMessage}>{error}</p>
          <SecondaryButton onClick={() => navigate('/projects')} leftIcon={<ArrowLeft size={16} />}>
            Back to Projects
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
          <h1 style={styles.title}>Finalize Project: {projectData?.name}</h1>
          <p style={styles.subtitle}>
            Capture the real outcome so the system can learn and improve future predictions
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div style={styles.infoBanner}>
        <Info size={20} color="#004085" style={{ flexShrink: 0 }} />
        <div>
          <strong>Why is this important?</strong>
          <p style={styles.infoText}>
            By capturing the real outcome of this project, the CBR system will learn from this experience
            and improve risk predictions for similar future projects in your organization.
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div style={styles.stepsContainer}>
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div style={{
              ...styles.step,
              ...(currentStep === step.number ? styles.stepActive : {}),
              ...(currentStep > step.number ? styles.stepCompleted : {})
            }}>
              <div style={styles.stepIcon}>
                {currentStep > step.number ? '✓' : step.icon}
              </div>
              <div style={styles.stepText}>
                <div style={styles.stepNumber}>Step {step.number}</div>
                <div style={styles.stepTitle}>{step.title}</div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div style={{
                ...styles.stepConnector,
                ...(currentStep > step.number ? styles.stepConnectorCompleted : {})
              }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Form Content */}
      <div style={styles.content}>
        {currentStep === 1 && (
          <GeneralOutcomeSection
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        )}
        
        {currentStep === 2 && (
          <RisksSection
            formData={formData}
            setFormData={setFormData}
            predictedRisks={predictedRisks}
          />
        )}
        
        {currentStep === 3 && (
          <LessonsLearnedSection
            formData={formData}
            setFormData={setFormData}
          />
        )}
        
        {currentStep === 4 && (
          <MetricsSection
            formData={formData}
            setFormData={setFormData}
          />
        )}
      </div>

      {/* Navigation */}
      <div style={styles.navigation}>
        <div style={styles.navLeft}>
          {currentStep > 1 && (
            <SecondaryButton onClick={handlePrevStep} leftIcon={<ArrowLeft size={16} />}>
              Previous
            </SecondaryButton>
          )}
        </div>
        
        <div style={styles.navRight}>
          <SecondaryButton onClick={() => navigate('/projects')} leftIcon={<X size={16} />}>
            Cancel
          </SecondaryButton>
          
          {currentStep < steps.length ? (
            <PrimaryButton onClick={handleNextStep} rightIcon={<ArrowRight size={16} />}>
              Next
            </PrimaryButton>
          ) : (
            <PrimaryButton 
              onClick={handleSubmit}
              disabled={submitting}
              leftIcon={<Save size={16} />}
            >
              {submitting ? 'Saving...' : 'Save and Learn'}
            </PrimaryButton>
          )}
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
    padding: '32px 20px'
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
    marginBottom: '24px'
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '16px',
    color: '#6B7280'
  },
  infoBanner: {
    display: 'flex',
    gap: '16px',
    padding: '20px',
    background: '#EFF6FF',
    border: '1px solid #BFDBFE',
    borderRadius: '8px',
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
} catch (e) {
  // Ignore if animation already exists
}
