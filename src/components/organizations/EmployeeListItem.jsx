import React from 'react';
import PropTypes from 'prop-types';

/**
 * EmployeeListItem Component
 * Displays employee information in a list format
 */
export default function EmployeeListItem({ 
  employee, 
  isAdmin = false, 
  onStatusChange, 
  onRemove 
}) {
  const handleStatusChange = (newStatus) => {
    if (onStatusChange) {
      onStatusChange(employee.userId._id, newStatus);
    }
  };

  const handleRemove = () => {
    if (onRemove && confirm('Are you sure you want to remove this employee?')) {
      onRemove(employee.userId._id);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.info}>
        <div style={styles.name}>
          {employee.userId.name || employee.userId.username || employee.userId.email}
        </div>
        <div style={styles.details}>
          {employee.position && <span style={styles.detail}>{employee.position}</span>}
          {employee.department && <span style={styles.detail}>{employee.department}</span>}
          <span style={styles.detail}>
            Joined: {new Date(employee.joinedAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div style={styles.actions}>
        <span style={{
          ...styles.statusBadge,
          background: 
            employee.status === 'active' ? '#e8f5e9' :
            employee.status === 'pending' ? '#fff3e0' : '#ffebee',
          color:
            employee.status === 'active' ? '#2e7d32' :
            employee.status === 'pending' ? '#f57c00' : '#c62828'
        }}>
          {employee.status}
        </span>

        {isAdmin && (
          <div style={styles.buttons}>
            {employee.status === 'pending' && (
              <button
                style={styles.actionButton}
                onClick={() => handleStatusChange('active')}
              >
                Approve
              </button>
            )}
            {employee.status === 'active' && (
              <button
                style={styles.actionButton}
                onClick={() => handleStatusChange('inactive')}
              >
                Deactivate
              </button>
            )}
            <button
              style={{ ...styles.actionButton, background: '#f44336' }}
              onClick={handleRemove}
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

EmployeeListItem.propTypes = {
  employee: PropTypes.shape({
    userId: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string,
      username: PropTypes.string,
      email: PropTypes.string.isRequired
    }).isRequired,
    position: PropTypes.string,
    department: PropTypes.string,
    status: PropTypes.oneOf(['pending', 'active', 'inactive']).isRequired,
    joinedAt: PropTypes.string
  }).isRequired,
  isAdmin: PropTypes.bool,
  onStatusChange: PropTypes.func,
  onRemove: PropTypes.func
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    borderBottom: '1px solid #eee',
    transition: 'background 0.2s',
    ':hover': {
      background: '#f8f9fa'
    }
  },
  info: {
    flex: 1
  },
  name: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '4px'
  },
  details: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  detail: {
    fontSize: '14px',
    color: '#666'
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  statusBadge: {
    padding: '6px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500'
  },
  buttons: {
    display: 'flex',
    gap: '8px'
  },
  actionButton: {
    background: '#2563eb',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap'
  }
};
