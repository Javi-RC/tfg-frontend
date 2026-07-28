import React from 'react';
import { useTranslation } from 'react-i18next';
import { Award, ExternalLink } from 'lucide-react';
import i18n from '../../i18n';

const formatDate = (dateStr, fallback = 'N/A') => {
  if (!dateStr) return fallback;
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? fallback : date.toLocaleDateString(i18n.language);
};

export default function EmployeeAchievements({ employee }) {
  const { t } = useTranslation();
  const cv = employee.cv;
  const notAvailableLabel = t('common.notAvailable');

  const hasCertifications =
    cv?.certifications && Array.isArray(cv.certifications) && cv.certifications.length > 0;
  const hasAwards = cv?.achievements?.awards && cv.achievements.awards.length > 0;
  const hasPublications =
    cv?.achievements?.publications && cv.achievements.publications.length > 0;
  const hasHackathons = cv?.achievements?.hackathons && cv.achievements.hackathons.length > 0;

  if (!hasCertifications && !hasAwards && !hasPublications && !hasHackathons) return null;

  return (
    <div style={styles.section}>
      {hasCertifications && (
        <div style={styles.subsection}>
          <h3 style={styles.subsectionTitle}>
            <Award size={18} />
            {t('cv.certifications')}
          </h3>
          <div style={styles.certList}>
            {cv.certifications.map((cert) => (
              <div key={cert.credentialId || cert.name} style={styles.certCard}>
                <div style={styles.certHeader}>
                  <div style={styles.certName}>{cert.name}</div>
                  <div style={styles.certIssuer}>{cert.issuer}</div>
                </div>
                {cert.date && (
                  <div style={styles.certDate}>
                    {t('team.employeeDetail.achievements.issuedLabel')}:{' '}
                    {formatDate(cert.date, notAvailableLabel)}
                  </div>
                )}
                {cert.credentialId && (
                  <div style={styles.certCredential}>
                    {t('team.employeeDetail.achievements.credentialIdLabel')}: {cert.credentialId}
                  </div>
                )}
                {cert.url && (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.certLink}
                  >
                    <ExternalLink size={14} />
                    {t('team.employeeDetail.achievements.viewCertificate')}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {cv?.achievements && (
        <>
          {hasAwards && (
            <div style={styles.subsection}>
              <h3 style={styles.subsectionTitle}>
                <Award size={18} />
                {t('team.employeeDetail.achievements.awardsTitle')}
              </h3>
              <ul style={styles.achievementList}>
                {cv.achievements.awards.map((award) => (
                  <li key={award} style={styles.achievementItem}>
                    {award}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasPublications && (
            <div style={styles.subsection}>
              <h3 style={styles.subsectionTitle}>
                {t('team.employeeDetail.achievements.publicationsTitle')}
              </h3>
              <ul style={styles.achievementList}>
                {cv.achievements.publications.map((pub) => (
                  <li key={pub} style={styles.achievementItem}>
                    {pub}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasHackathons && (
            <div style={styles.subsection}>
              <h3 style={styles.subsectionTitle}>
                {t('team.employeeDetail.achievements.hackathonsTitle')}
              </h3>
              <ul style={styles.achievementList}>
                {cv.achievements.hackathons.map((hack) => (
                  <li key={hack} style={styles.achievementItem}>
                    {hack}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
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
  certList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  certCard: {
    padding: '14px',
    backgroundColor: 'var(--color-bg-muted)',
    borderRadius: '8px',
    border: '1px solid var(--color-border)',
  },
  certHeader: {
    marginBottom: '8px',
  },
  certName: {
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--color-text-primary)',
    marginBottom: '4px',
  },
  certIssuer: {
    fontSize: '13px',
    color: 'var(--color-text-secondary)',
  },
  certDate: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    marginTop: '6px',
  },
  certCredential: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    marginTop: '4px',
    fontFamily: 'monospace',
  },
  certLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '10px',
    fontSize: '13px',
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: '500',
  },
  achievementList: {
    margin: 0,
    paddingLeft: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  achievementItem: {
    fontSize: '14px',
    color: 'var(--color-text-primary)',
    lineHeight: '1.6',
  },
};
