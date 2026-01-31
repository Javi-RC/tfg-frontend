import React from 'react';
import { Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMyOrganizations } from '../hooks/useMyOrganizations';
import PrimaryButton from '../components/PrimaryButton';
import OrganizationCard from '../components/organizations/OrganizationCard';
import CreateOrganizationModal from '../components/organizations/CreateOrganizationModal';

/**
 * MyOrganizationsPage
 * Displays user's organizations (as admin or employee)
 */
export default function MyOrganizationsPage() {
  const { t } = useTranslation();
  const {
    organizations,
    loading,
    showCreateModal,
    createForm,
    createError,
    creating,
    isOrgAdmin,
    toggleCreateModal,
    navigateToOrganization,
    updateCreateForm,
    handleCreateOrganization
  } = useMyOrganizations();

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.loadingText}>{t('organizations.loadingOrganizations')}</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>{t('organizations.myOrganizations')}</h1>
          <p style={styles.subtitle}>
            {isOrgAdmin ? t('organizations.owner') : t('organizations.member')}
          </p>
        </div>
        {isOrgAdmin && organizations.length > 0 && (
          <PrimaryButton
            onClick={toggleCreateModal}
            leftIcon={<Building2 size={18} />}
          >
            {t('organizations.createOrganization')}
          </PrimaryButton>
        )}
      </div>

      {/* Organizations List */}
      {organizations.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>
            <Building2 size={64} color="#6c757d" style={{ opacity: 0.3 }} />
          </div>
          <h3 style={styles.emptyTitle}>{t('organizations.noOrganizations')}</h3>
          <p style={styles.emptyText}>
            {isOrgAdmin 
              ? t('organizations.createFirstOrganization')
              : t('organizations.noOrganizationsDesc')}
          </p>
          {isOrgAdmin && (
            <PrimaryButton
              onClick={toggleCreateModal}
              leftIcon={<Building2 size={18} />}
              style={{ margin: '0 auto' }}
            >
              {t('organizations.createOrganization')}
            </PrimaryButton>
          )}
        </div>
      ) : (
        <div style={styles.grid}>
          {organizations.map((org) => (
            <OrganizationCard 
              key={org._id} 
              organization={org} 
              isAdmin={isOrgAdmin}
              onClick={() => navigateToOrganization(org._id)}
              styles={styles}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <CreateOrganizationModal
          onClose={toggleCreateModal}
          createForm={createForm}
          createError={createError}
          creating={creating}
          updateCreateForm={updateCreateForm}
          handleCreateOrganization={handleCreateOrganization}
          styles={styles}
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#fafbfc',
    padding: '104px 20px 40px',
    fontFamily: 'Poppins, Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial'
  },
  header: {
    maxWidth: '1200px',
    margin: '0 auto 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px'
  },
  title: {
    fontSize: '32px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '16px',
    color: '#666'
  },
  loadingText: {
    textAlign: 'center',
    fontSize: '16px',
    color: '#666',
    marginTop: '40px'
  },
  emptyState: {
    maxWidth: '500px',
    margin: '60px auto',
    textAlign: 'center'
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px'
  },
  emptyTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '8px'
  },
  emptyText: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '24px'
  },
  grid: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '24px'
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
      transform: 'translateY(-2px)'
    }
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '12px'
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1a1a1a',
    margin: 0
  },
  badge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500'
  },
  cardDescription: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '16px',
    lineHeight: '1.5'
  },
  cardInfo: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px'
  },
  infoItem: {
    flex: 1
  },
  infoLabel: {
    fontSize: '12px',
    color: '#999',
    display: 'block',
    marginBottom: '4px'
  },
  infoValue: {
    fontSize: '14px',
    color: '#333',
    fontWeight: '500'
  },
  statsContainer: {
    display: 'flex',
    gap: '16px',
    padding: '16px 0',
    borderTop: '1px solid #eee',
    borderBottom: '1px solid #eee',
    marginBottom: '16px'
  },
  statItem: {
    flex: 1,
    textAlign: 'center'
  },
  statValue: {
    display: 'block',
    fontSize: '24px',
    fontWeight: '600',
    color: '#2563eb',
    marginBottom: '4px'
  },
  statLabel: {
    fontSize: '12px',
    color: '#666'
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  footerText: {
    fontSize: '14px',
    color: '#666'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    background: 'white',
    borderRadius: '16px',
    maxWidth: '1024px',
    width: '94%',
    maxHeight: '95vh',
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 16px',
    borderBottom: '1px solid #eee'
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1a1a1a',
    margin: 0
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '32px',
    color: '#666',
    cursor: 'pointer',
    padding: 0,
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  errorBanner: {
    background: '#ffebee',
    color: '#c62828',
    padding: '12px 24px',
    margin: '0 24px',
    marginTop: '16px',
    borderRadius: '8px',
    fontSize: '14px'
  },
  form: {
    padding: '14px 16px 16px',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px 12px'
  },
  formGroup: {
    marginBottom: 0
  },
  fullWidth: {
    gridColumn: '1 / -1'
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '500',
    color: '#333',
    marginBottom: '4px'
  },
  input: {
    width: '100%',
    padding: '6px 10px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '13px',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s',
    ':focus': {
      borderColor: '#2563eb'
    }
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '6px',
    paddingTop: '12px',
    borderTop: '1px solid #eee'
  }
};
