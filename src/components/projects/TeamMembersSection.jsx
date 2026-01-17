import React from 'react';
import { useTranslation } from 'react-i18next';
import PrimaryButton from '../PrimaryButton';
import { PROJECT_STATUS } from '../../types/projectTypes';

export default function TeamMembersSection({
  project,
  canEdit,
  onOpenAssignModal,
  onRemoveEmployee,
  formatDate
}) {
  const { t } = useTranslation();
  return (
    <div>
      <div style={styles.teamHeader}>
        <h3 style={styles.sectionTitle}>{t('teamMembers.title')}</h3>
        {canEdit && project.status !== PROJECT_STATUS.COMPLETED && (
          <PrimaryButton onClick={onOpenAssignModal}>+ {t('teamMembers.assignEmployee')}</PrimaryButton>
        )}
      </div>

      {/* Project Manager */}
      <div style={styles.pmSection}>
        <h4 style={styles.subsectionTitle}>{t('teamMembers.projectManager')}</h4>
        <div style={styles.memberCard}>
          <div style={styles.memberInfo}>
            <div style={styles.memberName}>{project.projectManager?.name}</div>
            <div style={styles.memberEmail}>{project.projectManager?.email}</div>
          </div>
          <div style={styles.memberRole}>{t('teamMembers.projectManager')}</div>
        </div>
      </div>

      {/* Team Members */}
      <div style={styles.membersSection}>
        <h4 style={styles.subsectionTitle}>
          {t('teamMembers.teamMembersCount', { count: project.assignedEmployees?.length || 0 })}
        </h4>
        {project.assignedEmployees && project.assignedEmployees.length > 0 ? (
          <div style={styles.membersList}>
            {project.assignedEmployees.map((emp) => (
              <div key={emp.user._id} style={styles.memberCard}>
                <div style={styles.memberInfo}>
                  <div style={styles.memberName}>{emp.user.name}</div>
                  <div style={styles.memberEmail}>{emp.user.email}</div>
                  {emp.assignedRole && (
                    <div style={styles.memberPosition}>{emp.assignedRole}</div>
                  )}
                  <div style={styles.memberDate}>{t('teamMembers.joined')} {formatDate(emp.assignedAt)}</div>
                </div>
                {canEdit && project.status !== PROJECT_STATUS.COMPLETED && (
                  <button
                    style={styles.removeButton}
                    onClick={() => onRemoveEmployee(emp.user._id)}
                  >
                    {t('teamMembers.remove')}
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>{t('teamMembers.noMembersYet')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  teamHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#111',
    marginBottom: '20px'
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
  }
};
