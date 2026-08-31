import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Star,
  Award,
  Clock,
  Brain,
  Target,
  Zap,
} from 'lucide-react';

/**
 * QuickInsightsSection - Auto-generated key insights
 *
 * Generates top 3-5 critical insights to help PM make quick decision:
 * - Match highlights
 * - Red flags/concerns
 * - Unique strengths
 * - Availability status
 *
 * @param {Object} employee - Full employee data
 * @param {Object} project - Project requirements
 */
export default function QuickInsightsSection({ employee, project }) {
  const { t } = useTranslation();
  const insights = generateInsights(employee, project, t);

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroIcon}>
          <Lightbulb size={32} color="#ffc107" />
        </div>
        <h3 style={styles.heroTitle}>{t('team.quickInsights.heroTitle')}</h3>
        <p style={styles.heroSubtitle}>{t('team.quickInsights.heroSubtitle')}</p>
      </div>

      {/* PM Notes Section */}
      {(employee.notes || employee.cv?.organizationNotes) && (
        <div style={styles.notesSection}>
          <div style={styles.notesHeader}>
            <div style={styles.notesIcon}>
              <Lightbulb size={18} />
            </div>
            <span style={styles.notesTitle}>{t('team.quickInsights.pmNotesTitle')}</span>
          </div>
          <p style={styles.notesContent}>{employee.notes || employee.cv?.organizationNotes}</p>
        </div>
      )}

      {/* Critical Insights */}
      <div style={styles.insightsGrid}>
        {insights.map((insight) => (
          <InsightCard key={insight.title} insight={insight} />
        ))}
      </div>

      {/* Overall Recommendation */}
      {insights.length > 0 && (
        <div style={styles.recommendationCard}>
          <div style={styles.recHeader}>
            <Target size={20} />
            <span style={styles.recTitle}>{t('team.quickInsights.overallAssessmentTitle')}</span>
          </div>
          <p style={styles.recText}>{generateOverallRecommendation(employee, insights, t)}</p>
        </div>
      )}
    </div>
  );
}

/**
 * InsightCard - Individual insight display
 */
function InsightCard({ insight }) {
  const getIcon = () => {
    switch (insight.type) {
      case 'positive':
        return <CheckCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'critical':
        return <AlertTriangle size={20} />;
      case 'neutral':
        return <Lightbulb size={20} />;
      default:
        return <CheckCircle size={20} />;
    }
  };

  const getCardStyle = () => {
    switch (insight.type) {
      case 'positive':
        return {
          ...styles.insightCard,
          backgroundColor: 'var(--color-success-bg)',
          borderColor: 'var(--color-success)',
          color: 'var(--color-success-dark)',
        };
      case 'warning':
        return {
          ...styles.insightCard,
          backgroundColor: 'var(--color-warning-bg)',
          borderColor: 'var(--color-warning)',
          color: 'var(--color-warning-dark)',
        };
      case 'critical':
        return {
          ...styles.insightCard,
          backgroundColor: 'var(--color-danger-bg)',
          borderColor: 'var(--color-danger)',
          color: 'var(--color-danger-dark)',
        };
      default:
        return {
          ...styles.insightCard,
          backgroundColor: 'var(--color-primary-light)',
          borderColor: 'var(--color-primary)',
          color: 'var(--color-primary-hover)',
        };
    }
  };

  return (
    <div style={getCardStyle()}>
      <div style={styles.insightHeader}>
        <div style={styles.insightIcon}>{getIcon()}</div>
        <div style={styles.insightBadge}>{insight.category}</div>
      </div>
      <div style={styles.insightTitle}>{insight.title}</div>
      <div style={styles.insightDesc}>{insight.description}</div>
      {insight.action && (
        <div style={styles.insightAction}>
          <Zap size={14} />
          {insight.action}
        </div>
      )}
    </div>
  );
}

/**
 * Generate insights based on employee data
 */
