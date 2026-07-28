import React from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, GraduationCap, ClipboardList, Rocket, Trophy, Globe } from 'lucide-react';
import { useCVStats } from '../hooks/useCVStats';
import SecondaryButton from '../components/SecondaryButton';
import './CVStatsPage.css';

/**
 * CVStatsPage Component
 * Displays statistics about the user's CV
 */
export default function CVStatsPage() {
  const { t, i18n } = useTranslation();
  const { stats, loading, error, loadStats } = useCVStats();

  const totalSkillsTitle = t('cv.stats.totalSkills');
  const technicalSkillsDesc = t('cv.stats.technicalSkills');
  const educationTitle = t('cv.stats.education');
  const academicDegreesDesc = t('cv.stats.academicDegrees');
  const experienceTitle = t('cv.stats.experience');
  const workExperiencesDesc = t('cv.stats.workExperiences');
  const projectsTitle = t('cv.stats.projects');
  const personalProjectsDesc = t('cv.stats.personalProjects');
  const certificationsTitle = t('cv.stats.certifications');
  const professionalCertsDesc = t('cv.stats.professionalCerts');
  const languagesTitle = t('cv.stats.languages');
  const spokenLanguagesDesc = t('cv.stats.spokenLanguages');

  if (loading) {
    return (
      <div className="cv-stats-loading">
        <p className="cv-stats-status-text" role="status" aria-live="polite">
          {t('cv.loadingStatistics')}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cv-stats-error">
        <div className="cv-stats-error-card" role="alert" aria-live="assertive">
          <div className="cv-stats-error-icon" aria-hidden="true">
            <BarChart3 size={64} color="#9ca3af" />
          </div>
          <h2 className="cv-stats-error-title">
            {t('cv.errorLoadingStatistics')}
          </h2>
          <p className="cv-stats-error-text">{error}</p>
          <SecondaryButton onClick={loadStats} aria-label={t('common.tryAgain')}>
            {t('common.tryAgain')}
          </SecondaryButton>
      </div>
    </div>
  );
}

  if (!stats) {
    return (
      <div className="cv-stats-empty">
        <p className="cv-stats-status-text" role="status">
          {t('cv.noStatisticsAvailable')}
        </p>
      </div>
    );
  }

  return (
    <main className="cv-stats-page" aria-label={t('cv.stats.aria.page')}>
      <div className="cv-stats-container">
        <div className="cv-stats-header">
          <h1 className="cv-stats-title">
            {t('cv.cvStatistics')}
          </h1>
          <SecondaryButton onClick={loadStats} aria-label={t('cv.stats.aria.refresh')}>
            {t('common.refresh')}
          </SecondaryButton>
        </div>

        <section className="cv-stats-grid" aria-label={t('cv.stats.aria.summary')}>
          <StatCard
            icon={<ClipboardList size={32} />}
            title={totalSkillsTitle}
            value={stats.totalSkills || 0}
            description={technicalSkillsDesc}
            ariaLabel={t('cv.stats.aria.statCard', {
              title: totalSkillsTitle,
              value: stats.totalSkills || 0,
              description: technicalSkillsDesc,
            })}
            color="#0066cc"
          />
          <StatCard
            icon={<GraduationCap size={32} />}
            title={educationTitle}
            value={stats.totalEducation || 0}
            description={academicDegreesDesc}
            ariaLabel={t('cv.stats.aria.statCard', {
              title: educationTitle,
              value: stats.totalEducation || 0,
              description: academicDegreesDesc,
            })}
            color="#27ae60"
          />
          <StatCard
            icon={<ClipboardList size={32} />}
            title={experienceTitle}
            value={stats.totalExperience || 0}
            description={workExperiencesDesc}
            ariaLabel={t('cv.stats.aria.statCard', {
              title: experienceTitle,
              value: stats.totalExperience || 0,
              description: workExperiencesDesc,
            })}
            color="#f39c12"
          />
          <StatCard
            icon={<Rocket size={32} />}
            title={projectsTitle}
            value={stats.totalProjects || 0}
            description={personalProjectsDesc}
            ariaLabel={t('cv.stats.aria.statCard', {
              title: projectsTitle,
              value: stats.totalProjects || 0,
              description: personalProjectsDesc,
            })}
            color="#9b59b6"
          />
          <StatCard
            icon={<Trophy size={32} />}
            title={certificationsTitle}
            value={stats.totalCertifications || 0}
            description={professionalCertsDesc}
            ariaLabel={t('cv.stats.aria.statCard', {
              title: certificationsTitle,
              value: stats.totalCertifications || 0,
              description: professionalCertsDesc,
            })}
            color="#e74c3c"
          />
          <StatCard
            icon={<Globe size={32} />}
            title={languagesTitle}
            value={stats.totalLanguages || 0}
            description={spokenLanguagesDesc}
            ariaLabel={t('cv.stats.aria.statCard', {
              title: languagesTitle,
              value: stats.totalLanguages || 0,
              description: spokenLanguagesDesc,
            })}
            color="#16a085"
          />
        </section>

        {/* Top Skills */}
        {stats.topSkills && stats.topSkills.length > 0 && (
          <section className="cv-stats-section" aria-label={t('cv.stats.aria.topSkillsRegion')}>
            <h2 className="cv-stats-section-title">
              {t('cv.stats.topSkills')}
            </h2>
              <ul className="cv-stats-skills-list">
              {stats.topSkills.map((skill, index) => (
                <li
                  key={skill.name || skill}
                  className={`cv-stats-skill-item ${index < 3 ? 'cv-stats-skill-item--top' : 'cv-stats-skill-item--normal'}`}
                >
                  {skill}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Last Updated */}
        {stats.lastUpdated && (
          <footer className="cv-stats-footer" aria-label={t('cv.stats.aria.lastUpdateInfo')}>
            <p className="cv-stats-footer-text">
              {t('cv.stats.lastUpdatedLabel')}:{' '}
              <strong>{new Date(stats.lastUpdated).toLocaleString(i18n.language)}</strong>
            </p>
          </footer>
        )}
      </div>
    </main>
  );
}

/**
 * StatCard Component
 * Displays a statistical metric in a card
 */
function StatCard({ icon, title, value, description, ariaLabel, color = '#333' }) {
  return (
    <article
      className="cv-stats-card"
      aria-label={ariaLabel ?? `${title}: ${value} ${description}`}
    >
      <div className="cv-stats-card-icon" aria-hidden="true">
        {icon}
      </div>
      <h3 className="cv-stats-card-title">
        {title}
      </h3>
      <p className="cv-stats-card-value cv-stats-card-value--colored" style={{ '--card-color': color }}>
        {value}
      </p>
      <p className="cv-stats-card-description">
        {description}
      </p>
    </article>
  );
}

/**
 * SkillBar Component
 * Displays a skill with a horizontal bar indicating frequency
 */
function SkillBar({ skill, count, maxCount, color = '#27ae60' }) {
  const percentage = (count / maxCount) * 100;

  return (
    <div>
      <div className="cv-stats-skillbar-header">
        <span className="cv-stats-skillbar-name">
          {skill}
        </span>
        <span className="cv-stats-skillbar-count">
          {count}
        </span>
      </div>
      <div className="cv-stats-skillbar-track">
        <progress
          value={percentage}
          max={100}
          aria-label={`${percentage}%`}
          className="cv-stats-skillbar-progress"
          style={{ '--skillbar-color': color }}
        />
      </div>
    </div>
  );
}
