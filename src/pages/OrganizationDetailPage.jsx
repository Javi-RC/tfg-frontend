import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users } from 'lucide-react';
import { useOrganization } from '../hooks/useOrganization';
import SecondaryButton from '../components/SecondaryButton';
import StatCard from '../components/common/StatCard';
import TabNavigation from '../components/navigation/TabNavigation';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import Badge from '../components/common/Badge';
import OverviewTab from '../components/organizations/tabs/OverviewTab';
import EmployeesTab from '../components/organizations/tabs/EmployeesTab';
import ProjectsTab from '../components/organizations/tabs/ProjectsTab';
import CVsTab from '../components/organizations/tabs/CVsTab';
import SettingsTab from '../components/organizations/tabs/SettingsTab';
import styles from './organizationDetailStyles';

/**
 * OrganizationDetailPage
 * Displays organization details with tabs for employees and CVs
 */
export default function OrganizationDetailPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const {
    organization,
    stats,
    loading,
    activeTab,
    setActiveTab,
    error,
    isAdmin,
    reloadOrganization,
    reloadStats
  } = useOrganization();

  if (loading) {
    return (
      <div style={styles.container}>
        <LoadingState message={t('organizations.loadingOrganization')} />
      </div>
    );
  }

  if (error || !organization) {
    return (
      <div style={styles.container}>
        <ErrorState
          message={error || t('organizations.organizationNotFound')}
          action={
            <SecondaryButton onClick={() => navigate('/organizations')}>
              {t('organizations.backToOrganizations')}
            </SecondaryButton>
          }
        />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <button style={styles.backButton} onClick={() => navigate('/organizations')}>
            ← {t('organizations.back')}
          </button>
        </div>
        
        <div style={styles.headerContent}>
          <div>
            <h1 style={styles.title}>{organization.name}</h1>
            {organization.description && (
              <p style={styles.description}>{organization.description}</p>
            )}
            <div style={styles.badges}>
              <Badge
                variant={organization.status === 'active' ? 'success' : 'error'}
              >
                {organization.status === 'active' ? t('common.active') : t('common.inactive')}
              </Badge>
              {organization.industry && (
                <Badge variant="neutral">{organization.industry}</Badge>
              )}
              {organization.size && (
                <Badge variant="neutral">{t('organizations.employeesCount', { count: organization.size })}</Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section (Admin only) */}
      {isAdmin && stats && (
        <div style={styles.statsSection}>
          <StatCard
            value={stats.totalEmployees}
            label={t('organizations.stats.totalEmployees')}
            icon={Users}
            borderColor="#3B82F6"
            iconColor="#3B82F6"
          />
          <StatCard
            value={stats.activeEmployees}
            label={t('organizations.stats.activeEmployees')}
            icon={Users}
            borderColor="#10B981"
            iconColor="#10B981"
          />
          <StatCard
            value={stats.pendingEmployees}
            label={t('organizations.stats.pendingEmployees')}
            icon={Users}
            borderColor="#F59E0B"
            iconColor="#F59E0B"
          />
          <StatCard
            value={stats.inactiveEmployees}
            label={t('organizations.stats.inactiveEmployees')}
            icon={Users}
            borderColor="#6B7280"
            iconColor="#6B7280"
          />
        </div>
      )}

      {/* Tabs */}
      <TabNavigation
        tabs={[
          { id: 'overview', label: t('organizations.tabs.overview') },
          { id: 'employees', label: t('organizations.tabs.employees') },
          { id: 'projects', label: t('organizations.tabs.projects') },
          ...(isAdmin ? [
            { id: 'cvs', label: t('organizations.tabs.cvs') },
            { id: 'settings', label: t('organizations.tabs.settings') }
          ] : [])
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
        ariaLabel={t('organizations.aria.navigation')}
      />

      {/* Tab Content */}
      <div style={styles.content}>
        {activeTab === 'overview' && (
          <OverviewTab organization={organization} styles={styles} />
        )}
        {activeTab === 'employees' && (
          <EmployeesTab 
            organizationId={organization._id} 
            isAdmin={isAdmin}
            onUpdate={reloadStats}
            styles={styles}
          />
        )}
        {activeTab === 'projects' && (
          <ProjectsTab 
            organizationId={organization._id}
            isAdmin={isAdmin}
            styles={styles}
          />
        )}
        {activeTab === 'cvs' && isAdmin && (
          <CVsTab 
            organizationId={organization._id}
            onUpdate={reloadStats}
            styles={styles}
          />
        )}
        {activeTab === 'settings' && isAdmin && (
          <SettingsTab 
            organization={organization}
            onUpdate={reloadOrganization}
            styles={styles}
          />
        )}
      </div>
    </div>
  );
}