function generateInsights(employee, project, t) {
  const insights = [];

  const matchedSkillsCount = employee.matchedSkills?.length || 0;
  const missingSkillsCount = employee.missingSkills?.length || 0;
  const totalRequiredSkillsCount = matchedSkillsCount + missingSkillsCount;

  const safeMatchPercentage = (() => {
    const raw = Number(employee.skillsMatchPercentage);
    if (Number.isFinite(raw) && raw > 0) return Math.round(raw);
    if (totalRequiredSkillsCount === 0) return 0;
    return Math.round((matchedSkillsCount / totalRequiredSkillsCount) * 100);
  })();

  // 1. Skills Match Insight
  if (safeMatchPercentage >= 80) {
    insights.push({
      type: 'positive',
      category: t('team.quickInsights.categories.skills'),
      title: t('team.quickInsights.insights.skills.excellentTitle'),
      description: t('team.quickInsights.insights.skills.excellentDescription', {
        percent: safeMatchPercentage,
        matched: matchedSkillsCount,
        total: totalRequiredSkillsCount,
      }),
      priority: 1,
    });
  } else if (safeMatchPercentage >= 60) {
    insights.push({
      type: 'warning',
      category: t('team.quickInsights.categories.skills'),
      title: t('team.quickInsights.insights.skills.gapsTitle'),
      description: t('team.quickInsights.insights.skills.gapsDescription', {
        percent: safeMatchPercentage,
        missing: missingSkillsCount,
      }),
      action: t('team.quickInsights.insights.skills.gapsAction'),
      priority: 2,
    });
  } else if (safeMatchPercentage < 60) {
    insights.push({
      type: 'critical',
      category: t('team.quickInsights.categories.skills'),
      title: t('team.quickInsights.insights.skills.criticalTitle'),
      description: t('team.quickInsights.insights.skills.criticalDescription', {
        percent: safeMatchPercentage,
      }),
      action: t('team.quickInsights.insights.skills.criticalAction'),
      priority: 1,
    });
  }

  // 2. Experience Level Insight
  const cv = employee.cv;
  if (cv?.yearsOfExperience >= 5) {
    insights.push({
      type: 'positive',
      category: t('team.quickInsights.categories.experience'),
      title: t('team.quickInsights.insights.experience.seniorTitle'),
      description: t('team.quickInsights.insights.experience.seniorDescription', {
        years: t('team.quickInsights.common.years', { count: cv.yearsOfExperience }),
      }),
      priority: 2,
    });
  } else if (cv?.yearsOfExperience >= 2) {
    insights.push({
      type: 'neutral',
      category: t('team.quickInsights.categories.experience'),
      title: t('team.quickInsights.insights.experience.midTitle'),
      description: t('team.quickInsights.insights.experience.midDescription', {
        years: t('team.quickInsights.common.years', { count: cv.yearsOfExperience }),
      }),
      priority: 3,
    });
  }

  // 3. Workload Availability
  const workload = employee.workload;
  if (workload?.isOverloaded) {
    insights.push({
      type: 'critical',
      category: t('team.quickInsights.categories.availability'),
      title: t('team.quickInsights.insights.availability.overloadedTitle'),
      description: t('team.quickInsights.insights.availability.overloadedDescription', {
        projects: workload.concurrentProjects,
        hours: workload.weeklyHours,
      }),
      action: t('team.quickInsights.insights.availability.overloadedAction'),
      priority: 1,
    });
  } else if (workload && workload.concurrentProjects === 0) {
    insights.push({
      type: 'positive',
      category: t('team.quickInsights.categories.availability'),
      title: t('team.quickInsights.insights.availability.availableTitle'),
      description: t('team.quickInsights.insights.availability.availableDescription'),
      priority: 2,
    });
  }

  // 4. Personality Fit
  const bfi = employee.bfi44Profile;
  if (bfi?.traits) {
    if (bfi.traits.conscientiousness >= 4) {
      insights.push({
        type: 'positive',
        category: t('team.quickInsights.categories.personality'),
        title: t('team.quickInsights.insights.personality.reliableTitle'),
        description: t('team.quickInsights.insights.personality.reliableDescription'),
        priority: 3,
      });
    }

    if (bfi.traits.openness >= 4) {
      insights.push({
        type: 'positive',
        category: t('team.quickInsights.categories.personality'),
        title: t('team.quickInsights.insights.personality.innovationTitle'),
        description: t('team.quickInsights.insights.personality.innovationDescription'),
        priority: 3,
      });
    }

    if (bfi.traits.neuroticism >= 4) {
      insights.push({
        type: 'warning',
        category: t('team.quickInsights.categories.personality'),
        title: t('team.quickInsights.insights.personality.stressTitle'),
        description: t('team.quickInsights.insights.personality.stressDescription'),
        action: t('team.quickInsights.insights.personality.stressAction'),
        priority: 3,
      });
    }
  }

  // 5. Remote Work Experience
  if (cv?.remoteWorkExperience) {
    if (cv.remoteWorkExperience.years >= 2 && cv.remoteWorkExperience.distributedTeams) {
      insights.push({
        type: 'positive',
        category: t('team.quickInsights.categories.remoteWork'),
        title: t('team.quickInsights.insights.remoteWork.readyTitle'),
        description: t('team.quickInsights.insights.remoteWork.readyDescription', {
          years: t('team.quickInsights.common.years', { count: cv.remoteWorkExperience.years }),
        }),
        priority: 3,
      });
    }
  }

  // 6. Timezone Compatibility
  const user = employee.user;
  if (user?.timezone) {
    const offset = getTimezoneOffsetValue(user.timezone);
    if (Math.abs(offset) > 8) {
      insights.push({
        type: 'warning',
        category: t('team.quickInsights.categories.location'),
        title: t('team.quickInsights.insights.location.timezoneChallengeTitle'),
        description: t('team.quickInsights.insights.location.timezoneChallengeDescription'),
        action: t('team.quickInsights.insights.location.timezoneChallengeAction'),
        priority: 2,
      });
    } else if (user.flexibleSchedule) {
      insights.push({
        type: 'positive',
        category: t('team.quickInsights.categories.location'),
        title: t('team.quickInsights.insights.location.flexibleScheduleTitle'),
        description: t('team.quickInsights.insights.location.flexibleScheduleDescription'),
        priority: 3,
      });
    }
  }

  // 7. Certifications & Achievements
  if (cv?.certifications && Array.isArray(cv.certifications) && cv.certifications.length >= 3) {
    insights.push({
      type: 'positive',
      category: t('team.quickInsights.categories.credentials'),
      title: t('team.quickInsights.insights.credentials.strongTitle'),
      description: t('team.quickInsights.insights.credentials.strongDescription', {
        count: cv.certifications.length,
      }),
      priority: 3,
    });
  }

  // 8. Language Skills
  if (cv?.languages && Array.isArray(cv.languages) && cv.languages.length > 2) {
    const proficientLangs = cv.languages.filter((l) =>
      ['fluido', 'avanzado', 'nativo', 'bilingue', 'C1', 'C2'].includes(l.level)
    );
    if (proficientLangs.length >= 2) {
      insights.push({
        type: 'positive',
        category: t('team.quickInsights.categories.communication'),
        title: t('team.quickInsights.insights.communication.multilingualTitle'),
        description: t('team.quickInsights.insights.communication.multilingualDescription', {
          count: proficientLangs.length,
        }),
        priority: 3,
      });
    }
  }

  // Sort by priority and return top insights
  return insights.sort((a, b) => a.priority - b.priority).slice(0, 5);
}

