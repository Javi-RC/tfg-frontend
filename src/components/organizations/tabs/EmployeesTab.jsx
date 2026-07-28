import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users } from 'lucide-react';
import { showError } from '../../../utils/toast';
import {
  getOrganizationEmployees,
  removeEmployee,
  updateEmployeeStatus,
} from '../../../api/organization';
import EmployeeFilterBar from './EmployeeFilterBar';
import EmployeeRow from './EmployeeRow';
import Pagination from '../../common/Pagination';

/**
 * EmployeesTab
 */
export default function EmployeesTab({ organizationId, isAdmin, onUpdate, styles }) {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [hoveredRow, setHoveredRow] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [pagination, setPagination] = useState(null);

  const loadEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, limit };
      if (filter !== 'all') params.status = filter;
      const res = await getOrganizationEmployees(organizationId, params);
      if (res.data?.success && Array.isArray(res.data?.data)) {
        setEmployees(res.data.data);
        if (res.data.pagination) setPagination(res.data.pagination);
      } else if (Array.isArray(res.data)) {
        setEmployees(res.data);
        setPagination(null);
      } else {
        setEmployees([]);
        setPagination(null);
      }
    } catch (err) {
      console.error('Error loading employees:', err);
      setEmployees([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [organizationId, page, limit, filter]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await updateEmployeeStatus(organizationId, userId, newStatus);
      loadEmployees();
      if (onUpdate) onUpdate();
    } catch (err) {
      showError(
        err.response?.data?.error || err.message || t('organizations.employees.errors.updateStatus')
      );
    }
  };

  const handleRemove = async (userId) => {
    if (!confirm(t('organizations.employees.confirmations.removeEmployee'))) return;

    try {
      await removeEmployee(organizationId, userId);
      loadEmployees();
      if (onUpdate) onUpdate();
    } catch (err) {
      showError(
        err.response?.data?.error ||
          err.message ||
          t('organizations.employees.errors.removeEmployee')
      );
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
      showError(
        err.response?.data?.error ||
          err.message ||
          t('organizations.employees.errors.updateProjectManager')
      );
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
          <EmployeeFilterBar filter={filter} setFilter={(f) => { setFilter(f); setPage(1); }} styles={styles} />
        )}
      </div>

      {employees.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <Users size={48} color="#6B7280" style={{ marginBottom: '16px', opacity: 0.5 }} />
          <p style={styles.emptyText}>{t('organizations.employees.noEmployeesFound')}</p>
        </div>
      ) : (
        <div style={styles.table}>
          <div style={styles.tableHeader}>
            <div style={styles.tableCell}>{t('organizations.employees.tableHeaders.name')}</div>
            <div style={styles.tableCell}>{t('organizations.employees.tableHeaders.position')}</div>
            <div style={styles.tableCell}>
              {t('organizations.employees.tableHeaders.department')}
            </div>
            <div style={styles.tableCell}>{t('organizations.employees.tableHeaders.status')}</div>
            <div style={styles.tableCell}>{t('organizations.employees.tableHeaders.role')}</div>
            {isAdmin && (
              <div style={styles.tableCell}>
                {t('organizations.employees.tableHeaders.actions')}
              </div>
            )}
          </div>
          {employees.map((emp) => {
            const user = emp.user || emp.userId;
            return (
              <EmployeeRow
                key={user?._id || emp._id}
                emp={emp}
                isHovered={hoveredRow === user?._id}
                onMouseEnter={() => setHoveredRow(user?._id)}
                onMouseLeave={() => setHoveredRow(null)}
                isAdmin={isAdmin}
                onStatusChange={handleStatusChange}
                onRemove={handleRemove}
                onToggleProjectManager={handleToggleProjectManager}
                styles={styles}
              />
            );
          })}
        </div>
      )}

      {pagination && pagination.pages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={pagination.pages}
          onPageChange={setPage}
          limit={limit}
          onLimitChange={(l) => { setLimit(l); setPage(1); }}
          label={t('navigation.aria.employeesPagination')}
        />
      )}
    </div>
  );
}
