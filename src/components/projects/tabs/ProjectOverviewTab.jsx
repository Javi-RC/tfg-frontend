import React from 'react';
import { useTranslation } from 'react-i18next';
import InfoGrid from '../../common/InfoGrid';
import { formatDate } from '../../../utils/projectFormatters';

export default function ProjectOverviewTab({ project }) {
  const { t } = useTranslation();

  return (
    <div>
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>{t('projects.detailPage.projectInformation')}</h3>
        <InfoGrid
          items={[
            {
              label: t('projects.projectManager'),
              value: project.projectManager?.name || t('common.notAvailable'),
            },
            { label: t('projects.startDate'), value: formatDate(project.estimatedStartDate) },
            { label: t('projects.endDate'), value: formatDate(project.estimatedEndDate) },
            {
              label: t('projects.detailPage.duration'),
              value: (
                <>
                  {project.expectedDuration?.value}{' '}
                  {project.expectedDuration?.unit
                    ? t(`projects.timeUnits.${project.expectedDuration.unit}`, {
                        defaultValue: project.expectedDuration.unit,
                      })
                    : ''}
                </>
              ),
            },
          ]}
        />
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>{t('projects.description')}</h3>
        <p style={styles.description}>{project.briefDescription}</p>
      </div>
    </div>
  );
}

const styles = {
  section: {
    marginBottom: '32px',
    paddingBottom: '32px',
    borderBottom: '1px solid var(--color-border)',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--color-text-primary)',
    marginBottom: '20px',
  },
  description: {
    fontSize: '15px',
    color: 'var(--color-text-strong)',
    lineHeight: '1.7',
    margin: 0,
  },
};
