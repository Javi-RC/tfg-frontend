import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import {
  getEmployeesWithoutTest,
  notifyPendingEmployees,
  notifyPendingEmployee,
  getOrganizationBFI44Stats,
} from '../api/bfi44Admin';
import AdminStatsSection from '../components/personality/AdminStatsSection';
import EmployeesTable from '../components/personality/EmployeesTable';

/**
 * BFI44AdminPage Component
 * Admin/PM panel for managing BFI-44 completion across the organization.
 * Organization is resolved server-side from the JWT token.
 */
export default function BFI44AdminPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifying, setNotifying] = useState(false);
  const [notifyingUserId, setNotifyingUserId] = useState(null);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const isAuthorized = user?.role === 'org_admin' || user?.isProjectManager === true;

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
        setEmployees(employeesResult.value.data?.employees || []);
      }

      // Show error only if all requests failed
      const failures = results.filter((r) => r.status === 'rejected');
      if (failures.length === results.length) {
        const firstErr = failures[0].reason;
        setError(
          firstErr?.response?.data?.error || firstErr?.message || t('bfi44Admin.errorLoading')
        );
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || t('bfi44Admin.errorLoading'));
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
        message: t('bfi44Admin.employeesNotified', { count: notified }),
      });

      await loadData();
    } catch (err) {
      setToast({
        type: 'error',
        message: err.response?.data?.error || err.message || t('bfi44Admin.errorNotifying'),
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
          message: t('bfi44Admin.employeeNotified', { name: data.userName || employee.name }),
        });
      } else {
        setToast({
          type: 'info',
          message: data?.reason || t('bfi44Admin.employeeAlreadyCompleted'),
        });
      }

      await loadData();
    } catch (err) {
      setToast({
        type: 'error',
        message: err.response?.data?.error || t('bfi44Admin.errorNotifying'),
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
          <p style={{ color: 'var(--color-error)', textAlign: 'center', padding: '60px 20px' }}>
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

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.headerCard}>
          <button type="button" style={styles.backButton} onClick={() => navigate(-1)}>
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
        {stats && <AdminStatsSection stats={stats} />}

        {/* Employees Without Test */}
        <EmployeesTable
          employees={employees}
          notifying={notifying}
          notifyingUserId={notifyingUserId}
          onNotifyAll={handleNotifyAll}
          onNotifyOne={handleNotifyOne}
        />
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            ...styles.toast,
            background: toast.type === 'success' ? '#065F46' : '#991B1B',
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
    background: 'var(--gradient-page)',
    padding: '104px 20px 40px',
    fontFamily:
      'Poppins, Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
  },
  content: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  loadingWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid var(--color-primary-track)',
    borderTopColor: 'var(--color-primary)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '16px',
    fontSize: '16px',
    color: 'var(--color-text-muted)',
  },
  headerCard: {
    background: 'var(--gradient-primary)',
    borderRadius: '18px',
    padding: '40px',
    marginBottom: '24px',
    boxShadow: 'var(--shadow-primary)',
    color: 'white',
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
    marginBottom: '16px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: 'white',
    margin: 0,
  },
  subtitle: {
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.85)',
    margin: '8px 0 0',
  },
  errorBanner: {
    padding: '12px 16px',
    background: 'var(--color-danger-bg)',
    border: '1px solid var(--color-danger-bg)',
    borderRadius: '10px',
    color: 'var(--color-danger-strong)',
    fontSize: '14px',
    marginBottom: '16px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px',
    background: 'white',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
  },
  statIcon: {
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    flexShrink: 0,
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: 'var(--color-text-heading)',
    lineHeight: 1,
  },
  statLabel: {
    fontSize: '14px',
    color: 'var(--color-text-muted)',
    marginTop: '4px',
  },
  progressSection: {
    background: 'white',
    border: '1px solid var(--color-border)',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  progressLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--color-text-strong)',
  },
  progressValue: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--color-success)',
  },
  progressBarTrack: {
    width: '100%',
    height: '10px',
    background: 'var(--color-border)',
    borderRadius: '5px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--color-success), #34D399)',
    borderRadius: '5px',
    transition: 'width 0.6s ease',
  },
  sectionCard: {
    background: 'white',
    border: '1px solid var(--color-border)',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid var(--color-border)',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--color-text-heading)',
    margin: 0,
  },
  notifyButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'var(--color-primary)',
    color: 'white',
    border: 'none',
    borderRadius: '24px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '48px 24px',
    gap: '12px',
  },
  emptyText: {
    fontSize: '15px',
    color: 'var(--color-text-muted)',
    margin: 0,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '12px 24px',
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    background: 'var(--color-bg-muted)',
    borderBottom: '1px solid var(--color-border)',
  },
  tr: {
    borderBottom: '1px solid var(--color-bg-subtle)',
  },
  td: {
    padding: '14px 24px',
    fontSize: '14px',
    color: 'var(--color-text-strong)',
  },
  notifyOneButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'var(--color-text-strong)',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    padding: '6px 14px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
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
    animation: 'slideIn 0.3s ease',
  },
};
