import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Target, Mail, UserCheck, UserMinus, UserX, Crown, ShieldOff, Shield, User } from 'lucide-react';
import { getOrganizationEmployees, removeEmployee, updateEmployeeStatus } from '../../../api/organization';

/**
 * EmployeesTab
 */
export default function EmployeesTab({ organizationId, isAdmin, onUpdate, styles }) {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [hoveredRow, setHoveredRow] = useState(null);

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
      alert(err.response?.data?.error || err.message || t('organizations.employees.errors.updateStatus'));
    }
  };

  const handleRemove = async (userId) => {
    if (!confirm(t('organizations.employees.confirmations.removeEmployee'))) return;

    try {
      await removeEmployee(organizationId, userId);
      loadEmployees();
      if (onUpdate) onUpdate();
    } catch (err) {
      alert(err.response?.data?.error || err.message || t('organizations.employees.errors.removeEmployee'));
    }
  };

  const handleToggleProjectManager = async (userId, currentStatus) => {
    const confirmMessage = currentStatus 
      ? t('organizations.employees.confirmations.removeProjectManager')
      : t('organizations.employees.confirmations.assignProjectManager');
    
    if (!confirm(confirmMessage)) return;

    try {
      const { updateProjectManagerRole } = await import('../../../api/projects');
      await updateProjectManagerRole(organizationId, userId, !currentStatus);
      loadEmployees();
      if (onUpdate) onUpdate();
    } catch (err) {
      alert(err.response?.data?.error || err.message || t('organizations.employees.errors.updateProjectManager'));
    }
  };

  if (loading) {
    return <p style={styles.loadingText}>{t('organizations.employees.loadingEmployees')}</p>;
  }

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>{t('organizations.employees.title')}</h2>
        {isAdmin && (
          <div style={styles.filterButtons}>
            <button style={filter === 'all' ? styles.filterActive : styles.filterButton} onClick={() => setFilter('all')}>
              {t('organizations.employees.filters.all')}
            </button>
            <button style={filter === 'active' ? styles.filterActive : styles.filterButton} onClick={() => setFilter('active')}>
              {t('organizations.employees.filters.active')}
            </button>
            <button style={filter === 'pending' ? styles.filterActive : styles.filterButton} onClick={() => setFilter('pending')}>
              {t('organizations.employees.filters.pending')}
            </button>
            <button style={filter === 'inactive' ? styles.filterActive : styles.filterButton} onClick={() => setFilter('inactive')}>
              {t('organizations.employees.filters.inactive')}
            </button>
          </div>
        )}
      </div>

      {employees.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <Users size={48} color="#999" style={{ marginBottom: '16px', opacity: 0.5 }} />
          <p style={styles.emptyText}>{t('organizations.employees.noEmployeesFound')}</p>
        </div>
      ) : (
        <div style={styles.table}>
          <div style={styles.tableHeader}>
            <div style={styles.tableCell}>{t('organizations.employees.tableHeaders.name')}</div>
            <div style={styles.tableCell}>{t('organizations.employees.tableHeaders.position')}</div>
            <div style={styles.tableCell}>{t('organizations.employees.tableHeaders.department')}</div>
            <div style={styles.tableCell}>{t('organizations.employees.tableHeaders.status')}</div>
            <div style={styles.tableCell}>{t('organizations.employees.tableHeaders.role')}</div>
            {isAdmin && <div style={styles.tableCell}>{t('organizations.employees.tableHeaders.actions')}</div>}
          </div>
          {employees.map((emp) => {
            const user = emp.user || emp.userId;
            const isHovered = hoveredRow === user?._id;
            const rowStyle = isHovered 
              ? { ...styles.tableRow, ...styles.tableRowHover }
              : styles.tableRow;
            
            return (
              <div 
                key={user?._id || emp._id} 
                style={rowStyle}
                onMouseEnter={() => setHoveredRow(user?._id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <div style={{ ...styles.tableCell }}>
                  <div style={styles.tableCellName}>
                    {user?.name || user?.username || '-'}
                  </div>
                  {user?.email && (
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#6b7280', 
                      marginTop: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Mail size={12} />
                      {user.email}
                    </div>
                  )}
                </div>
                <div style={styles.tableCell}>{emp.position || '-'}</div>
                <div style={styles.tableCell}>{emp.department || '-'}</div>
                <div style={styles.tableCell}>
                  <span
                    style={{
                      ...styles.statusBadge,
                      background:
                        emp.status === 'active' ? '#dcfce7' : emp.status === 'pending' ? '#fef3c7' : '#fee2e2',
                      color: emp.status === 'active' ? '#15803d' : emp.status === 'pending' ? '#b45309' : '#dc2626'
                    }}
                  >
                    {t(`organizations.employees.status.${emp.status}`, { defaultValue: emp.status })}
                  </span>
                </div>
                <div style={styles.tableCell}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {emp.isAdmin && (
                      <span
                        style={{
                          ...styles.statusBadge,
                          background: '#fef3c7',
                          color: '#92400e',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Shield size={12} />
                        {t('organizations.employees.roles.admin')}
                      </span>
                    )}
                    {emp.isProjectManager && (
                      <span
                        style={{
                          ...styles.statusBadge,
                          background: '#dbeafe',
                          color: '#1e40af',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Target size={12} />
                        {t('organizations.employees.roles.projectManager')}
                      </span>
                    )}
                    {!emp.isAdmin && !emp.isProjectManager && (
                      <span
                        style={{
                          ...styles.statusBadge,
                          background: '#f3f4f6',
                          color: '#6b7280',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <User size={12} />
                        {t('organizations.employees.roles.employee')}
                      </span>
                    )}
                  </div>
                </div>
                {isAdmin && (
                  <div style={styles.tableCell}>
                    <div style={styles.actionButtons}>
                      {emp.status === 'pending' && (
                        <button 
                          style={{
                            ...styles.actionButton,
                            background: '#f0fdf4',
                            color: '#15803d',
                            border: '1px solid #bbf7d0',
                            boxShadow: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }} 
                          onClick={() => handleStatusChange(user._id, 'active')}
                          onMouseEnter={(e) => {
                            e.target.style.background = '#dcfce7';
                            e.target.style.borderColor = '#86efac';
                            e.target.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = '#f0fdf4';
                            e.target.style.borderColor = '#bbf7d0';
                            e.target.style.transform = 'translateY(0)';
                          }}
                        >
                          <UserCheck size={14} />
                          {t('organizations.employees.actions.approve')}
                        </button>
                      )}
                      {emp.status === 'active' && (
                        <>
                          <button
                            style={{
                              ...styles.actionButton,
                              background: emp.isProjectManager ? '#fef9e7' : '#eff6ff',
                              color: emp.isProjectManager ? '#92400e' : '#1e40af',
                              border: emp.isProjectManager ? '1px solid #fde68a' : '1px solid #bfdbfe',
                              boxShadow: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            onClick={() => handleToggleProjectManager(user._id, emp.isProjectManager)}
                            onMouseEnter={(e) => {
                              if (emp.isProjectManager) {
                                e.target.style.background = '#fef3c7';
                                e.target.style.borderColor = '#fcd34d';
                              } else {
                                e.target.style.background = '#dbeafe';
                                e.target.style.borderColor = '#93c5fd';
                              }
                              e.target.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={(e) => {
                              if (emp.isProjectManager) {
                                e.target.style.background = '#fef9e7';
                                e.target.style.borderColor = '#fde68a';
                              } else {
                                e.target.style.background = '#eff6ff';
                                e.target.style.borderColor = '#bfdbfe';
                              }
                              e.target.style.transform = 'translateY(0)';
                            }}
                          >
                            {emp.isProjectManager ? (
                              <>
                                <ShieldOff size={14} />
                                {t('organizations.employees.actions.removeProjectManager')}
                              </>
                            ) : (
                              <>
                                <Crown size={14} />
                                {t('organizations.employees.actions.makeProjectManager')}
                              </>
                            )}
                          </button>
                          <button 
                            style={{
                              ...styles.actionButton,
                              background: '#fffbeb',
                              color: '#92400e',
                              border: '1px solid #fde68a',
                              boxShadow: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            onClick={() => handleStatusChange(user._id, 'inactive')}
                            onMouseEnter={(e) => {
                              e.target.style.background = '#fef3c7';
                              e.target.style.borderColor = '#fcd34d';
                              e.target.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = '#fffbeb';
                              e.target.style.borderColor = '#fde68a';
                              e.target.style.transform = 'translateY(0)';
                            }}
                          >
                            <UserMinus size={14} />
                            {t('organizations.employees.actions.deactivate')}
                          </button>
                        </>
                      )}
                      <button 
                        style={{
                          ...styles.actionButton,
                          background: '#fef2f2',
                          color: '#991b1b',
                          border: '1px solid #fecaca',
                          boxShadow: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        onClick={() => handleRemove(user._id)}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#fee2e2';
                          e.target.style.borderColor = '#fca5a5';
                          e.target.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = '#fef2f2';
                          e.target.style.borderColor = '#fecaca';
                          e.target.style.transform = 'translateY(0)';
                        }}
                      >
                        <UserX size={14} />
                        {t('organizations.employees.actions.remove')}
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
