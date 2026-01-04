import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Users, Calendar, Clock, Eye, Edit, Trash2 } from 'lucide-react';
import ProjectStatusBadge from './ProjectStatusBadge';

/**
 * Project Card Component
 * Displays project information in card format
 */
export default function ProjectCard({ project, onEdit, onDelete, showActions = true }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/projects/${project._id}`);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <h3 
            style={styles.title}
            onClick={handleCardClick}
          >
            {project.projectName}
          </h3>
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
            <span style={styles.metaLabel}>Project Manager:</span>
          </div>
          <span style={styles.metaValue}>
            {project.projectManager?.name || 'N/A'}
          </span>
        </div>
        
        <div style={styles.metaItem}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
            <Users size={16} color="#666" style={{ flexShrink: 0 }} />
            <span style={styles.metaLabel}>Team Size:</span>
          </div>
          <span style={styles.metaValue}>
            {project.assignedEmployeesCount || 0} members
          </span>
        </div>

        <div style={styles.metaItem}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
            <Calendar size={16} color="#666" style={{ flexShrink: 0 }} />
            <span style={styles.metaLabel}>Timeline:</span>
          </div>
          <span style={styles.metaValue}>
            {formatDate(project.estimatedStartDate)} - {formatDate(project.estimatedEndDate)}
          </span>
        </div>

        <div style={styles.metaItem}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
            <Clock size={16} color="#666" style={{ flexShrink: 0 }} />
            <span style={styles.metaLabel}>Duration:</span>
          </div>
          <span style={styles.metaValue}>
            {project.expectedDuration?.value} {project.expectedDuration?.unit}
          </span>
        </div>
      </div>

      <div style={styles.footer}>
        {showActions && (
          <div style={styles.actions}>
            <button
              style={styles.actionButton}
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Eye size={16} />
                View Details
              </span>
            </button>
            {onEdit && (
              <button
                style={{...styles.actionButton, background: '#F3F4F6', color: '#111'}}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(project);
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Edit size={16} />
                  Edit
                </span>
              </button>
            )}
            {onDelete && (
              <button
                style={{...styles.actionButton, background: '#FEE2E2', color: '#DC2626'}}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(project);
                }}
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #E5E7EB',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'all 0.2s',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px'
  },
  title: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#111',
    margin: 0,
    flex: 1,
    cursor: 'pointer',
    transition: 'color 0.2s'
  },
  description: {
    fontSize: '14px',
    color: '#6B7280',
    margin: 0,
    lineHeight: '1.6'
  },
  metadata: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '16px',
    background: '#F9FAFB',
    borderRadius: '12px'
  },
  metaItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  metaLabel: {
    fontSize: '13px',
    color: '#6B7280',
    fontWeight: '500'
  },
  metaValue: {
    fontSize: '13px',
    color: '#111',
    fontWeight: '600'
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #E5E7EB'
  },
  actions: {
    display: 'flex',
    gap: '8px'
  },
  actionButton: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    background: '#111',
    color: 'white'
  }
};