/**
 * Generate overall recommendation text
 */
function generateOverallRecommendation(employee, insights, t) {
  const positiveCount = insights.filter((i) => i.type === 'positive').length;
  const criticalCount = insights.filter((i) => i.type === 'critical').length;
  const warningCount = insights.filter((i) => i.type === 'warning').length;

  if (criticalCount >= 2) {
    return t('team.quickInsights.overall.criticalMany', {
      name: employee.user.name,
      criticalCount,
    });
  }

  if (criticalCount === 1 && warningCount >= 1) {
    return t('team.quickInsights.overall.criticalAndWarning', {
      name: employee.user.name,
    });
  }

  if (positiveCount >= 3) {
    return t('team.quickInsights.overall.excellent', {
      name: employee.user.name,
    });
  }

  if (positiveCount >= 2) {
    return t('team.quickInsights.overall.solid', {
      name: employee.user.name,
      positiveCount,
    });
  }

  return t('team.quickInsights.overall.basic', {
    name: employee.user.name,
  });
}

/**
 * Get timezone offset value (simplified)
 */
function getTimezoneOffsetValue(timezone) {
  const offsetMap = {
    UTC: 0,
    GMT: 0,
    EST: -5,
    PST: -8,
    CST: -6,
    MST: -7,
    CET: 1,
    IST: 5.5,
    JST: 9,
    AEST: 10,
  };
  return offsetMap[timezone?.toUpperCase()] || 0;
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },

  // Hero
  hero: {
    textAlign: 'center',
    paddingBottom: '20px',
    borderBottom: '1px solid var(--color-border)',
  },
  heroIcon: {
    display: 'inline-flex',
    padding: '16px',
    backgroundColor: 'var(--color-warning-bg)',
    borderRadius: '50%',
    marginBottom: '12px',
  },
  heroTitle: {
    margin: '0 0 8px 0',
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--color-text-heading)',
  },
  heroSubtitle: {
    margin: 0,
    fontSize: '14px',
    color: 'var(--color-text-muted)',
  },

  // PM Notes Section
  notesSection: {
    padding: '16px',
    backgroundColor: 'var(--color-warning-bg)',
    borderRadius: '12px',
    border: '1px solid var(--color-warning)',
  },
  notesHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '10px',
  },
  notesIcon: {
    display: 'flex',
    alignItems: 'center',
    color: 'var(--color-warning-dark)',
  },
  notesTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--color-warning-dark)',
    textTransform: 'uppercase',
  },
  notesContent: {
    margin: 0,
    fontSize: '14px',
    color: 'var(--color-warning-dark)',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap',
  },

  // Insights Grid
  insightsGrid: {
    display: 'grid',
    gap: '12px',
  },
  insightCard: {
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid',
  },
  insightHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  insightIcon: {
    display: 'flex',
    alignItems: 'center',
  },
  insightBadge: {
    padding: '3px 10px',
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    borderRadius: '999px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  insightTitle: {
    fontSize: '15px',
    fontWeight: '700',
    marginBottom: '6px',
  },
  insightDesc: {
    fontSize: '13px',
    lineHeight: '1.5',
    marginBottom: '8px',
  },
  insightAction: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    fontWeight: '500',
    fontStyle: 'italic',
    marginTop: '10px',
    paddingTop: '10px',
    borderTop: '1px solid rgba(0, 0, 0, 0.08)',
  },

  // Recommendation
  recommendationCard: {
    padding: '20px',
    backgroundColor: 'var(--color-bg-muted)',
    borderRadius: '12px',
    border: '1px solid var(--color-border)',
  },
  recHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px',
  },
  recTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--color-text-heading)',
  },
  recText: {
    margin: 0,
    fontSize: '14px',
    color: 'var(--color-text-strong)',
    lineHeight: '1.6',
  },
};
