import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users, Bell, BarChart3, ArrowLeft, CheckCircle, Clock } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import {
  getEmployeesWithoutTest,
  notifyPendingEmployees,
  notifyPendingEmployee,
  getOrganizationBFI44Stats
} from '../api/bfi44Admin';

/**
 * BFI44AdminPage Component
 * Admin/PM panel for managing BFI-44 completion across the organization.
 * Organization is resolved server-side from the JWT token.
 */
export default function BFI44AdminPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [stats, setStats] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifying, setNotifying] = useState(false);
  const [notifyingUserId, setNotifyingUserId] = useState(null);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const isAuthorized =
    user?.role === 'org_admin' || user?.isProjectManager === true;

  useEffect(() => {
    if (!isAuthorized) return;
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthorized]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const isOrgAdmin = user?.role === 'org_admin';

      // Stats are only available for org_admin
      const requests = [getEmployeesWithoutTest()];
      if (isOrgAdmin) {
        requests.push(getOrganizationBFI44Stats());
      }

      const results = await Promise.allSettled(requests);

      const [employeesResult] = results;
      const statsResult = isOrgAdmin ? results[1] : null;

      if (statsResult?.status === 'fulfilled') {
        setStats(statsResult.value.data);
      }

      if (employeesResult.status === 'fulfilled') {
        setEmployees(
          employeesResult.value.data?.employees || []
        );
      }

      // Show error only if all requests failed
      const failures = results.filter(r => r.status === 'rejected');
      if (failures.length === results.length) {
        const firstErr = failures[0].reason;
        setError(
          firstErr?.response?.data?.error ||
          firstErr?.message ||
          t('bfi44Admin.errorLoading')
        );
      }
    } catch (err) {
      console.error('Error loading BFI-44 admin data:', err);
      setError(
        err.response?.data?.error ||
        err.message ||
        t('bfi44Admin.errorLoading')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNotifyAll = async () => {
    try {
      setNotifying(true);
      const res = await notifyPendingEmployees();
      const notified = res.data?.notified ?? 0;

      setToast({
        type: 'success',
        message: t('bfi44Admin.employeesNotified', { count: notified })
      });

      await loadData();
    } catch (err) {
      console.error('Error notifying employees:', err);
      setToast({
        type: 'error',
        message:
          err.response?.data?.error ||
          err.message ||
          t('bfi44Admin.errorNotifying')
      });
    } finally {
      setNotifying(false);
    }
  };

  const handleNotifyOne = async (employee) => {
    const userId = employee.id || employee._id;
    try {
      setNotifyingUserId(userId);
      const res = await notifyPendingEmployee(userId);
      const data = res.data;

      if (data?.notified) {
        setToast({
          type: 'success',
          message: t('bfi44Admin.employeeNotified', { name: data.userName || employee.name })
        });
      } else {
        setToast({
          type: 'info',
          message: data?.reason || t('bfi44Admin.employeeAlreadyCompleted')
        });
      }

      await loadData();
    } catch (err) {
      console.error('Error notifying employee:', err);
      setToast({
        type: 'error',
        message: err.response?.data?.error || t('bfi44Admin.errorNotifying')
      });
    } finally {
      setNotifyingUserId(null);
    }
  };

  if (!user) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingWrapper}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>{t('bfi44Admin.loading')}</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <p style={{ color: '#c0392b', textAlign: 'center', padding: '60px 20px' }}>
            {t('bfi44Admin.unauthorized')}
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingWrapper}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>{t('bfi44Admin.loading')}</p>
        </div>
      </div>
    );
  }

  const completionRate = stats?.completionRate ?? 0;
  const totalEmployees = stats?.totalEmployees ?? 0;
  const completed = stats?.completed ?? 0;
  const pending = stats?.pending ?? totalEmployees - completed;

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.headerCard}>
          <button style={styles.backButton} onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
            {t('common.back')}
          </button>
          <h1 style={styles.title}>{t('bfi44Admin.title')}</h1>
          <p style={styles.subtitle}>{t('bfi44Admin.subtitle')}</p>
        </div>

        {error && (
          <div style={styles.errorBanner} role="alert">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div style={styles.statsGrid}>
            <div style={{ ...styles.statCard, borderLeft: '4px solid #3B82F6' }}>
              <div style={{ ...styles.statIcon, background: '#EFF6FF' }}>
                <Users size={24} color="#3B82F6" />
              </div>
              <div>
                <div style={styles.statValue}>{totalEmployees}</div>
                <div style={styles.statLabel}>{t('bfi44Admin.stats.totalEmployees')}</div>
              </div>
            </div>

            <div style={{ ...styles.statCard, borderLeft: '4px solid #10B981' }}>
              <div style={{ ...styles.statIcon, background: '#D1FAE5' }}>
                <CheckCircle size={24} color="#10B981" />
              </div>
              <div>
                <div style={styles.statValue}>{completed}</div>
                <div style={styles.statLabel}>{t('bfi44Admin.stats.completed')}</div>
              </div>
            </div>

            <div style={{ ...styles.statCard, borderLeft: '4px solid #F59E0B' }}>
              <div style={{ ...styles.statIcon, background: '#FEF3C7' }}>
                <Clock size={24} color="#F59E0B" />
              </div>
              <div>
                <div style={styles.statValue}>{pending}</div>
                <div style={styles.statLabel}>{t('bfi44Admin.stats.pending')}</div>
              </div>
            </div>

            <div style={{ ...styles.statCard, borderLeft: '4px solid #8B5CF6' }}>
              <div style={{ ...styles.statIcon, background: '#EDE9FE' }}>
                <BarChart3 size={24} color="#8B5CF6" />
              </div>
              <div>
                <div style={styles.statValue}>{Math.round(completionRate)}%</div>
                <div style={styles.statLabel}>{t('bfi44Admin.stats.completionRate')}</div>
              </div>
            </div>
          </div>
        )}

        {/* Completion Progress Bar */}
        {stats && (
          <div style={styles.progressSection}>
            <div style={styles.progressHeader}>
              <span style={styles.progressLabel}>{t('bfi44Admin.completionProgress')}</span>
              <span style={styles.progressValue}>{Math.round(completionRate)}%</span>
            </div>
            <div style={styles.progressBarTrack}>
              <div
                style={{
                  ...styles.progressBarFill,
                  width: `${Math.min(completionRate, 100)}%`
                }}
              />
            </div>
          </div>
        )}

        {/* Employees Without Test */}
        <div style={styles.sectionCard}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>{t('bfi44Admin.pendingEmployees')}</h2>
            {employees.length > 0 && (
              <button
                type="button"
                onClick={handleNotifyAll}
                disabled={notifying}
                style={styles.notifyButton}
              >
                <Bell size={16} />
                {notifying
                  ? t('bfi44Admin.sending')
                  : t('bfi44Admin.notifyAll')}
              </button>
            )}
          </div>

          {employees.length === 0 ? (
            <div style={styles.emptyState}>
              <CheckCircle size={40} color="#10B981" />
              <p style={styles.emptyText}>{t('bfi44Admin.allCompleted')}</p>
            </div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>{t('bfi44Admin.table.name')}</th>
                    <th style={styles.th}>{t('bfi44Admin.table.email')}</th>
                    <th style={{...styles.th, textAlign: 'right'}}>{t('bfi44Admin.table.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => {
                    const empId = emp.id || emp._id;
                    const isNotifyingThis = notifyingUserId === empId;
                    return (
                      <tr key={empId || emp.email} style={styles.tr}>
                        <td style={styles.td}>
                          {emp.name || emp.username || '—'}
                        </td>
                        <td style={styles.td}>{emp.email}</td>
                        <td style={{...styles.td, textAlign: 'right'}}>
                          <button
                            type="button"
                            onClick={() => handleNotifyOne(emp)}
                            disabled={isNotifyingThis || notifying}
                            style={{
                              ...styles.notifyOneButton,
                              opacity: isNotifyingThis || notifying ? 0.5 : 1
                            }}
                            aria-label={t('bfi44Admin.notifyOne', { name: emp.name })}
                          >
                            <Bell size={14} />
                            {isNotifyingThis
                              ? t('bfi44Admin.sending')
                              : t('bfi44Admin.notify')}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            ...styles.toast,
            background: toast.type === 'success' ? '#065F46' : '#991B1B'
          }}
          role="status"
          aria-live="polite"
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e8edf2 100%)',
    padding: '104px 20px 40px',
    fontFamily:
      'Poppins, Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial'
  },
  content: {
    maxWidth: '1000px',
    margin: '0 auto'
  },
  loadingWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh'
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #e2e8f0',
    borderTopColor: '#3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    marginTop: '16px',
    fontSize: '16px',
    color: '#666'
  },
  headerCard: {
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    borderRadius: '16px',
    padding: '40px',
    marginBottom: '24px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
    color: 'white'
  },
  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(255,255,255,0.15)',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 14px',
    color: 'white',
    fontSize: '13px',
    cursor: 'pointer',
    marginBottom: '16px'
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: 'white',
    margin: 0
  },
  subtitle: {
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.85)',
    margin: '8px 0 0'
  },
  errorBanner: {
    padding: '12px 16px',
    background: '#FEE2E2',
    border: '1px solid #FECACA',
    borderRadius: '10px',
    color: '#991B1B',
    fontSize: '14px',
    marginBottom: '16px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px',
    background: 'white',
    border: '1px solid #E5E7EB',
    borderRadius: '8px'
  },
  statIcon: {
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    flexShrink: 0
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
    lineHeight: 1
  },
  statLabel: {
    fontSize: '14px',
    color: '#6B7280',
    marginTop: '4px'
  },
  progressSection: {
    background: 'white',
    border: '1px solid #E5E7EB',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px'
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px'
  },
  progressLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151'
  },
  progressValue: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#10B981'
  },
  progressBarTrack: {
    width: '100%',
    height: '10px',
    background: '#E5E7EB',
    borderRadius: '5px',
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #10B981, #34D399)',
    borderRadius: '5px',
    transition: 'width 0.6s ease'
  },
  sectionCard: {
    background: 'white',
    border: '1px solid #E5E7EB',
    borderRadius: '12px',
    overflow: 'hidden'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid #E5E7EB'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#111827',
    margin: 0
  },
  notifyButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: '#111',
    color: 'white',
    border: 'none',
    borderRadius: '24px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '48px 24px',
    gap: '12px'
  },
  emptyText: {
    fontSize: '15px',
    color: '#6B7280',
    margin: 0
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    textAlign: 'left',
    padding: '12px 24px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    background: '#F9FAFB',
    borderBottom: '1px solid #E5E7EB'
  },
  tr: {
    borderBottom: '1px solid #F3F4F6'
  },
  td: {
    padding: '14px 24px',
    fontSize: '14px',
    color: '#374151'
  },
  notifyOneButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: '#374151',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    padding: '6px 14px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'opacity 0.2s'
  },
  toast: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    color: 'white',
    padding: '14px 24px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '500',
    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
    zIndex: 1300,
    animation: 'slideIn 0.3s ease'
  }
};
