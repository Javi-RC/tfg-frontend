import React from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, CheckCircle } from 'lucide-react';

export default function EmployeesTable({ employees, notifying, notifyingUserId, onNotifyAll, onNotifyOne }) {
  const { t } = useTranslation();

  return (
    <div style={styles.sectionCard}>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>{t('bfi44Admin.pendingEmployees')}</h2>
        {employees.length > 0 && (
          <button
            type="button"
            onClick={onNotifyAll}
            disabled={notifying}
            style={styles.notifyButton}
          >
            <Bell size={16} />
            {notifying ? t('bfi44Admin.sending') : t('bfi44Admin.notifyAll')}
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
                <th style={{ ...styles.th, textAlign: 'right' }}>
                  {t('bfi44Admin.table.actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => {
                const empId = emp.id || emp._id;
                const isNotifyingThis = notifyingUserId === empId;
                return (
                  <tr key={empId || emp.email} style={styles.tr}>
                    <td style={styles.td}>{emp.name || emp.username || '—'}</td>
                    <td style={styles.td}>{emp.email}</td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => onNotifyOne(emp)}
                        disabled={isNotifyingThis || notifying}
                        style={{
                          ...styles.notifyOneButton,
                          opacity: isNotifyingThis || notifying ? 0.5 : 1,
                        }}
                        aria-label={t('bfi44Admin.notifyOne', { name: emp.name })}
                      >
                        <Bell size={14} />
                        {isNotifyingThis ? t('bfi44Admin.sending') : t('bfi44Admin.notify')}
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
  );
}

const styles = {
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
};
