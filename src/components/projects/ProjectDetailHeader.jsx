import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Edit, Trash, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';
import ProjectStatusBadge from './ProjectStatusBadge';
import { PROJECT_STATUS } from '../../types/projectTypes';

export default function ProjectDetailHeader({
  project,
  canEdit,
  canDelete,
  onActivate,
  onComplete,
  onCancel,
  onDelete,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div style={styles.header}>
      <button type="button" style={styles.backButton} onClick={() => navigate('/projects')}>
        <ArrowLeft size={18} style={{ marginRight: '8px' }} />
        {t('projects.backToProjects')}
      </button>

      <div style={styles.headerContent}>
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>{project.projectName}</h1>
          <ProjectStatusBadge status={project.status} />
        </div>

        <div style={styles.headerActions}>
          <div style={styles.primaryActions}>
            {canEdit && project.status === PROJECT_STATUS.DRAFT && (
              <PrimaryButton onClick={onActivate} leftIcon={<CheckCircle size={18} />}>
                {t('projects.detailPage.activateProject')}
              </PrimaryButton>
            )}
            {canEdit && project.status === PROJECT_STATUS.ACTIVE && (
              <PrimaryButton onClick={onComplete} leftIcon={<CheckCircle size={18} />}>
                {t('projects.detailPage.completeProject')}
              </PrimaryButton>
            )}
            {canEdit && (
              <SecondaryButton
                onClick={() => navigate(`/projects/${project._id}/edit`)}
                leftIcon={<Edit size={16} />}
              >
                {t('common.edit')}
              </SecondaryButton>
            )}
          </div>

          {(canDelete || (canDelete && project.status !== PROJECT_STATUS.CANCELLED)) && (
            <div style={styles.destructiveActions}>
              {canDelete && project.status !== PROJECT_STATUS.CANCELLED && (
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={onCancel}
                  aria-label={t('projects.detailPage.cancelProjectAria')}
                >
                  <AlertCircle size={16} />
                  {t('common.cancel')}
                </button>
              )}
              {canDelete && (
                <button
                  type="button"
                  style={styles.deleteButton}
                  onClick={onDelete}
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
  );
}

const styles = {
  header: {
    marginBottom: '32px',
  },
  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    color: 'var(--color-text-muted)',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '16px',
    padding: '8px 12px 8px 0',
    transition: 'color 0.2s, transform 0.2s',
    ':hover': {
      color: 'var(--color-text-strong)',
    },
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '20px',
    flexWrap: 'wrap',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flex: 1,
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: 'var(--color-text-primary)',
    margin: 0,
  },
  headerActions: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  primaryActions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  destructiveActions: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    paddingLeft: '12px',
    borderLeft: '1px solid var(--color-border)',
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
      borderColor: '#FDBA74',
    },
  },
  deleteButton: {
    padding: '12px 20px',
    borderRadius: '10px',
    border: '1px solid var(--color-danger-bg)',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    background: '#FEF2F2',
    color: 'var(--color-danger)',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    '&:hover': {
      background: 'var(--color-danger-bg)',
      borderColor: '#FCA5A5',
    },
  },
};
