import React from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, GraduationCap, ClipboardList, Rocket, Trophy, Globe } from 'lucide-react';
import { useCVStats } from '../hooks/useCVStats';
import SecondaryButton from '../components/SecondaryButton';

/**
 * CVStatsPage Component
 * Displays statistics about the user's CV
 */
export default function CVStatsPage() {
  const { t } = useTranslation();
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
      <div style={{
        minHeight: '100vh',
        background: '#fafbfc',
        padding: '40px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p style={{ fontSize: '16px', color: '#666' }} role="status" aria-live="polite">{t('cv.loadingStatistics')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#fafbfc',
        padding: '40px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px'
      }}>
        <div style={{
          maxWidth: '500px',
          textAlign: 'center',
          padding: '40px',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
        }} role="alert" aria-live="assertive">
          <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.3 }} aria-hidden="true"><BarChart3 size={64} color="#9ca3af" /></div>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '12px', color: '#1a1a1a' }}>
            {t('cv.errorLoadingStatistics')}
          </h2>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
            {error}
          </p>
          <SecondaryButton onClick={loadStats} aria-label={t('common.tryAgain')}>
            {t('common.tryAgain')}
          </SecondaryButton>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#fafbfc',
        padding: '40px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p style={{ fontSize: '16px', color: '#666' }} role="status">{t('cv.noStatisticsAvailable')}</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fafbfc',
      padding: '124px 24px 60px'
    }} role="main" aria-label={t('cv.stats.aria.page')}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '48px'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '600',
            color: '#1a1a1a'
          }}>
            {t('cv.cvStatistics')}
          </h1>
          <SecondaryButton onClick={loadStats} aria-label={t('cv.stats.aria.refresh')}>
            {t('common.refresh')}
          </SecondaryButton>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '32px',
          marginBottom: '48px'
        }} role="region" aria-label={t('cv.stats.aria.summary')}>
          <StatCard
            icon={<ClipboardList size={32} />}
            title={totalSkillsTitle}
            value={stats.totalSkills || 0}
            description={technicalSkillsDesc}
            ariaLabel={t('cv.stats.aria.statCard', {
              title: totalSkillsTitle,
              value: stats.totalSkills || 0,
              description: technicalSkillsDesc
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
              description: academicDegreesDesc
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
              description: workExperiencesDesc
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
              description: personalProjectsDesc
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
              description: professionalCertsDesc
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
              description: spokenLanguagesDesc
            })}
            color="#16a085"
          />
        </div>

        {/* Top Skills */}
        {stats.topSkills && stats.topSkills.length > 0 && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '40px 32px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            marginBottom: '32px'
          }} role="region" aria-label={t('cv.stats.aria.topSkillsRegion')}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '24px',
              color: '#1a1a1a'
            }}>
              {t('cv.stats.topSkills')}
            </h2>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px'
            }} role="list">
              {stats.topSkills.map((skill, index) => (
                <span key={index} role="listitem" style={{
                  padding: '8px 16px',
                  background: index < 3 ? '#e8f4f8' : '#f0f0f0',
                  border: index < 3 ? '1px solid #0066cc' : 'none',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: index < 3 ? '600' : '400',
                  color: index < 3 ? '#0066cc' : '#333'
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Last Updated */}
        {stats.lastUpdated && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px 24px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }} role="contentinfo" aria-label={t('cv.stats.aria.lastUpdateInfo')}>
            <p style={{
              fontSize: '14px',
              color: '#666'
            }}>
              {t('cv.stats.lastUpdatedLabel')}: <strong>{new Date(stats.lastUpdated).toLocaleString()}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * StatCard Component
 * Displays a statistical metric in a card
 */
function StatCard({ icon, title, value, description, ariaLabel, color = '#333' }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '32px 24px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      transition: 'transform 0.2s',
      cursor: 'default'
    }}
    role="article"
    aria-label={ariaLabel ?? `${title}: ${value} ${description}`}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{
        fontSize: '40px',
        marginBottom: '12px',
        opacity: 0.8
      }} aria-hidden="true">
        {icon}
      </div>
      <h3 style={{
        fontSize: '14px',
        fontWeight: '500',
        color: '#666',
        marginBottom: '8px'
      }}>
        {title}
      </h3>
      <p style={{
        fontSize: '32px',
        fontWeight: '700',
        color,
        marginBottom: '4px'
      }}>
        {value}
      </p>
      <p style={{
        fontSize: '13px',
        color: '#999'
      }}>
        {description}
      </p>
    </div>
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
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '6px'
      }}>
        <span style={{
          fontSize: '14px',
          fontWeight: '500',
          color: '#333'
        }}>
          {skill}
        </span>
        <span style={{
          fontSize: '14px',
          color: '#666'
        }}>
          {count}
        </span>
      </div>
      <div style={{
        height: '8px',
        background: '#f0f0f0',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          background: color,
          borderRadius: '4px',
          transition: 'width 0.3s ease'
        }} />
      </div>
    </div>
  );
}
