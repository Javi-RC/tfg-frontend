import React from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink, CheckCircle } from 'lucide-react';

export default function EmployeeActions({ employee, onAssign }) {
  const { t } = useTranslation();

  const handleAssign = () => {
    const userId = employee?.user?._id;
    if (!onAssign || !userId) return;
    onAssign(userId);
  };

  return (
    <div style={styles.footer}>
      {employee.cv?.contact?.links && (
        <div style={styles.contactLinks}>
          {employee.cv.contact.links.linkedin && (
            <a
              href={employee.cv.contact.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.iconLink}
              title={t('team.employeeDetail.links.linkedin')}
            >
              <ExternalLink size={16} />
              {t('team.employeeDetail.links.linkedin')}
            </a>
          )}
          {employee.cv?.contact?.links.github && (
            <a
              href={employee.cv.contact.links.github}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.iconLink}
              title={t('team.employeeDetail.links.github')}
            >
              <ExternalLink size={16} />
              {t('team.employeeDetail.links.github')}
            </a>
          )}
          {employee.cv?.contact?.links.portfolio && (
            <a
              href={employee.cv.contact.links.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.iconLink}
              title={t('team.employeeDetail.links.portfolio')}
            >
              <ExternalLink size={16} />
              {t('team.employeeDetail.links.portfolio')}
            </a>
          )}
        </div>
      )}

      {onAssign && (
        <button type="button" onClick={handleAssign} style={styles.assignButton}>
          <CheckCircle size={18} />
          {t('team.employeeDetail.actions.addToTeam')}
        </button>
      )}
    </div>
  );
}

const styles = {
  footer: {
    padding: '16px 24px',
    borderTop: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-bg-muted)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
  },
  contactLinks: {
    display: 'flex',
    gap: '12px',
  },
  iconLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    fontSize: '13px',
    color: '#007bff',
    textDecoration: 'none',
    backgroundColor: '#fff',
    border: '1px solid var(--color-border)',
    borderRadius: '6px',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  assignButton: {
    padding: '10px 20px',
    backgroundColor: 'var(--color-success)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'background-color 0.2s',
  },
};
