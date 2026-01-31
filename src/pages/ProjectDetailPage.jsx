import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lightbulb, Edit, Trash, AlertCircle, CheckCircle, MessageSquare, CheckCircle2, Plus, ArrowLeft } from 'lucide-react';
import { useProjectDetail } from '../hooks/useProjectDetail';
import { useManualRisks } from '../hooks/useManualRisks';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import ProjectStatusBadge from '../components/projects/ProjectStatusBadge';
import EmployeeAssignmentModal from '../components/projects/EmployeeAssignmentModal';
import ProjectCompletionQuestionnaireModal from '../components/projects/ProjectCompletionQuestionnaireModal';
import DraftTeamAnalysis from '../components/projects/DraftTeamAnalysis';
import TeamMembersSection from '../components/projects/TeamMembersSection';
import TabNavigation from '../components/navigation/TabNavigation';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import InfoGrid from '../components/common/InfoGrid';
import ManualRiskForm from '../components/risk/ManualRiskForm';
import ManualRisksList from '../components/risk/ManualRisksList';
import { PROJECT_STATUS } from '../types/projectTypes';
import { getCompletionQuestionnaire, submitCompletionQuestionnaire } from '../api/projects';

/**
 * Project Detail Page
 * Displays complete project information with management capabilities
 */
