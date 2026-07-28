import React from 'react';
import { useTranslation } from 'react-i18next';
import { Crown, Mail, Target, Shield, ShieldOff, User, UserCheck, UserMinus, UserX } from 'lucide-react';

export default function EmployeeRow({
  emp,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  isAdmin,
  onStatusChange,
  onRemove,
  onToggleProjectManager,
  styles,
}) {
  const { t } = useTranslation();
  const user = emp.user || emp.userId;
  const rowStyle = isHovered
    ? { ...styles.tableRow, ...styles.tableRowHover }
    : styles.tableRow;

  return (
    <div
      key={user?._id || emp._id}
      style={rowStyle}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div style={{ ...styles.tableCell }}>
        <div style={styles.tableCellName}>{user?.name || user?.username || '-'}</div>
        {user?.email && (
          <div
            style={{
              fontSize: '12px',
              color: 'var(--color-text-muted)',
              marginTop: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
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
              emp.status === 'active'
                ? '#dcfce7'
                : emp.status === 'pending'
                  ? '#fef3c7'
                  : '#fee2e2',
            color:
              emp.status === 'active'
                ? '#15803d'
                : emp.status === 'pending'
                  ? '#b45309'
                  : '#dc2626',
          }}
        >
          {t(`organizations.employees.status.${emp.status}`, {
            defaultValue: emp.status,
          })}
        </span>
      </div>
      <div style={styles.tableCell}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {emp.isAdmin && (
            <span
              style={{
                ...styles.statusBadge,
                background: 'var(--color-warning-bg)',
                color: 'var(--color-warning-dark)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
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
                gap: '4px',
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
                background: 'var(--color-bg-subtle)',
                color: 'var(--color-text-muted)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
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
              <button type="button"
                style={{
                  ...styles.actionButton,
                  background: '#f0fdf4',
                  color: 'var(--color-success-dark)',
                  border: '1px solid #bbf7d0',
                  boxShadow: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
                onClick={() => onStatusChange(user._id, 'active')}
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
                <button type="button"
                  style={{
                    ...styles.actionButton,
                    background: emp.isProjectManager ? '#fef9e7' : '#eff6ff',
                    color: emp.isProjectManager ? '#92400e' : '#1e40af',
                    border: emp.isProjectManager
                      ? '1px solid #fde68a'
                      : '1px solid #bfdbfe',
                    boxShadow: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                  onClick={() => onToggleProjectManager(user._id, emp.isProjectManager)}
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
                <button type="button"
                  style={{
                    ...styles.actionButton,
                    background: '#fffbeb',
                    color: 'var(--color-warning-dark)',
                    border: '1px solid var(--color-warning-bg)',
                    boxShadow: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                  onClick={() => onStatusChange(user._id, 'inactive')}
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
            <button type="button"
              style={{
                ...styles.actionButton,
                background: '#fef2f2',
                color: 'var(--color-danger-strong)',
                border: '1px solid var(--color-danger-bg)',
                boxShadow: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
              onClick={() => onRemove(user._id)}
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
}
