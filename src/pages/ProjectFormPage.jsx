import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { useProjectForm } from '../hooks/useProjectForm';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import Step1GeneralInfo from '../components/projects/Step1GeneralInfo';
import Step2Collaboration from '../components/projects/Step2Collaboration';
import Step3Technical from '../components/projects/Step3Technical';
import Step4Geographic from '../components/projects/Step4Geographic';
import Step5Roles from '../components/projects/Step5Roles';
import Step6Availability from '../components/projects/Step6Availability';
import Step7Coordination from '../components/projects/Step7Coordination';
import Step8CollaborationIntensity from '../components/projects/Step8CollaborationIntensity';
import Step9Maturity from '../components/projects/Step9Maturity';
import { FORM_STEPS } from '../types/projectTypes';
import './ProjectFormPage.css';

/**
 * Project Form Page
 * Pure presentation component - all business logic in useProjectForm hook
 */
export default function ProjectFormPage() {
  const { t } = useTranslation();
  const {
    currentStep,
    formData,
    errors,
    validationMessage,
    loading,
    organizations,
    selectedOrg,
    isEditMode,
    navigate,
    setSelectedOrg,
    updateField,
    nextStep,
    prevStep,
    goToStep,
    saveDraft,
    submitAndActivate
  } = useProjectForm();

  // All business logic now handled by useProjectForm hook

  if (loading && isEditMode) {
    return (
      <div style={styles.container}>
        <p style={styles.loadingText}>{t('projects.loadingProjects')}</p>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1GeneralInfo
            formData={formData}
            onChange={updateField}
            errors={errors}
          />
        );
      case 2:
        return (
          <Step2Collaboration
            formData={formData}
            onChange={updateField}
            errors={errors}
          />
        );
      case 3:
        return (
          <Step3Technical
            formData={formData}
            onChange={updateField}
            errors={errors}
          />
        );
      case 4:
        return (
          <Step4Geographic
            formData={formData}
            onChange={updateField}
            errors={errors}
          />
        );
      case 5:
        return (
          <Step5Roles
            formData={formData}
            onChange={updateField}
            errors={errors}
          />
        );
      case 6:
        return (
          <Step6Availability
            formData={formData}
            onChange={updateField}
            errors={errors}
          />
        );
      case 7:
        return (
          <Step7Coordination
            formData={formData}
            onChange={updateField}
            errors={errors}
          />
        );
      case 8:
        return (
          <Step8CollaborationIntensity
            formData={formData}
            onChange={updateField}
            errors={errors}
          />
        );
      case 9:
        return (
          <Step9Maturity
            formData={formData}
            onChange={updateField}
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <button style={styles.backButton} onClick={() => navigate('/projects')}>
            <ArrowLeft size={18} style={{ marginRight: '8px' }} />
            {t('projects.backToProjects')}
          </button>
          <h1 style={styles.title}>
            {isEditMode ? t('projects.form.editProject') : t('projects.form.createNew')}
          </h1>
        </div>

        {/* Organization Selector */}
        {!isEditMode && (
          <div style={styles.orgSelector}>
            <label style={styles.label}>
              {t('projects.form.selectOrganization')} <span style={styles.required}>*</span>
            </label>
            <select
              value={selectedOrg}
              onChange={(e) => setSelectedOrg(e.target.value)}
              style={styles.select}
            >
              {organizations.map(org => (
                <option key={org._id} value={org._id}>{org.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Progress Indicator */}
        <div style={styles.progress}>
          <div style={styles.progressBar}>
            <div 
              style={{
                ...styles.progressFill,
                width: `${(currentStep / FORM_STEPS.length) * 100}%`
              }}
            />
          </div>
          <div style={styles.progressText}>
            {t('projects.form.stepOfTotal', { current: currentStep, total: FORM_STEPS.length })}
          </div>
        </div>

        {/* Steps Navigator */}
        <div style={styles.stepsNav}>
          {FORM_STEPS.map((step, idx) => (
            <div
              key={step.id}
              style={{
                ...styles.stepDot,
                ...(idx + 1 === currentStep && styles.stepDotActive),
                ...(idx + 1 < currentStep && styles.stepDotCompleted)
              }}
              onClick={() => goToStep(idx + 1)}
            >
              {idx + 1}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div style={styles.formContent}>
          {/* Validation Message Alert */}
          {validationMessage && (
            <div style={styles.validationAlert} className="validation-alert">
              <AlertCircle size={24} color="#991B1B" style={{ flexShrink: 0 }} />
              <div>
                <strong style={styles.alertTitle}>{t('projects.form.validationError')}</strong>
                <p style={styles.alertMessage}>{t(validationMessage)}</p>
              </div>
            </div>
          )}
          
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div style={styles.actions}>
          <div style={styles.leftActions}>
            {currentStep > 1 && (
              <SecondaryButton onClick={prevStep} leftIcon={<ArrowLeft size={16} />}>
                {t('projects.form.previous')}
              </SecondaryButton>
            )}
          </div>
          
          <div style={styles.rightActions}>
            <SecondaryButton onClick={saveDraft} disabled={loading} leftIcon={<Save size={16} />}>
              {t('projects.form.saveAsDraft')}
            </SecondaryButton>
            
            {currentStep < FORM_STEPS.length ? (
              <PrimaryButton onClick={nextStep} rightIcon={<ArrowRight size={16} />}>
                {t('projects.form.next')}
              </PrimaryButton>
            ) : (
              <>
                <PrimaryButton 
                  onClick={() => submitAndActivate(false)}
                  disabled={loading}
                  leftIcon={<CheckCircle size={18} />}
                >
                  {isEditMode ? t('projects.form.updateProject') : t('projects.form.createProject')}
                </PrimaryButton>
                <PrimaryButton 
                  onClick={() => submitAndActivate(true)}
                  disabled={loading}
                  style={{ background: '#10B981' }}
                  leftIcon={<CheckCircle size={18} />}
                >
                  {isEditMode ? t('projects.form.updateAndActivate') : t('projects.form.createAndActivate')}
                </PrimaryButton>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '100px 20px 40px 20px'
  },
  content: {
    background: 'white',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  header: {
    marginBottom: '32px'
  },
  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    color: '#6B7280',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '16px',
    padding: '8px 12px 8px 0',
    transition: 'color 0.2s, transform 0.2s'
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#111',
    margin: 0
  },
  orgSelector: {
    marginBottom: '32px',
    padding: '20px',
    background: '#F9FAFB',
    borderRadius: '12px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#111',
    marginBottom: '8px',
    display: 'block'
  },
  required: {
    color: '#EF4444'
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #E5E7EB',
    borderRadius: '10px',
    fontSize: '15px',
    outline: 'none',
    cursor: 'pointer',
    background: 'white'
  },
  progress: {
    marginBottom: '24px'
  },
  progressBar: {
    width: '100%',
    height: '8px',
    background: '#E5E7EB',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '8px'
  },
  progressFill: {
    height: '100%',
    background: '#111',
    transition: 'width 0.3s ease'
  },
  progressText: {
    fontSize: '13px',
    color: '#6B7280',
    fontWeight: '600',
    textAlign: 'center'
  },
  stepsNav: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '40px',
    flexWrap: 'wrap'
  },
  stepDot: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: '2px solid #E5E7EB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '600',
    color: '#9CA3AF',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  stepDotActive: {
    borderColor: '#111',
    background: '#111',
    color: 'white'
  },
  stepDotCompleted: {
    borderColor: '#10B981',
    background: '#10B981',
    color: 'white'
  },
  formContent: {
    marginBottom: '40px'
  },
  validationAlert: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '16px 20px',
    background: '#FEF2F2',
    border: '2px solid #FCA5A5',
    borderRadius: '12px',
    marginBottom: '24px'
  },
  alertTitle: {
    display: 'block',
    fontSize: '15px',
    fontWeight: '700',
    color: '#991B1B',
    marginBottom: '4px'
  },
  alertMessage: {
    fontSize: '14px',
    color: '#7F1D1D',
    margin: 0,
    lineHeight: '1.5'
  },
  simplifiedStep: {
    padding: '40px',
    background: '#F9FAFB',
    borderRadius: '12px',
    textAlign: 'center'
  },
  stepTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111',
    marginBottom: '12px'
  },
  infoText: {
    fontSize: '15px',
    color: '#6B7280',
    lineHeight: '1.6'
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    paddingTop: '32px',
    borderTop: '2px solid #E5E7EB'
  },
  leftActions: {
    display: 'flex',
    gap: '12px'
  },
  rightActions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  loadingText: {
    textAlign: 'center',
    color: '#6B7280',
    padding: '60px'
  }
};