export default function ProjectDetailPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const previousLanguage = useRef(i18n.language);
  
  const {
    project,
    loading,
    activeTab,
    setActiveTab,
    showAssignModal,
    setShowAssignModal,
    canEdit,
    canDelete,
    handleDelete,
    handleActivate,
    handleComplete,
    handleCancel,
    handleAssignEmployee,
    handleRemoveEmployee,
    reloadProject
  } = useProjectDetail();

  // Manual risks management
  const {
    manualRisks,
    loading: risksLoading,
    error: risksError,
    loadManualRisks,
    addRisk,
    updateRisk,
    deleteRisk,
    repredictRisks,
    clearError: clearRisksError
  } = useManualRisks(project?._id);

  // State for completion questionnaire modal
  const [showQuestionnaireModal, setShowQuestionnaireModal] = useState(false);
  const [questionnaireChecked, setQuestionnaireChecked] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState('pending'); // 'pending', 'completed', 'skipped'

  // State for manual risk form modal
  const [showRiskForm, setShowRiskForm] = useState(false);
  const [editingRisk, setEditingRisk] = useState(null);
  const [addingRisk, setAddingRisk] = useState(false);

  // Check for pending completion questionnaire when project is completed
  useEffect(() => {
    const checkCompletionQuestionnaire = async () => {
      if (!project || project.status !== PROJECT_STATUS.COMPLETED || questionnaireChecked) {
        return;
      }

      // Check if user already skipped this questionnaire
      const skippedKey = `questionnaire_skipped_${project._id}`;
      const completedKey = `questionnaire_completed_${project._id}`;
      
      if (localStorage.getItem(completedKey)) {
        setFeedbackStatus('completed');
        setQuestionnaireChecked(true);
        return;
      }
      
      if (localStorage.getItem(skippedKey)) {
        setFeedbackStatus('skipped');
        setQuestionnaireChecked(true);
        return;
      }

      try {
        const response = await getCompletionQuestionnaire(project._id);
        const data = response.data?.success ? response.data.data : response.data;
        
        if (data?.pending) {
          setShowQuestionnaireModal(true);
          setFeedbackStatus('pending');
        } else if (data?.completed) {
          setFeedbackStatus('completed');
        }
      } catch (error) {
        // If endpoint doesn't exist yet or error, silently continue
        console.debug('Completion questionnaire check:', error.message);
        setFeedbackStatus('pending');
      } finally {
        setQuestionnaireChecked(true);
      }
    };

    checkCompletionQuestionnaire();
  }, [project, questionnaireChecked]);

  // Load manual risks when project is active or higher status
  useEffect(() => {
    if (project && project.status !== PROJECT_STATUS.DRAFT) {
      loadManualRisks();
    }
  }, [project, loadManualRisks]);

  // Reload manual risks when language changes to get translated content from backend
  useEffect(() => {
    const currentLanguage = i18n.language;
    if (previousLanguage.current && previousLanguage.current !== currentLanguage && manualRisks.length > 0) {
      console.log('🌐 [ProjectDetailPage] Language changed from', previousLanguage.current, 'to', currentLanguage);
      console.log('🔄 [ProjectDetailPage] Reloading manual risks to get translations...');
      loadManualRisks();
    }
    previousLanguage.current = currentLanguage;
  }, [i18n.language, loadManualRisks, manualRisks.length]);

  const handleAddRisk = async (riskData) => {
    setAddingRisk(true);
    const newRisk = await addRisk(riskData);
    setAddingRisk(false);
    if (newRisk) {
      setShowRiskForm(false);
    }
  };

  const handleEditRisk = async (riskData) => {
    setAddingRisk(true);
    const updated = await updateRisk(editingRisk._id, riskData);
    setAddingRisk(false);
    if (updated) {
      setShowRiskForm(false);
      setEditingRisk(null);
    }
  };

  const handleOpenEditRisk = (risk) => {
    setEditingRisk(risk);
    setShowRiskForm(true);
  };

  const handleCloseRiskForm = () => {
    setShowRiskForm(false);
    setEditingRisk(null);
  };

  const handleDeleteRisk = async (riskId) => {
    await deleteRisk(riskId);
  };

  const handleQuestionnaireSubmit = async (responses) => {
    try {
      await submitCompletionQuestionnaire(project._id, responses);
      localStorage.setItem(`questionnaire_completed_${project._id}`, Date.now().toString());
      setShowQuestionnaireModal(false);
      setFeedbackStatus('completed');
      alert(t('projectQuestionnaire.successMessage'));
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
      alert(error.response?.data?.error || t('projectQuestionnaire.errorMessage'));
    }
  };

  const handleQuestionnaireClose = () => {
    setShowQuestionnaireModal(false);
  };

  const handleQuestionnaireSkip = () => {
    setShowQuestionnaireModal(false);
    setFeedbackStatus('skipped');
  };

  const handleOpenFeedbackModal = () => {
    // Redirect to new completion page instead of opening old modal
    navigate(`/projects/${project._id}/completion`);
  };

  const formatDate = (date) => {
    if (!date) return t('common.notAvailable');
    const dateObj = new Date(date);
    if (Number.isNaN(dateObj.getTime())) return t('common.notAvailable');
    return new Intl.DateTimeFormat(i18n.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(dateObj);
  };

  const translateProjectLevel = (value) => {
    if (!value) return t('common.notAvailable');
    const normalized = typeof value === 'string' ? value.toLowerCase() : value;
    return t(`projects.levels.${normalized}`, { defaultValue: value });
  };

  const translateWorkMode = (value) => {
    if (!value) return t('common.notAvailable');
    const modeMap = {
      'inherit_from_organization': t('projects.workMode.inherit'),
      'office_mode': t('projects.workMode.officeMode'),
      'office_first': t('projects.workMode.officeFirst'),
      'office_remote_mix': t('projects.workMode.officeMix'),
      'remote_first': t('projects.workMode.remoteFirst'),
      'remote_mode': t('projects.workMode.remoteMode')
    };
    return modeMap[value] || value;
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <LoadingState message={t('projects.loadingProject')} />
      </div>
    );
  }

  if (!project) {
    return (
      <div style={styles.container}>
        <ErrorState message={t('projects.detailPage.projectNotFound')} />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate('/projects')}>
          <ArrowLeft size={18} style={{ marginRight: '8px' }} />
          {t('projects.backToProjects')}
        </button>
        
        <div style={styles.headerContent}>
          <div style={styles.headerLeft}>
            <h1 style={styles.title}>{project.projectName}</h1>
            <ProjectStatusBadge status={project.status} />
          </div>
          
          <div style={styles.headerActions}>
            {/* Primary actions */}
            <div style={styles.primaryActions}>
              {canEdit && project.status === PROJECT_STATUS.DRAFT && (
                <PrimaryButton onClick={handleActivate} leftIcon={<CheckCircle size={18} />}>
                  {t('projects.detailPage.activateProject')}
                </PrimaryButton>
              )}
              {canEdit && project.status === PROJECT_STATUS.ACTIVE && (
                <PrimaryButton onClick={handleComplete} leftIcon={<CheckCircle size={18} />}>
                  {t('projects.detailPage.completeProject')}
                </PrimaryButton>
              )}
              {canEdit && (
                <SecondaryButton onClick={() => navigate(`/projects/${project._id}/edit`)} leftIcon={<Edit size={16} />}>
                  {t('common.edit')}
                </SecondaryButton>
              )}
            </div>
            
            {/* Destructive actions */}
            {(canDelete || (canDelete && project.status !== PROJECT_STATUS.CANCELLED)) && (
              <div style={styles.destructiveActions}>
                {canDelete && project.status !== PROJECT_STATUS.CANCELLED && (
                  <button 
                    style={styles.cancelButton}
                    onClick={handleCancel}
                    aria-label={t('projects.detailPage.cancelProjectAria')}
                  >
                    <AlertCircle size={16} />
                    {t('common.cancel')}
                  </button>
                )}
                {canDelete && (
                  <button 
                    style={styles.deleteButton} 
                    onClick={handleDelete}
                    aria-label={t('projects.detailPage.deleteProjectAria')}
                  >
                    <Trash size={16} />
                    {t('common.delete')}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feedback Banner for Completed Projects */}
      {project.status === PROJECT_STATUS.COMPLETED && (
        <div style={feedbackStatus === 'completed' ? styles.feedbackBannerCompleted : styles.feedbackBanner}>
          <div style={styles.feedbackBannerContent}>
            {feedbackStatus === 'completed' ? (
              <CheckCircle2 size={24} color="#059669" />
            ) : (
              <MessageSquare size={24} color="#6366F1" />
            )}
            <div style={styles.feedbackBannerText}>
              <h3 style={styles.feedbackBannerTitle}>
                {feedbackStatus === 'completed' 
                  ? t('projectQuestionnaire.banner.completed')
                  : t('projectQuestionnaire.banner.title')}
              </h3>
              <p style={styles.feedbackBannerDescription}>
                {feedbackStatus === 'completed'
                  ? t('projectQuestionnaire.banner.completedDescription')
                  : t('projectQuestionnaire.banner.description')}
              </p>
            </div>
          </div>
          {feedbackStatus !== 'completed' && (
            <PrimaryButton 
              onClick={handleOpenFeedbackModal}
              leftIcon={<MessageSquare size={16} />}
            >
              {t('projectQuestionnaire.banner.action')}
            </PrimaryButton>
          )}
        </div>
      )}

      {/* Tabs */}
      <TabNavigation
        tabs={[
          { id: 'overview', label: t('projects.detailPage.tabs.overview') },
          ...(project.status === PROJECT_STATUS.DRAFT ? [
            { id: 'teamAnalysis', label: t('projects.detailPage.tabs.teamAnalysis'), icon: Lightbulb }
          ] : []),
          {
            id: 'team',
            label: t('projects.detailPage.tabs.teamWithCount', { count: project.assignedEmployeesCount || 0 })
          },
          { id: 'details', label: t('projects.detailPage.tabs.details') },
          ...(project.status !== PROJECT_STATUS.DRAFT ? [
            { id: 'risks', label: t('projects.detailPage.tabs.risks') }
          ] : [])
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
        ariaLabel={t('projects.detailPage.projectNavigation')}
      />

      {/* Content */}
      <div style={styles.content}>
        {activeTab === 'teamAnalysis' && project.status === PROJECT_STATUS.DRAFT && (
          <DraftTeamAnalysis 
            project={project} 
            onProjectUpdate={reloadProject}
          />
        )}

        {activeTab === 'overview' && (
          <div>
            {/* Basic Info */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>{t('projects.detailPage.projectInformation')}</h3>
              <InfoGrid
                items={[
                  { label: t('projects.projectManager'), value: project.projectManager?.name || t('common.notAvailable') },
                  { label: t('projects.startDate'), value: formatDate(project.estimatedStartDate) },
                  { label: t('projects.endDate'), value: formatDate(project.estimatedEndDate) },
                  { label: t('projects.detailPage.duration'), value: (
                    <>
                      {project.expectedDuration?.value} {project.expectedDuration?.unit ? t(`projects.timeUnits.${project.expectedDuration.unit}`, { defaultValue: project.expectedDuration.unit }) : ''}
                    </>
                  )}
                ]}
              />
            </div>

            {/* Description */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>{t('projects.description')}</h3>
              <p style={styles.description}>{project.briefDescription}</p>
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <TeamMembersSection
            project={project}
            canEdit={canEdit}
            onOpenAssignModal={() => setShowAssignModal(true)}
            onRemoveEmployee={handleRemoveEmployee}
            formatDate={formatDate}
          />
        )}

        {activeTab === 'details' && (
          <div>
            <div style={styles.detailsSection}>
              <h3 style={styles.sectionTitle}>{t('projects.detailPage.technicalRequirements')}</h3>
              <InfoGrid
                items={[
                  { label: t('projects.detailPage.experienceLevel'), value: translateProjectLevel(project.requiredExperienceLevel) },
                  { label: t('projects.detailPage.documentationLevel'), value: translateProjectLevel(project.documentationLevel) },
                  { label: t('projects.detailPage.technologies'), value: project.mainTechnologies?.join(', ') || t('common.notAvailable') }
                ]}
              />
            </div>

            <div style={styles.detailsSection}>
              <h3 style={styles.sectionTitle}>{t('projects.detailPage.workDistribution')}</h3>
              <InfoGrid
                items={[
                  { label: t('projects.detailPage.workMode'), value: project.workMode ? translateWorkMode(project.workMode) : t('common.notAvailable') },
                  { label: t('projects.detailPage.involvedCountries'), value: project.involvedCountries?.join(', ') || t('common.notAvailable') },
                  { label: t('projects.detailPage.distributedExperience'), value: translateProjectLevel(project.distributedWorkExperienceLevel) },
                  { label: t('projects.detailPage.culturalDiversity'), value: translateProjectLevel(project.culturalDiversityLevel) }
                ]}
              />
            </div>

            <div style={styles.detailsSection}>
              <h3 style={styles.sectionTitle}>{t('projects.detailPage.management')}</h3>
              <InfoGrid
                items={[
                  { label: t('projects.detailPage.managementMethod'), value: project.managementMethod || t('common.notAvailable') },
                  { label: t('projects.detailPage.standupFrequency'), value: project.followUpFrequency?.standups?.frequency || t('common.notAvailable') }
                ]}
              />
            </div>
          </div>
        )}

        {activeTab === 'risks' && project.status !== PROJECT_STATUS.DRAFT && (
          <div>
            <div style={styles.section}>
              <div style={styles.risksSectionHeader}>
                <div style={styles.risksHeaderInfo}>
                  <h3 style={styles.sectionTitle}>{t('projects.detailPage.risksSection.title')}</h3>
                  <p style={styles.sectionDescription}>
                    {project.status === PROJECT_STATUS.ACTIVE
                      ? t('projects.detailPage.risksSection.descriptionActive')
                      : t('projects.detailPage.risksSection.descriptionInactive')}
                  </p>
                  
                  {/* Risk Statistics */}
                  {manualRisks && manualRisks.length > 0 && (
                    <div style={styles.riskStats}>
                      <div style={styles.statItem}>
                        <span style={styles.statValue}>
                          {manualRisks.filter(r => r.severity === 'high' || r.severity === 'critical').length}
                        </span>
                        <span style={styles.statLabel}>{t('projects.detailPage.risksSection.stats.highCritical')}</span>
                      </div>
                      <div style={styles.statItem}>
                        <span style={styles.statValue}>
                          {manualRisks.filter(r => r.status === 'predicted').length}
                        </span>
                        <span style={styles.statLabel}>{t('projects.detailPage.risksSection.stats.predicted')}</span>
                      </div>
                      <div style={styles.statItem}>
                        <span style={styles.statValue}>
                          {manualRisks.filter(r => r.source === 'manual').length}
                        </span>
                        <span style={styles.statLabel}>{t('projects.detailPage.risksSection.stats.manual')}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Only allow adding risks when project is ACTIVE */}
                {canEdit && project.status === PROJECT_STATUS.ACTIVE && (
                  <PrimaryButton
                    onClick={() => {
                      setEditingRisk(null);
                      setShowRiskForm(true);
                    }}
                    leftIcon={<Plus size={16} />}
                  >
                    {t('risk.form.addRiskButton')}
                  </PrimaryButton>
                )}
              </div>

              {/* Info banner for non-active projects */}
              {project.status === PROJECT_STATUS.COMPLETED && (
                <div style={styles.infoBanner}>
                  <AlertCircle size={20} color="#3B82F6" />
                  <div style={styles.infoBannerText}>
                    <strong>{t('projects.detailPage.risksSection.completedBanner.title')}</strong> {t('projects.detailPage.risksSection.completedBanner.description')}
                  </div>
                </div>
              )}

              {risksError && (
                <div style={styles.errorBanner}>
                  <AlertCircle size={20} />
                  <div>{risksError}</div>
                  <button 
                    onClick={() => {
                      clearRisksError();
                      loadManualRisks();
                    }}
                    style={styles.errorRetryButton}
                  >
                    {t('projects.detailPage.risksSection.retry')}
                  </button>
                </div>
              )}

              <ManualRisksList
                risks={manualRisks}
                loading={risksLoading}
                error={risksError}
                onEdit={handleOpenEditRisk}
                onDelete={handleDeleteRisk}
                onRefresh={repredictRisks}
                canManage={canEdit && project.status === PROJECT_STATUS.ACTIVE}
              />
            </div>
          </div>
        )}
      </div>

      {/* Employee Assignment Modal */}
      {showAssignModal && (
        <EmployeeAssignmentModal
          organizationId={project.organization}
          currentEmployees={project.assignedEmployees || []}
          onAssign={handleAssignEmployee}
          onClose={() => setShowAssignModal(false)}
        />
      )}

      {/* Project Completion Questionnaire Modal */}
      {showQuestionnaireModal && project && (
        <ProjectCompletionQuestionnaireModal
          project={project}
          onClose={handleQuestionnaireClose}
          onSubmit={handleQuestionnaireSubmit}
          onSkip={handleQuestionnaireSkip}
        />
      )}

      {/* Manual Risk Form Modal */}
      {showRiskForm && (
        <ManualRiskForm
          initialRisk={editingRisk}
          onSubmit={editingRisk ? handleEditRisk : handleAddRisk}
          onCancel={handleCloseRiskForm}
          onDelete={
            editingRisk
              ? async () => {
                  await handleDeleteRisk(editingRisk._id);
                  handleCloseRiskForm();
                }
              : undefined
          }
          loading={addingRisk}
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '100px 20px 40px 20px'
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
    transition: 'color 0.2s, transform 0.2s',
    ':hover': {
      color: '#374151'
    }
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '20px',
    flexWrap: 'wrap'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flex: 1
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#111',
    margin: 0
  },
  headerActions: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  primaryActions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  destructiveActions: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    paddingLeft: '12px',
    borderLeft: '1px solid #E5E7EB'
  },
  cancelButton: {
    padding: '12px 20px',
    borderRadius: '10px',
    border: '1px solid #FED7AA',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    background: '#FFF7ED',
    color: '#C2410C',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    '&:hover': {
      background: '#FFEDD5',
      borderColor: '#FDBA74'
    }
  },
  deleteButton: {
    padding: '12px 20px',
    borderRadius: '10px',
    border: '1px solid #FECACA',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    background: '#FEF2F2',
    color: '#DC2626',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    '&:hover': {
      background: '#FEE2E2',
      borderColor: '#FCA5A5'
    }
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '32px',
    borderBottom: '2px solid #E5E7EB'
  },
  tab: {
    padding: '12px 24px',
    background: 'none',
    border: 'none',
    fontSize: '15px',
    fontWeight: '600',
    color: '#6B7280',
    cursor: 'pointer',
    borderBottomWidth: '2px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'transparent',
    marginBottom: '-2px',
    transition: 'all 0.2s'
  },
  tabActive: {
    color: '#111',
    borderBottomColor: '#111'
  },
  content: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    border: '1px solid #E5E7EB'
  },
  section: {
    marginBottom: '32px',
    paddingBottom: '32px',
    borderBottom: '1px solid #E5E7EB'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#111',
    marginBottom: '20px'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px'
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  infoLabel: {
    fontSize: '13px',
    color: '#6B7280',
    fontWeight: '500'
  },
  infoValue: {
    fontSize: '15px',
    color: '#111',
    fontWeight: '600'
  },
  description: {
    fontSize: '15px',
    color: '#374151',
    lineHeight: '1.7',
    margin: 0
  },
  teamHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  pmSection: {
    marginBottom: '32px'
  },
  subsectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111',
    marginBottom: '12px'
  },
  memberCard: {
    padding: '16px',
    background: '#F9FAFB',
    borderRadius: '12px',
    border: '1px solid #E5E7EB',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  memberInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  memberName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111'
  },
  memberEmail: {
    fontSize: '14px',
    color: '#6B7280'
  },
  memberPosition: {
    fontSize: '13px',
    color: '#9CA3AF',
    fontStyle: 'italic'
  },
  memberRole: {
    padding: '6px 12px',
    background: '#DBEAFE',
    color: '#1E40AF',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600'
  },
  memberDate: {
    fontSize: '12px',
    color: '#9CA3AF'
  },
  removeButton: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    background: '#FEE2E2',
    color: '#DC2626',
    transition: 'all 0.2s'
  },
  membersSection: {
    marginTop: '24px'
  },
  membersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    background: '#F9FAFB',
    borderRadius: '12px'
  },
  emptyText: {
    fontSize: '15px',
    color: '#6B7280',
    margin: 0
  },
  detailsSection: {
    marginBottom: '32px'
  },
  loadingText: {
    textAlign: 'center',
    color: '#6B7280',
    padding: '60px'
  },
  errorText: {
    textAlign: 'center',
    color: '#DC2626',
    padding: '60px',
    fontSize: '16px'
  },
  feedbackBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '16px',
    padding: '24px',
    background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
    borderRadius: '16px',
    marginBottom: '32px',
    border: '1px solid #C7D2FE',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.1)'
  },
  feedbackBannerCompleted: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '16px',
    padding: '24px',
    background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
    borderRadius: '16px',
    marginBottom: '32px',
    border: '1px solid #A7F3D0',
    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.1)'
  },
  feedbackBannerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flex: '1 1 auto',
    minWidth: '0'
  },
  feedbackBannerText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
    minWidth: '0'
  },
  feedbackBannerTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#111',
    margin: 0
  },
  feedbackBannerDescription: {
    fontSize: '14px',
    color: '#4B5563',
    margin: 0
  },
  risksSectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '20px',
    marginBottom: '24px'
  },
  risksHeaderInfo: {
    flex: 1
  },
  riskStats: {
    display: 'flex',
    gap: '24px',
    marginTop: '16px',
    padding: '16px',
    backgroundColor: '#F9FAFB',
    borderRadius: '12px',
    border: '1px solid #E5E7EB'
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px'
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111'
  },
  statLabel: {
    fontSize: '12px',
    color: '#6B7280',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  sectionDescription: {
    fontSize: '14px',
    color: '#6B7280',
    margin: '6px 0 0 0',
    lineHeight: '1.5'
  },
  infoBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#EFF6FF',
    borderRadius: '8px',
    marginBottom: '16px',
    border: '1px solid #BFDBFE'
  },
  infoBannerText: {
    fontSize: '14px',
    color: '#1E40AF',
    lineHeight: '1.5'
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#FEE2E2',
    borderRadius: '8px',
    marginBottom: '16px',
    color: '#991B1B',
    fontSize: '14px'
  },
  errorRetryButton: {
    marginLeft: 'auto',
    padding: '6px 12px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #FECACA',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    color: '#DC2626',
    whiteSpace: 'nowrap'
  }
};
