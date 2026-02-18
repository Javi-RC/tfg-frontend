import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ClipboardList } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useProjects } from '../hooks/useProjects';
import PrimaryButton from '../components/PrimaryButton';
import ProjectCard from '../components/projects/ProjectCard';
import PageHeader from '../components/layout/PageHeader';
import TabNavigation from '../components/navigation/TabNavigation';
import FilterGroup from '../components/common/FilterGroup';
import EmptyState from '../components/common/EmptyState';
import LoadingState from '../components/common/LoadingState';
import { PROJECT_STATUS } from '../types/projectTypes';

/**
 * Projects List Page
 * Pure presentation component - all business logic in useProjects hook
 */
export default function ProjectsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    myProjects,
    assignedProjects,
    organizations,
    loading,
    activeTab,
    filterStatus,
    filterOrg,
    isProjectManager,
    filteredProjects,
    setActiveTab,
    setFilterStatus,
    setFilterOrg,
    handleDeleteProject,
    reloadProjects
  } = useProjects();
  
  const handleDelete = async (project) => {
    try {
      await handleDeleteProject(project._id);
      await reloadProjects();
    } catch (error) {
      alert(error.response?.data?.error || t('projects.errors.deleteFailed'));
    }
  };

  const handleEditProject = (project) => {
    navigate(`/projects/${project._id}/edit`);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <LoadingState message={t('projects.loadingProjects')} />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <PageHeader
        title={t('projects.title')}
        subtitle={t('projects.manageTrackProjects')}
        action={isProjectManager && (
          <PrimaryButton onClick={() => navigate('/projects/new')} leftIcon={<Plus size={18} />}>
            {t('projects.createProject')}
          </PrimaryButton>
        )}
      />

      {/* Tabs */}
      <TabNavigation
        tabs={[
          { id: 'my-projects', label: `${t('projects.myProjects')} (${myProjects.length})` },
          { id: 'assigned', label: `${t('projects.assignedToMe')} (${assignedProjects.length})` }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
        ariaLabel="Projects navigation"
      />

      {/* Filters */}
      <div style={styles.filters}>
        <FilterGroup
          label={t('projects.status')}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          options={[
            { value: 'all', label: t('projects.allStatuses') },
            { value: PROJECT_STATUS.DRAFT, label: t('projects.planning') },
            { value: PROJECT_STATUS.ACTIVE, label: t('projects.active') },
            { value: PROJECT_STATUS.PAUSED, label: t('projects.onHold') },
            { value: PROJECT_STATUS.COMPLETED, label: t('projects.completed') },
            { value: PROJECT_STATUS.CANCELLED, label: t('projects.cancelled') }
          ]}
        />

        <FilterGroup
          label={t('projects.organization')}
          value={filterOrg}
          onChange={(e) => setFilterOrg(e.target.value)}
          options={[
            { value: 'all', label: t('projects.allOrganizations') },
            ...organizations.map(org => ({ value: org._id, label: org.name }))
          ]}
        />
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title={activeTab === 'my-projects' ? t('projects.noProjects') : t('projects.noProjects')}
          description={
            activeTab === 'my-projects' && isProjectManager
              ? t('projects.createFirstProject')
              : t('projects.noProjectsDesc')
          }
        />
      ) : (
        <div style={styles.grid}>
          {filteredProjects.map(project => (
            <ProjectCard
              key={project._id}
              project={project}
              onEdit={activeTab === 'my-projects' ? handleEditProject : null}
              onDelete={activeTab === 'my-projects' ? handleDelete : null}
              showActions={activeTab === 'my-projects'}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '100px 20px 40px 20px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '32px',
    gap: '20px',
    flexWrap: 'wrap'
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#111',
    margin: '0 0 8px 0'
  },
  subtitle: {
    fontSize: '16px',
    color: '#6B7280',
    margin: 0
  },
  loadingText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: '16px',
    padding: '60px'
  },
  filters: {
    display: 'flex',
    gap: '20px',
    marginBottom: '32px',
    flexWrap: 'wrap'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    gap: '24px'
  }
};