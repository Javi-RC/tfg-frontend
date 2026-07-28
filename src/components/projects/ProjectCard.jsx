import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, Users, Calendar, Clock, Eye, Edit, Trash2 } from 'lucide-react';
import ProjectStatusBadge from './ProjectStatusBadge';
import './ProjectCard.css';

/**
 * Project Card Component
 * Displays project information in card format
 */
export default function ProjectCard({ project, onEdit, onDelete, showActions = true }) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleCardClick = () => {
    navigate(`/projects/${project._id}`);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(i18n.language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="project-card">
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <button
            type="button"
            style={{ ...styles.title, background: 'none', border: 'none', padding: 0, font: 'inherit', textAlign: 'left' }}
            onClick={handleCardClick}
          >
            {project.projectName}
          </button>
          <ProjectStatusBadge status={project.status} />
        </div>
        <p style={styles.description}>
          {project.briefDescription?.substring(0, 120)}
          {project.briefDescription?.length > 120 && '...'}
        </p>
      </div>

      <div style={styles.metadata}>
        <div style={styles.metaItem}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
            <User size={16} color="#666" style={{ flexShrink: 0 }} />
            <span style={styles.metaLabel}>{t('projects.card.projectManager')}:</span>
          </div>
          <span style={styles.metaValue}>{project.projectManager?.name || t('common.notAvailable')}</span>
        </div>

        <div style={styles.metaItem}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
            <Users size={16} color="#666" style={{ flexShrink: 0 }} />
            <span style={styles.metaLabel}>{t('projects.card.teamSize')}:</span>
          </div>
          <span style={styles.metaValue}>
            {project.assignedEmployeesCount || 0} {t('projects.card.members')}
          </span>
        </div>

        <div style={styles.metaItem}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
            <Calendar size={16} color="#666" style={{ flexShrink: 0 }} />
            <span style={styles.metaLabel}>{t('projects.card.timeline')}:</span>
          </div>
          <span style={styles.metaValue}>
            {formatDate(project.estimatedStartDate)} - {formatDate(project.estimatedEndDate)}
          </span>
        </div>

        <div style={styles.metaItem}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
            <Clock size={16} color="#666" style={{ flexShrink: 0 }} />
            <span style={styles.metaLabel}>{t('projects.card.duration')}:</span>
          </div>
          <span style={styles.metaValue}>
            {project.expectedDuration?.value}{' '}
            {project.expectedDuration?.unit
              ? t(`projects.timeUnits.${project.expectedDuration.unit}`, {
                  defaultValue: project.expectedDuration.unit,
                })
              : ''}
          </span>
        </div>
      </div>

      <div style={styles.footer}>
        {showActions && (
          <div style={styles.actions}>
            <button
              type="button"
              style={styles.actionButton}
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Eye size={16} />
                {t('projects.card.viewDetails')}
              </span>
            </button>
            {onEdit && (
              <button
                type="button"
                style={{ ...styles.actionButton, background: 'var(--color-bg-subtle)', color: 'var(--color-text-primary)' }}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(project);
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Edit size={16} />
                  {t('projects.card.edit')}
                </span>
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                style={{ ...styles.actionButton, background: 'var(--color-danger-bg)', color: 'var(--color-danger)' }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(project);
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Trash2 size={16} />
                  {t('projects.card.delete')}
                </span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
  },
  title: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--color-text-primary)',
    margin: 0,
    flex: 1,
    cursor: 'pointer',
    transition: 'color 0.2s',
  },
  description: {
    fontSize: '14px',
    color: 'var(--color-text-muted)',
    margin: 0,
    lineHeight: '1.6',
  },
  metadata: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '16px',
    background: 'var(--color-bg-muted)',
    borderRadius: '12px',
  },
  metaItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: '13px',
    color: 'var(--color-text-muted)',
    fontWeight: '500',
  },
  metaValue: {
    fontSize: '13px',
    color: 'var(--color-text-primary)',
    fontWeight: '600',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    paddingTop: '16px',
    borderTop: '1px solid var(--color-border)',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  actionButton: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    background: 'var(--color-primary)',
    color: 'white',
  },
};
