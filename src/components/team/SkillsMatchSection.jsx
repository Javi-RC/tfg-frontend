import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, AlertTriangle, XCircle, TrendingUp, Minus, Info } from 'lucide-react';
import { normalizeCvSkills } from '../../utils/skillsMatch';

/**
 * SkillsMatchSection - Technical skills analysis
 * 
 * Shows matched and missing skills using backend-provided data.
 * NO calculations - uses matchPercentage, matchedSkills, and missingSkills from backend.
 * 
 * @param {Object} employee - Employee data with CV, matchedSkills, missingSkills, matchPercentage from backend
 * @param {Object} project - Project requirements (for reference only)
 */
export default function SkillsMatchSection({ employee, project }) {
  const { t } = useTranslation();
  const cv = employee.cv;
  
  // Use backend-provided data directly (NO calculations)
  const effectiveMatchedSkills = employee.matchedSkills || [];
  const effectiveMissingSkills = employee.missingSkills || [];
  const effectiveMatchPercentage = (() => {
    const raw = Number(employee.skillsMatchPercentage);
    if (Number.isFinite(raw) && raw > 0) return Math.round(raw);

    const total = effectiveMatchedSkills.length + effectiveMissingSkills.length;
    if (total === 0) return 0;
    return Math.round((effectiveMatchedSkills.length / total) * 100);
  })();
  
  // Normalize CV skills for display
  const cvSkills = normalizeCvSkills(cv);
  const employeeSkillNames = cvSkills.map(s => s.technology).filter(Boolean);
  
  // Check if we have comparison data
  const hasNoRequirements = !project?.mainTechnologies || project.mainTechnologies.length === 0;
  const hasComparisonData = effectiveMatchedSkills.length > 0 || effectiveMissingSkills.length > 0;

  // Get matched skills with their proficiency data
  const matchedWithDetails = effectiveMatchedSkills.map(skill => {
    // Handle both string and object formats from backend
    const skillName = typeof skill === 'string' ? skill : skill.skill;
    
    const skillData = cvSkills.find(s => 
      s.technology?.toLowerCase() === skillName.toLowerCase()
    );
    return {
      name: skillName,
      proficiency: skillData?.proficiency || 'intermedio',
      category: skillData?.category || 'general',
      proficiencyScore: getProficiencyScore(skillData?.proficiency)
    };
  });

  // Calculate average proficiency
  const avgProficiency = matchedWithDetails.length > 0
    ? matchedWithDetails.reduce((sum, s) => sum + s.proficiencyScore, 0) / matchedWithDetails.length
    : 0;

  return (
    <div style={styles.container}>
      {/* Overall Match Summary */}
      <div style={styles.summaryCard}>
        <div style={styles.summaryHeader}>
          <h3 style={styles.summaryTitle}>{t('team.skillsMatch.summaryTitle')}</h3>
          {hasComparisonData ? (
            <div style={styles.matchBadge}>
              {t('team.skillsMatch.matchPercent', { percent: effectiveMatchPercentage })}
            </div>
          ) : (
            <div style={{...styles.matchBadge, backgroundColor: '#6c757d'}}>
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
                <div style={styles.employeeSkillsTitle}>{t('team.skillsMatch.employeeSkillsTitle')}</div>
                {employeeSkillNames.length > 0 ? (
                  <div style={styles.employeeSkillsChips}>
                    {employeeSkillNames.map((name, idx) => (
                      <span key={`${name}-${idx}`} style={styles.employeeSkillChip}>
                        {name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div style={styles.employeeSkillsEmpty}>{t('team.skillsMatch.employeeSkillsEmpty')}</div>
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
                <div style={styles.employeeSkillsTitle}>{t('team.skillsMatch.employeeSkillsTitle')}</div>
                {employeeSkillNames.length > 0 ? (
                  <div style={styles.employeeSkillsChips}>
                    {employeeSkillNames.map((name, idx) => (
                      <span key={`${name}-${idx}`} style={styles.employeeSkillChip}>
                        {name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div style={styles.employeeSkillsEmpty}>{t('team.skillsMatch.employeeSkillsEmpty')}</div>
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
              <AlertTriangle size={20} color="#ffc107" />
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
            {matchedWithDetails.map((skill, idx) => (
              <div key={idx} style={styles.skillCard}>
                <div style={styles.skillHeader}>
                  <div style={styles.skillName}>{skill.name}</div>
                  <div style={{
                    ...styles.categoryBadge,
                    backgroundColor: getCategoryColor(skill.category)
                  }}>
                    {skill.category}
                  </div>
                </div>
                
                <div style={styles.proficiencyBar}>
                  <div 
                    style={{
                      ...styles.proficiencyFill,
                      width: `${(skill.proficiencyScore / 4) * 100}%`,
                      backgroundColor: getProficiencyColor(skill.proficiencyScore)
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

      {/* Missing Skills */}
      {effectiveMissingSkills.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <XCircle size={18} color="#dc3545" />
            <h4 style={styles.sectionTitle}>
              {t('team.skillsMatch.missingSkillsTitle', { count: effectiveMissingSkills.length })}
            </h4>
          </div>
          
          <div style={styles.alertBox}>
            <AlertTriangle size={16} />
            <span>
              {effectiveMissingSkills.length === 1
                ? t('team.skillsMatch.missingAlertOne', { count: effectiveMissingSkills.length })
                : t('team.skillsMatch.missingAlertOther', { count: effectiveMissingSkills.length })}
            </span>
          </div>
          
          <div style={styles.missingList}>
            {effectiveMissingSkills.map((skill, idx) => {
              const skillName = typeof skill === 'string' ? skill : skill.skill;
              return (
                <div key={idx} style={styles.missingChip}>
                  <XCircle size={14} />
                  {skillName}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* All Skills by Category */}
      {cvSkills.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h4 style={styles.sectionTitle}>{t('team.skillsMatch.allSkillsTitle', { count: cvSkills.length })}</h4>
          </div>
          
          {renderSkillsByCategory(cvSkills)}
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
            <div style={styles.experienceLabel}>{t('team.skillsMatch.totalProfessionalExperience')}</div>
            
            {cv.yearsOfRelevantExperience !== undefined && (
              <div style={styles.relevantExp}>
                <CheckCircle size={16} color="#28a745" />
                {t('team.skillsMatch.relevantExperience', { count: cv.yearsOfRelevantExperience })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Render skills grouped by category
 */
function renderSkillsByCategory(skills) {
  const categories = {};
  
  skills.forEach(skill => {
    const cat = skill.category || 'other';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(skill);
  });

  return (
    <div style={styles.categoriesGrid}>
      {Object.entries(categories).map(([category, categorySkills]) => (
        <div key={category} style={styles.categoryCard}>
          <div style={styles.categoryHeader}>
            {capitalize(category)} ({categorySkills.length})
          </div>
          <div style={styles.categorySkills}>
            {categorySkills.map((skill, idx) => (
              <div key={idx} style={styles.categorySkillChip}>
                {skill.technology}
                <span style={styles.skillLevel}>
                  {getProficiencyEmoji(skill.proficiency)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Helper: Map proficiency to numeric score
 */
function getProficiencyScore(proficiency) {
  const map = {
    'basico': 1,
    'básico': 1,
    'intermedio': 2,
    'avanzado': 3,
    'experto': 4,
    'expert': 4
  };
  return map[proficiency?.toLowerCase()] || 2;
}

/**
 * Helper: Get proficiency color
 */
function getProficiencyColor(score) {
  if (score >= 3.5) return '#28a745';
  if (score >= 2.5) return '#007bff';
  if (score >= 1.5) return '#ffc107';
  return '#dc3545';
}

/**
 * Helper: Get category color
 */
function getCategoryColor(category) {
  const colors = {
    'frontend': '#61dafb',
    'backend': '#68a063',
    'lenguaje': '#f7df1e',
    'framework': '#764abc',
    'base_datos': '#336791',
    'cloud': '#ff9900',
    'devops': '#0db7ed',
    'testing': '#e44d26',
    'herramienta': '#6e7271',
    'default': '#95a5a6'
  };
  return colors[category?.toLowerCase()] || colors.default;
}

/**
 * Helper: Get proficiency emoji
 */
function getProficiencyEmoji(proficiency) {
  const map = {
    'basico': '⭐',
    'básico': '⭐',
    'intermedio': '⭐⭐',
    'avanzado': '⭐⭐⭐',
    'experto': '⭐⭐⭐⭐',
    'expert': '⭐⭐⭐⭐'
  };
  return map[proficiency?.toLowerCase()] || '⭐⭐';
}

/**
 * Helper: Capitalize string
 */
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  
  // Summary Card
  summaryCard: {
    padding: '20px',
    backgroundColor: '#f6f8fa',
    borderRadius: '12px',
    border: '1px solid #e1e4e8',
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
    color: '#24292e',
  },
  matchBadge: {
    padding: '6px 14px',
    backgroundColor: '#28a745',
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
    color: '#24292e',
  },
  statLabel: {
    fontSize: '12px',
    color: '#586069',
  },

  // Section
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
    color: '#24292e',
  },

  // Skills List
  skillsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  skillCard: {
    padding: '14px',
    backgroundColor: '#fff',
    border: '1px solid #e1e4e8',
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
    color: '#24292e',
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
    backgroundColor: '#e1e4e8',
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
    color: '#586069',
  },

  // Missing Skills
  alertBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '12px',
    backgroundColor: '#fff3cd',
    border: '1px solid #ffc107',
    borderRadius: '8px',
    marginBottom: '12px',
    fontSize: '13px',
    color: '#856404',
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
    color: '#24292e',
  },
  employeeSkillsEmpty: {
    fontSize: '13px',
    color: '#6c757d',
  },
  missingList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  missingChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: '#fff',
    border: '1px solid #dc3545',
    borderRadius: '6px',
    fontSize: '13px',
    color: '#dc3545',
    fontWeight: '500',
  },

  // Categories
  categoriesGrid: {
    display: 'grid',
    gap: '12px',
  },
  categoryCard: {
    padding: '12px',
    backgroundColor: '#f6f8fa',
    borderRadius: '8px',
    border: '1px solid #e1e4e8',
  },
  categoryHeader: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#24292e',
    marginBottom: '10px',
    textTransform: 'capitalize',
  },
  categorySkills: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  categorySkillChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 10px',
    backgroundColor: '#fff',
    border: '1px solid #e1e4e8',
    borderRadius: '6px',
    fontSize: '12px',
    color: '#24292e',
  },
  skillLevel: {
    fontSize: '10px',
  },

  // Experience
  experienceCard: {
    padding: '16px',
    backgroundColor: '#f6f8fa',
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
    color: '#586069',
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
