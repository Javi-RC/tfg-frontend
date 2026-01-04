import React from 'react';
import PropTypes from 'prop-types';
import { Briefcase, Users as UsersIcon, FileQuestion, Files } from 'lucide-react';

/**
 * OrganizationCard Component
 * Displays organization information in a card format
 */
export default function OrganizationCard({ organization, onClick, showStats = false, stats = null }) {
  return (
    <div style={styles.card} onClick={onClick}>
      <div style={styles.header}>
        <h3 style={styles.title}>{organization.name}</h3>
        <span style={{
          ...styles.badge,
          background: organization.isActive ? '#e8f5e9' : '#ffebee',
          color: organization.isActive ? '#2e7d32' : '#c62828'
        }}>
          {organization.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
      
      {organization.description && (
        <p style={styles.description}>{organization.description}</p>
      )}

      <div style={styles.info}>
        <div style={styles.infoItem}>
          <Briefcase size={14} color="#999" />
          <span style={styles.infoLabel}>Industry:</span>
          <span style={styles.infoValue}>{organization.industry || 'N/A'}</span>
        </div>
        <div style={styles.infoItem}>
          <UsersIcon size={14} color="#999" />
          <span style={styles.infoLabel}>Size:</span>
          <span style={styles.infoValue}>{organization.size || 'N/A'}</span>
        </div>
      </div>

      {showStats && stats && (
        <div style={styles.statsContainer}>
          <div style={styles.statItem}>
            <UsersIcon size={20} color="#2563eb" style={{ marginBottom: '4px' }} />
            <span style={styles.statValue}>{stats.totalEmployees || 0}</span>
            <span style={styles.statLabel}>Employees</span>
          </div>
          <div style={styles.statItem}>
            <FileQuestion size={20} color="#f59e0b" style={{ marginBottom: '4px' }} />
            <span style={styles.statValue}>{stats.pendingCVs || 0}</span>
            <span style={styles.statLabel}>Pending CVs</span>
          </div>
          <div style={styles.statItem}>
            <Files size={20} color="#10b981" style={{ marginBottom: '4px' }} />
            <span style={styles.statValue}>{stats.totalCVs || 0}</span>
            <span style={styles.statLabel}>Total CVs</span>
          </div>
        </div>
      )}
    </div>
  );
}

OrganizationCard.propTypes = {
  organization: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    industry: PropTypes.string,
    size: PropTypes.string,
    isActive: PropTypes.bool
  }).isRequired,
  onClick: PropTypes.func,
  showStats: PropTypes.bool,
  stats: PropTypes.shape({
    totalEmployees: PropTypes.number,
    pendingCVs: PropTypes.number,
    totalCVs: PropTypes.number
  })
};

const styles = {
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '12px'
  },
  title: {
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
  description: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '16px',
    lineHeight: '1.5',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  info: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px'
  },
  infoItem: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
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
    marginTop: '16px'
  },
  statItem: {
    flex: 1,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
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
  }
};
