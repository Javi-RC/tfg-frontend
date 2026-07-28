import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, X, Search, UserPlus } from 'lucide-react';
import { getOrganizationEmployees } from '../../api/organization';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';

/**
 * Employee Assignment Modal
 * Allows project managers to assign employees to projects
 */
export default function EmployeeAssignmentModal({
  organizationId,
  currentEmployees = [],
  onAssign,
  onClose,
}) {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [assignedRole, setAssignedRole] = useState('');

  useEffect(() => {
    loadEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationId]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const res = await getOrganizationEmployees(organizationId);
      const employeeData = res.data?.success ? res.data.data : res.data;

      // Filter out already assigned employees
      const currentEmployeeIds = new Set(currentEmployees.map((e) => e.user?._id || e.user));
      const availableEmployees = employeeData.filter(
        (emp) => !currentEmployeeIds.has(emp.user?._id || emp.user) && emp.status === 'active'
      );

      setEmployees(availableEmployees);
    } catch (error) {
      console.error('Error loading employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const user = emp.user;
    const name = user?.name || '';
    const email = user?.email || '';
    const position = emp.position || '';

    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      position.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleAssign = () => {
    if (selectedEmployee) {
      onAssign(selectedEmployee.user._id, assignedRole);
      setSelectedEmployee(null);
      setAssignedRole('');
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClose(); } }}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>{t('employeeAssignment.title')}</h2>
          <button type="button" style={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div style={styles.content}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search
              size={18}
              color="#6B7280"
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              placeholder={t('employeeAssignment.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ ...styles.searchInput, paddingLeft: '48px' }}
              aria-label={t('employeeAssignment.searchPlaceholder')}
            />
          </div>

          {/* Employee List */}
          {loading ? (
            <p style={styles.loadingText}>{t('employeeAssignment.loadingEmployees')}</p>
          ) : filteredEmployees.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>
                {searchTerm
                  ? t('employeeAssignment.noMatches')
                  : t('employeeAssignment.noAvailable')}
              </p>
            </div>
          ) : (
            <div style={styles.employeeList}>
              {filteredEmployees.map((emp) => (
                <div
                  key={emp.user._id}
                  style={{
                    ...styles.employeeCard,
                    ...(selectedEmployee?.user._id === emp.user._id && styles.employeeCardSelected),
                  }}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedEmployee(emp)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedEmployee(emp);
                    }
                  }}
                >
                  <div style={styles.employeeInfo}>
                    <div style={styles.employeeName}>{emp.user.name}</div>
                    <div style={styles.employeeEmail}>{emp.user.email}</div>
                    {emp.position && <div style={styles.employeePosition}>{emp.position}</div>}
                  </div>
                  {selectedEmployee?.user._id === emp.user._id && (
                    <div style={styles.checkmark}>
                      <CheckCircle size={24} color="#10b981" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Role Input */}
          {selectedEmployee && (
            <div style={styles.roleSection}>
              <label htmlFor="employee-role" style={styles.label}>{t('employeeAssignment.roleLabel')}</label>
              <input
                id="employee-role"
                type="text"
                placeholder={t('employeeAssignment.rolePlaceholder')}
                value={assignedRole}
                onChange={(e) => setAssignedRole(e.target.value)}
                style={styles.input}
              />
            </div>
          )}
        </div>

        <div style={styles.footer}>
          <SecondaryButton onClick={onClose} leftIcon={<X size={16} />}>
            {t('employeeAssignment.cancel')}
          </SecondaryButton>
          <PrimaryButton
            onClick={handleAssign}
            disabled={!selectedEmployee}
            leftIcon={<UserPlus size={16} />}
          >
            {t('employeeAssignment.assignButton')}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modal: {
    background: 'white',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '600px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    borderBottom: '1px solid var(--color-border)',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--color-text-primary)',
    margin: 0,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '32px',
    color: 'var(--color-text-muted)',
    cursor: 'pointer',
    padding: 0,
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    transition: 'all 0.2s',
  },
  content: {
    padding: '24px',
    overflowY: 'auto',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  searchInput: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid var(--color-border)',
    borderRadius: '12px',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  loadingText: {
    textAlign: 'center',
    color: 'var(--color-text-muted)',
    padding: '40px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    color: 'var(--color-text-muted)',
  },
  emptyText: {
    fontSize: '15px',
    margin: 0,
  },
  employeeList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  employeeCard: {
    padding: '16px',
    border: '2px solid var(--color-border)',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  employeeCardSelected: {
    borderColor: 'var(--color-text-primary)',
    background: 'var(--color-bg-muted)',
  },
  employeeInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  employeeName: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--color-text-primary)',
  },
  employeeEmail: {
    fontSize: '14px',
    color: 'var(--color-text-muted)',
  },
  employeePosition: {
    fontSize: '13px',
    color: 'var(--color-text-muted)',
    fontStyle: 'italic',
  },
  checkmark: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: 'var(--color-primary)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: '700',
  },
  roleSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--color-text-primary)',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid var(--color-border)',
    borderRadius: '12px',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    padding: '24px',
    borderTop: '1px solid var(--color-border)',
  },
};
