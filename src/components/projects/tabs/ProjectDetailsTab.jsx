import React from 'react';
import { useTranslation } from 'react-i18next';
import InfoGrid from '../../common/InfoGrid';
import { translateProjectLevel, translateWorkMode } from '../../../utils/projectFormatters';

export default function ProjectDetailsTab({ project }) {
  const { t } = useTranslation();

  return (
    <div>
      <div style={styles.detailsSection}>
        <h3 style={styles.sectionTitle}>{t('projects.detailPage.technicalRequirements')}</h3>
        <InfoGrid
          items={[
            {
              label: t('projects.detailPage.experienceLevel'),
              value: translateProjectLevel(project.requiredExperienceLevel),
            },
            {
              label: t('projects.detailPage.documentationLevel'),
              value: translateProjectLevel(project.documentationLevel),
            },
            {
              label: t('projects.detailPage.technologies'),
              value: project.mainTechnologies?.join(', ') || t('common.notAvailable'),
            },
          ]}
        />
      </div>

      <div style={styles.detailsSection}>
        <h3 style={styles.sectionTitle}>{t('projects.detailPage.workDistribution')}</h3>
        <InfoGrid
          items={[
            {
              label: t('projects.detailPage.workMode'),
              value: project.workMode
                ? translateWorkMode(project.workMode)
                : t('common.notAvailable'),
            },
            {
              label: t('projects.detailPage.involvedCountries'),
              value: project.involvedCountries?.join(', ') || t('common.notAvailable'),
            },
            {
              label: t('projects.detailPage.distributedExperience'),
              value: translateProjectLevel(project.distributedWorkExperienceLevel),
            },
            {
              label: t('projects.detailPage.culturalDiversity'),
              value: translateProjectLevel(project.culturalDiversityLevel),
            },
          ]}
        />
      </div>

      <div style={styles.detailsSection}>
        <h3 style={styles.sectionTitle}>{t('projects.detailPage.management')}</h3>
        <InfoGrid
          items={[
            {
              label: t('projects.detailPage.managementMethod'),
              value: project.managementMethod || t('common.notAvailable'),
            },
            {
              label: t('projects.detailPage.standupFrequency'),
              value: project.followUpFrequency?.standups?.frequency || t('common.notAvailable'),
            },
          ]}
        />
      </div>
    </div>
  );
}

const styles = {
  detailsSection: {
    marginBottom: '32px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--color-text-primary)',
    marginBottom: '20px',
  },
};
