import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lightbulb, Edit, Trash, AlertCircle, CheckCircle } from 'lucide-react';
import { useProjectDetail } from '../hooks/useProjectDetail';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import ProjectStatusBadge from '../components/projects/ProjectStatusBadge';
import EmployeeAssignmentModal from '../components/projects/EmployeeAssignmentModal';
import DraftTeamAnalysis from '../components/projects/DraftTeamAnalysis';
import TeamMembersSection from '../components/projects/TeamMembersSection';
import TabNavigation from '../components/navigation/TabNavigation';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import InfoGrid from '../components/common/InfoGrid';
import { PROJECT_STATUS } from '../types/projectTypes';

/**
 * Project Detail Page
 * Displays complete project information with management capabilities
 */
export default function ProjectDetailPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  
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
          ← {t('projects.backToProjects')}
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
          { id: 'details', label: t('projects.detailPage.tabs.details') }
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
                  { label: t('projects.detailPage.systemComplexity'), value: translateProjectLevel(project.systemComplexity) },
                  { label: t('projects.detailPage.documentationLevel'), value: translateProjectLevel(project.documentationLevel) }
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
    background: 'none',
    border: 'none',
    color: '#6B7280',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '16px',
    padding: '8px 0'
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
    borderBottom: '2px solid transparent',
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
  }
};
