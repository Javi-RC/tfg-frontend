import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, TrendingUp, Info } from 'lucide-react';
import { normalizeCvSkills } from '../../utils/skillsMatch';
import { getProficiencyScore, getProficiencyColor, getCategoryColor, capitalize } from '../../utils/skillMatchHelpers';

export default function SkillMatchVisualization({ employee, project }) {
  const { t } = useTranslation();
  const cv = employee.cv;

  const effectiveMatchedSkills = employee.matchedSkills || [];
  const effectiveMissingSkills = employee.missingSkills || [];
  const effectiveMatchPercentage = (() => {
    const raw = Number(employee.skillsMatchPercentage);
    if (Number.isFinite(raw) && raw > 0) return Math.round(raw);
    const total = effectiveMatchedSkills.length + effectiveMissingSkills.length;
    if (total === 0) return 0;
    return Math.round((effectiveMatchedSkills.length / total) * 100);
  })();

  const cvSkills = normalizeCvSkills(cv);
  const employeeSkillNames = cvSkills.flatMap((s) => (s.technology ? [s.technology] : []));

  const hasNoRequirements = !project?.mainTechnologies || project.mainTechnologies.length === 0;
  const hasComparisonData = effectiveMatchedSkills.length > 0 || effectiveMissingSkills.length > 0;

  const matchedWithDetails = effectiveMatchedSkills.map((skill) => {
    const skillName = typeof skill === 'string' ? skill : skill.skill;
    const skillData = cvSkills.find((s) => s.technology?.toLowerCase() === skillName.toLowerCase());
    return {
      name: skillName,
      proficiency: skillData?.proficiency || 'intermedio',
      category: skillData?.category || 'general',
      proficiencyScore: getProficiencyScore(skillData?.proficiency),
    };
  });

  const avgProficiency =
    matchedWithDetails.length > 0
      ? matchedWithDetails.reduce((sum, s) => sum + s.proficiencyScore, 0) /
        matchedWithDetails.length
      : 0;

  return (
    <>
      {/* Overall Match Summary */}
      <div style={styles.summaryCard}>
        <div style={styles.summaryHeader}>
          <h3 style={styles.summaryTitle}>{t('team.skillsMatch.summaryTitle')}</h3>
          {hasComparisonData ? (
            <div style={styles.matchBadge}>
              {t('team.skillsMatch.matchPercent', { percent: effectiveMatchPercentage })}
            </div>
          ) : (
            <div style={{ ...styles.matchBadge, backgroundColor: 'var(--color-text-muted)' }}>
              {t('common.notAvailable')}
            </div>
          )}
        </div>

        {hasNoRequirements ? (
          <div style={styles.noRequirementsBox}>
            <Info size={20} color="#17a2b8" />
            <div>
              <strong>{t('team.skillsMatch.noRequirementsTitle')}</strong>
              <p style={{ margin: '4px 0 0', fontSize: '14px' }}>
                {t('team.skillsMatch.noRequirementsDescription')}
              </p>

              <div style={styles.employeeSkillsBlock}>
                <div style={styles.employeeSkillsTitle}>
                  {t('team.skillsMatch.employeeSkillsTitle')}
                </div>
                {employeeSkillNames.length > 0 ? (
                  <div style={styles.employeeSkillsChips}>
                    {employeeSkillNames.map((name, idx) => (
                      <span key={`${name}-${idx}`} style={styles.employeeSkillChip}>
                        {name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div style={styles.employeeSkillsEmpty}>
                    {t('team.skillsMatch.employeeSkillsEmpty')}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : !hasComparisonData ? (
          <div style={styles.noRequirementsBox}>
            <Info size={20} color="#17a2b8" />
            <div>
              <strong>{t('team.skillsMatch.noComparisonTitle')}</strong>
              <p style={{ margin: '4px 0 0', fontSize: '14px' }}>
                {t('team.skillsMatch.noComparisonDescription')}
              </p>

              <div style={styles.employeeSkillsBlock}>
                <div style={styles.employeeSkillsTitle}>
                  {t('team.skillsMatch.employeeSkillsTitle')}
                </div>
                {employeeSkillNames.length > 0 ? (
                  <div style={styles.employeeSkillsChips}>
                    {employeeSkillNames.map((name, idx) => (
                      <span key={`${name}-${idx}`} style={styles.employeeSkillChip}>
                        {name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div style={styles.employeeSkillsEmpty}>
                    {t('team.skillsMatch.employeeSkillsEmpty')}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div style={styles.statsGrid}>
            <div style={styles.statItem}>
              <CheckCircle size={20} color="#28a745" />
              <div>
                <div style={styles.statValue}>{effectiveMatchedSkills.length}</div>
                <div style={styles.statLabel}>{t('team.skillsMatch.stats.skillsMatched')}</div>
              </div>
            </div>

            <div style={styles.statItem}>
              <div>
                <div style={styles.statValue}>{effectiveMissingSkills.length}</div>
                <div style={styles.statLabel}>{t('team.skillsMatch.stats.skillsMissing')}</div>
              </div>
            </div>

            <div style={styles.statItem}>
              <TrendingUp size={20} color="#007bff" />
              <div>
                <div style={styles.statValue}>{avgProficiency.toFixed(1)}/4.0</div>
                <div style={styles.statLabel}>{t('team.skillsMatch.stats.avgProficiency')}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Matched Skills */}
      {matchedWithDetails.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <CheckCircle size={18} color="#28a745" />
            <h4 style={styles.sectionTitle}>
              {t('team.skillsMatch.matchedSkillsTitle', { count: matchedWithDetails.length })}
            </h4>
          </div>

          <div style={styles.skillsList}>
            {matchedWithDetails.map((skill) => (
              <div key={skill.name} style={styles.skillCard}>
                <div style={styles.skillHeader}>
                  <div style={styles.skillName}>{skill.name}</div>
                  <div
                    style={{
                      ...styles.categoryBadge,
                      backgroundColor: getCategoryColor(skill.category),
                    }}
                  >
                    {skill.category}
                  </div>
                </div>

                <div style={styles.proficiencyBar}>
                  <div
                    style={{
                      ...styles.proficiencyFill,
                      width: `${(skill.proficiencyScore / 4) * 100}%`,
                      backgroundColor: getProficiencyColor(skill.proficiencyScore),
                    }}
                  />
                </div>

                <div style={styles.proficiencyLabel}>
                  {capitalize(skill.proficiency)} ({skill.proficiencyScore}/4)
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience Level */}
      {cv?.yearsOfExperience !== undefined && (
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h4 style={styles.sectionTitle}>{t('team.skillsMatch.experienceLevelTitle')}</h4>
          </div>

          <div style={styles.experienceCard}>
            <div style={styles.experienceValue}>
              {t('team.skillsMatch.years', { count: cv.yearsOfExperience })}
            </div>
            <div style={styles.experienceLabel}>
              {t('team.skillsMatch.totalProfessionalExperience')}
            </div>

            {cv.yearsOfRelevantExperience !== undefined && (
              <div style={styles.relevantExp}>
                <CheckCircle size={16} color="#28a745" />
                {t('team.skillsMatch.relevantExperience', { count: cv.yearsOfRelevantExperience })}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  summaryCard: {
    padding: '20px',
    backgroundColor: 'var(--color-bg-muted)',
    borderRadius: '12px',
    border: '1px solid var(--color-border)',
  },
  summaryHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  summaryTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--color-text-primary)',
  },
  matchBadge: {
    padding: '6px 14px',
    backgroundColor: 'var(--color-success)',
    color: '#fff',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  statValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--color-text-primary)',
  },
  statLabel: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
  },
  noRequirementsBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#d1ecf1',
    border: '1px solid #bee5eb',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#0c5460',
  },
  employeeSkillsBlock: {
    marginTop: '10px',
  },
  employeeSkillsTitle: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#495057',
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
    marginBottom: '8px',
  },
  employeeSkillsChips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  employeeSkillChip: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '6px 10px',
    borderRadius: '999px',
    border: '1px solid #dee2e6',
    backgroundColor: '#ffffff',
    fontSize: '13px',
    color: 'var(--color-text-primary)',
  },
  employeeSkillsEmpty: {
    fontSize: '13px',
    color: 'var(--color-text-muted)',
  },
  section: {
    marginBottom: '8px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
  },
  sectionTitle: {
    margin: 0,
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--color-text-primary)',
  },
  skillsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  skillCard: {
    padding: '14px',
    backgroundColor: '#fff',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
  },
  skillHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  skillName: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--color-text-primary)',
  },
  categoryBadge: {
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600',
    color: '#fff',
  },
  proficiencyBar: {
    height: '8px',
    backgroundColor: 'var(--color-border)',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '6px',
  },
  proficiencyFill: {
    height: '100%',
    transition: 'width 0.3s ease',
  },
  proficiencyLabel: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
  },
  experienceCard: {
    padding: '16px',
    backgroundColor: 'var(--color-bg-muted)',
    borderRadius: '8px',
    textAlign: 'center',
  },
  experienceValue: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#007bff',
    marginBottom: '4px',
  },
  experienceLabel: {
    fontSize: '13px',
    color: 'var(--color-text-secondary)',
    marginBottom: '12px',
  },
  relevantExp: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: '#d4edda',
    borderRadius: '6px',
    fontSize: '13px',
    color: '#155724',
    fontWeight: '500',
  },
};
