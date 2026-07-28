import React from 'react';
import { useTranslation } from 'react-i18next';

const formatYear = (dateStr, fallback = 'N/A') => {
  if (!dateStr) return fallback;
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? fallback : date.getFullYear();
};

export default function EmployeeEducation({ employee }) {
  const { t } = useTranslation();
  const cv = employee.cv;
  const notAvailableLabel = t('common.notAvailable');

  if (!cv?.education || !Array.isArray(cv.education) || cv.education.length === 0) return null;

  return (
    <div style={styles.section}>
      <div style={styles.subsection}>
        <h3 style={styles.subsectionTitle}>{t('cv.education')}</h3>
        <div style={styles.educationList}>
          {cv.education.map((edu) => (
            <div key={edu.institution} style={styles.eduCard}>
              <div style={styles.eduTitle}>{edu.degree}</div>
              <div style={styles.eduInstitution}>{edu.institution}</div>
              {edu.fieldOfStudy && <div style={styles.eduField}>{edu.fieldOfStudy}</div>}
              {(edu.startDate || edu.endDate) && (
                <div style={styles.eduDates}>
                  {edu.startDate ? formatYear(edu.startDate, notAvailableLabel) : ''}
                  {' - '}
                  {edu.endDate
                    ? formatYear(edu.endDate, notAvailableLabel)
                    : t('team.employeeDetail.achievements.present')}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  subsection: {
    marginBottom: '20px',
  },
  subsectionTitle: {
    margin: '0 0 12px 0',
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--color-text-primary)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  educationList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  eduCard: {
    paddingLeft: '16px',
    borderLeft: '3px solid #007bff',
  },
  eduTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--color-text-primary)',
    marginBottom: '4px',
  },
  eduInstitution: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    marginBottom: '4px',
  },
  eduField: {
    fontSize: '13px',
    color: 'var(--color-text-secondary)',
    marginBottom: '6px',
  },
  eduDates: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    fontStyle: 'italic',
  },
};
