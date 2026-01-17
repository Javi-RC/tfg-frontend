import React, { useEffect, useState } from 'react';
import { Users, Target } from 'lucide-react';
import { getOrganizationEmployees, removeEmployee, updateEmployeeStatus } from '../../../api/organization';

/**
 * EmployeesTab
 */
export default function EmployeesTab({ organizationId, isAdmin, onUpdate, styles }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationId, filter]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { status: filter } : {};
      const res = await getOrganizationEmployees(organizationId, params);
      // API can return { success: true, data: [...] } or direct array.
      if (res.data?.success && Array.isArray(res.data?.data)) {
        setEmployees(res.data.data);
      } else if (Array.isArray(res.data)) {
        setEmployees(res.data);
      } else {
        setEmployees([]);
      }
    } catch (err) {
      console.error('Error loading employees:', err);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await updateEmployeeStatus(organizationId, userId, newStatus);
      loadEmployees();
      if (onUpdate) onUpdate();
    } catch (err) {
      alert(err.response?.data?.error || err.message || 'Error updating employee status');
    }
  };

  const handleRemove = async (userId) => {
    if (!confirm('Are you sure you want to remove this employee?')) return;

    try {
      await removeEmployee(organizationId, userId);
      loadEmployees();
      if (onUpdate) onUpdate();
    } catch (err) {
      alert(err.response?.data?.error || err.message || 'Error removing employee');
    }
  };

  const handleToggleProjectManager = async (userId, currentStatus) => {
    const action = currentStatus ? 'remove' : 'assign';
    if (!confirm(`Are you sure you want to ${action} project manager role ${currentStatus ? 'from' : 'to'} this employee?`)) return;

    try {
      const { updateProjectManagerRole } = await import('../../../api/projects');
      await updateProjectManagerRole(organizationId, userId, !currentStatus);
      loadEmployees();
      if (onUpdate) onUpdate();
    } catch (err) {
      alert(err.response?.data?.error || err.message || 'Error updating project manager role');
    }
  };

  if (loading) {
    return <p style={styles.loadingText}>Loading employees...</p>;
  }

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>Employees</h2>
        {isAdmin && (
          <div style={styles.filterButtons}>
            <button style={filter === 'all' ? styles.filterActive : styles.filterButton} onClick={() => setFilter('all')}>
              All
            </button>
            <button style={filter === 'active' ? styles.filterActive : styles.filterButton} onClick={() => setFilter('active')}>
              Active
            </button>
            <button style={filter === 'pending' ? styles.filterActive : styles.filterButton} onClick={() => setFilter('pending')}>
              Pending
            </button>
            <button style={filter === 'inactive' ? styles.filterActive : styles.filterButton} onClick={() => setFilter('inactive')}>
              Inactive
            </button>
          </div>
        )}
      </div>

      {employees.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <Users size={48} color="#999" style={{ marginBottom: '16px', opacity: 0.5 }} />
          <p style={styles.emptyText}>No employees found</p>
        </div>
      ) : (
        <div style={styles.table}>
          <div style={styles.tableHeader}>
            <div style={styles.tableCell}>Name</div>
            <div style={styles.tableCell}>Position</div>
            <div style={styles.tableCell}>Department</div>
            <div style={styles.tableCell}>Status</div>
            <div style={styles.tableCell}>Role</div>
            {isAdmin && <div style={styles.tableCell}>Actions</div>}
          </div>
          {employees.map((emp) => {
            const user = emp.user || emp.userId;
            return (
              <div key={user?._id || emp._id} style={styles.tableRow}>
                <div style={styles.tableCell}>{user?.name || user?.username || user?.email || '-'}</div>
                <div style={styles.tableCell}>{emp.position || '-'}</div>
                <div style={styles.tableCell}>{emp.department || '-'}</div>
                <div style={styles.tableCell}>
                  <span
                    style={{
                      ...styles.statusBadge,
                      background:
                        emp.status === 'active' ? '#e8f5e9' : emp.status === 'pending' ? '#fff3e0' : '#ffebee',
                      color: emp.status === 'active' ? '#2e7d32' : emp.status === 'pending' ? '#f57c00' : '#c62828'
                    }}
                  >
                    {emp.status}
                  </span>
                </div>
                <div style={styles.tableCell}>
                  {emp.isProjectManager && (
                    <span
                      style={{
                        ...styles.statusBadge,
                        background: '#E0E7FF',
                        color: '#4338CA',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Target size={14} />
                      Project Manager
                    </span>
                  )}
                </div>
                {isAdmin && (
                  <div style={styles.tableCell}>
                    <div style={styles.actionButtons}>
                      {emp.status === 'pending' && (
                        <button style={styles.actionButton} onClick={() => handleStatusChange(user._id, 'active')}>
                          Approve
                        </button>
                      )}
                      {emp.status === 'active' && (
                        <>
                          <button
                            style={{
                              ...styles.actionButton,
                              background: emp.isProjectManager ? '#FEE2E2' : '#E0E7FF',
                              color: emp.isProjectManager ? '#DC2626' : '#4338CA'
                            }}
                            onClick={() => handleToggleProjectManager(user._id, emp.isProjectManager)}
                          >
                            {emp.isProjectManager ? 'Remove PM' : 'Make PM'}
                          </button>
                          <button style={styles.actionButton} onClick={() => handleStatusChange(user._id, 'inactive')}>
                            Deactivate
                          </button>
                        </>
                      )}
                      <button style={{ ...styles.actionButton, color: '#c62828' }} onClick={() => handleRemove(user._id)}>
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
