import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  X, User, Briefcase, Brain, Clock, Award, ExternalLink,
  TrendingUp, AlertTriangle, CheckCircle, Info, ChevronRight
} from 'lucide-react';
import { getProfileByUserId } from '../../api/bfi44';
import SkillsMatchSection from './SkillsMatchSection';
import PersonalityFitSection from './PersonalityFitSection';
import AvailabilitySection from './AvailabilitySection';
import QuickInsightsSection from './QuickInsightsSection';
import './EmployeeDetailPanel.css';

/**
 * Safely formats a date string to locale date string
 * @param {string} dateStr - Date string to format
 * @returns {string} Formatted date or 'N/A' if invalid
 */
const formatDate = (dateStr, fallback = 'N/A') => {
  if (!dateStr) return fallback;
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? fallback : date.toLocaleDateString();
};

/**
 * Safely extracts year from a date string
 * @param {string} dateStr - Date string to extract year from
 * @returns {string|number} Year or 'N/A' if invalid
 */
const formatYear = (dateStr, fallback = 'N/A') => {
  if (!dateStr) return fallback;
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? fallback : date.getFullYear();
};

/**
 * EmployeeDetailPanel - Comprehensive employee details sidebar
 * 
 * Shows detailed information when an employee is selected:
 * - Quick insights (auto-generated)
 * - Skills match analysis
 * - Personality fit (BFI-44)
 * - Availability and workload
 * - Certifications and achievements
 * - Contact links
 * 
 * @param {Object} employee - Full employee data with CV, BFI-44, match details
 * @param {Object} project - Current project requirements
 * @param {Function} onClose - Callback to close the panel
 * @param {Function} onAssign - Optional callback to assign employee
 */
export default function EmployeeDetailPanel({ 
  employee, 
  project,
  onClose,
  onAssign 
}) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');

  const user = employee?.user ?? {};
  const displayName = (typeof user.name === 'string' ? user.name : '').trim();
  const safeDisplayName = displayName || t('team.employeeDetail.fallbackName', { defaultValue: 'Unknown user' });
  const avatarInitial = safeDisplayName.trim().charAt(0).toUpperCase();
  const email = typeof user.email === 'string' ? user.email : '';
  const mappedUserBfi44Profile = useMemo(() => {
    const backendProfile = employee?.user?.bfi44Profile;
    if (!backendProfile || typeof backendProfile !== 'object') return null;

    const hasTraitsObject = backendProfile.traits && typeof backendProfile.traits === 'object';
    if (hasTraitsObject) return backendProfile;

    // Backend sometimes sends flat keys: { Extraversion, Agreeableness, Conscientiousness, Neuroticism, Openness }
    return {
      traits: {
        extraversion: backendProfile.Extraversion ?? 0,
        agreeableness: backendProfile.Agreeableness ?? 0,
        conscientiousness: backendProfile.Conscientiousness ?? 0,
        neuroticism: backendProfile.Neuroticism ?? 0,
        openness: backendProfile.Openness ?? 0
      }
    };
  }, [employee]);

  const [bfi44Profile, setBfi44Profile] = useState(employee?.bfi44Profile || mappedUserBfi44Profile || null);
  const [loadingBFI, setLoadingBFI] = useState(false);
  const [forbiddenBFI, setForbiddenBFI] = useState(false);
  const lastFetchUserIdRef = useRef(null);

  // Load BFI-44 profile if not already loaded
  useEffect(() => {
    // Reset cached profile when switching employees
    setBfi44Profile(employee?.bfi44Profile || mappedUserBfi44Profile || null);
    setForbiddenBFI(false);
    lastFetchUserIdRef.current = null;

    const loadBFI44Profile = async () => {
      const currentProfile = employee?.bfi44Profile || mappedUserBfi44Profile;
      const hasTraits = Boolean(currentProfile?.traits);
      const userId = employee?.user?._id;

      // Only fetch if we still don't have a usable profile
      // And only when the user explicitly opens the Personality tab
      if (activeTab !== 'personality') return;
      if (!userId) return;
      if (hasTraits) return;
      if (lastFetchUserIdRef.current === userId) return;

      lastFetchUserIdRef.current = userId;

      if (!hasTraits) {
        try {
          setLoadingBFI(true);
          const response = await getProfileByUserId(userId);
          const profile = response.data?.data || response.data;
          if (profile && profile.traits) {
            setBfi44Profile(profile);
          }
        } catch (error) {
          const status = error.response?.status;
          if (status === 403) {
            setForbiddenBFI(true);
          }
          setBfi44Profile(null);
        } finally {
          setLoadingBFI(false);
        }
      }
    };

    loadBFI44Profile();
  }, [employee, mappedUserBfi44Profile, activeTab]);

  // Lock body scroll while the panel is open
  useEffect(() => {
    // Preserve current overflow
    const originalOverflow = document.body.style.overflow;
    // Lock scroll
    document.body.style.overflow = 'hidden';
    
    // Restore on unmount
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  if (!employee) return null;

  // Create enhanced employee object with loaded BFI profile
  const enhancedEmployee = {
    ...employee,
    bfi44Profile: bfi44Profile || employee.bfi44Profile || mappedUserBfi44Profile
  };

  const normalizeTechName = (value) => {
    if (value == null) return '';
    if (typeof value === 'string') return value.trim();
    if (typeof value === 'object') {
      if (typeof value.name === 'string') return value.name.trim();
      if (typeof value.skill === 'string') return value.skill.trim();
      if (typeof value.technology === 'string') return value.technology.trim();
    }
    return '';
  };

  const getCvSkillNames = (cv) => {
    if (!cv) return [];

    // Format A: legacy array (e.g. [{ technology, proficiency, category }, ...])
    if (Array.isArray(cv.skills)) {
      return cv.skills
        .map((skill) => {
          if (typeof skill === 'string') return skill;
          return skill?.technology || skill?.name || '';
        })
        .filter(Boolean);
    }

    // Format B: normalized CV service shape (e.g. { skills: { technical: [{name, level}], soft: [...] } })
    const technical = Array.isArray(cv.skills?.technical) ? cv.skills.technical : [];
    const soft = Array.isArray(cv.skills?.soft) ? cv.skills.soft : [];

    const toName = (skill) => {
      if (typeof skill === 'string') return skill;
      return skill?.name || skill?.technology || '';
    };

    return [...technical, ...soft].map(toName).filter(Boolean);
  };

  const projectTechNames = Array.isArray(project?.mainTechnologies)
    ? project.mainTechnologies.map(normalizeTechName).filter(Boolean)
    : [];
  const cvSkillNames = getCvSkillNames(enhancedEmployee.cv);

  const rawMatchedSkillsCount = enhancedEmployee.matchedSkills?.length || 0;
  const rawMissingSkillsCount = enhancedEmployee.missingSkills?.length || 0;

  const shouldFallbackCompare =
    projectTechNames.length > 0 &&
    rawMatchedSkillsCount === 0 &&
    rawMissingSkillsCount === 0 &&
    cvSkillNames.length > 0;

  const effectiveMatchedSkillsCount = shouldFallbackCompare
    ? projectTechNames.filter((tech) =>
        cvSkillNames.some((s) => (s || '').toLowerCase() === tech.toLowerCase())
      ).length
    : rawMatchedSkillsCount;

  const effectiveMissingSkillsCount = shouldFallbackCompare
    ? projectTechNames.filter((tech) =>
        !cvSkillNames.some((s) => (s || '').toLowerCase() === tech.toLowerCase())
      ).length
    : rawMissingSkillsCount;

  const skillsMatchPercentage = (() => {
    const raw = Number(enhancedEmployee.skillsMatchPercentage);
    if (Number.isFinite(raw) && raw > 0) return Math.round(raw);
    const total = effectiveMatchedSkillsCount + effectiveMissingSkillsCount;
    if (total === 0) return 0;
    return Math.round((effectiveMatchedSkillsCount / total) * 100);
  })();

  const matchScorePercentage = (() => {
    const raw = Number(enhancedEmployee.matchScore);
    if (Number.isFinite(raw) && raw >= 0) return Math.round(raw);

    // Backward compatibility: some views may still provide overall match in matchPercentage
    const fallback = Number(enhancedEmployee.matchPercentage);
    if (Number.isFinite(fallback) && fallback >= 0) return Math.round(fallback);

    return skillsMatchPercentage;
  })();

  const showMatchScore = projectTechNames.length > 0 || Number.isFinite(matchScorePercentage);

  const tabs = [
    { id: 'overview', label: t('team.employeeDetail.tabs.overview'), icon: Info },
    { id: 'skills', label: t('team.employeeDetail.tabs.skills'), icon: Briefcase },
    { id: 'personality', label: t('team.employeeDetail.tabs.personality'), icon: Brain },
    { id: 'availability', label: t('team.employeeDetail.tabs.availability'), icon: Clock },
    { id: 'achievements', label: t('team.employeeDetail.tabs.achievements'), icon: Award }
  ];

  const handleAssign = () => {
    const userId = employee?.user?._id;
    if (!onAssign || !userId) return;
    onAssign(userId);
  };

  return (
    <>
      <div style={styles.backdrop} onClick={onClose} />
      <div style={styles.panel}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <div style={styles.avatar}>
              {avatarInitial}
            </div>
            <div style={styles.headerInfo}>
              <h2 style={styles.name}>{safeDisplayName}</h2>
              <p style={styles.email}>{email}</p>
            </div>
            <button 
              onClick={onClose} 
              style={styles.closeButton}
              title={t('team.employeeDetail.aria.closePanel')}
              aria-label={t('team.employeeDetail.aria.closePanel')}
            >
              <X size={20} />
            </button>
          </div>

          {/* Match Score */}
          {showMatchScore && (
            <div style={styles.matchScore}>
              <div style={styles.scoreCircle}>
                <svg width="80" height="80" style={styles.scoreSvg}>
                  <circle 
                    cx="40" 
                    cy="40" 
                    r="32" 
                    fill="none" 
                    stroke="#e1e4e8" 
                    strokeWidth="6"
                  />
                  <circle 
                    cx="40" 
                    cy="40" 
                    r="32" 
                    fill="none" 
                    stroke={getMatchColor(matchScorePercentage)} 
                    strokeWidth="6"
                    strokeDasharray={`${2 * Math.PI * 32}`}
                    strokeDashoffset={`${2 * Math.PI * 32 * (1 - matchScorePercentage / 100)}`}
                    strokeLinecap="round"
                    transform="rotate(-90 40 40)"
                  />
                </svg>
                <div style={styles.scoreText}>
                  <span style={styles.scoreNumber}>{matchScorePercentage}%</span>
                  <span style={styles.scoreLabel}>{t('team.employeeDetail.matchScore.label')}</span>
                </div>
              </div>
              <div style={styles.matchSummary}>
                <div style={styles.matchStat}>
                  <Briefcase size={16} color="#0366d6" />
                  <span>
                    {t('team.employeeDetail.skillsScore.label')}: {skillsMatchPercentage}%
                  </span>
                </div>
                <div style={styles.matchStat}>
                  <CheckCircle size={16} color="#28a745" />
                  <span>{t('team.employeeDetail.match.skillsMatched', { count: effectiveMatchedSkillsCount })}</span>
                </div>
                {effectiveMissingSkillsCount > 0 && (
                  <div style={styles.matchStat}>
                    <AlertTriangle size={16} color="#ffc107" />
                    <span>{t('team.employeeDetail.match.skillsMissing', { count: effectiveMissingSkillsCount })}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  ...styles.tab,
                  ...(activeTab === tab.id ? styles.activeTab : {})
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div style={styles.content}>
          {activeTab === 'overview' && (
            <QuickInsightsSection 
              employee={enhancedEmployee} 
              project={project}
            />
          )}

          {activeTab === 'skills' && (
            <SkillsMatchSection 
              employee={enhancedEmployee} 
              project={project}
            />
          )}

          {activeTab === 'personality' && (
            <PersonalityFitSection 
              employee={enhancedEmployee}
              loading={loadingBFI}
              forbidden={forbiddenBFI}
            />
          )}

          {activeTab === 'availability' && (
            <AvailabilitySection 
              employee={enhancedEmployee}
            />
          )}

          {activeTab === 'achievements' && (
            <AchievementsSection 
              employee={enhancedEmployee}
            />
          )}
        </div>

        {/* Footer Actions */}
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
            <button 
              onClick={handleAssign}
              style={styles.assignButton}
            >
              <CheckCircle size={18} />
              {t('team.employeeDetail.actions.addToTeam')}
            </button>
          )}
        </div>
      </div>
    </>
  );
}

/**
 * Achievements Section - Certifications, awards, publications
 */
function AchievementsSection({ employee }) {
  const { t } = useTranslation();
  const cv = employee.cv;
  const notAvailableLabel = t('common.notAvailable');

  return (
    <div style={styles.section}>
      {/* Certifications */}
      {cv?.certifications && Array.isArray(cv.certifications) && cv.certifications.length > 0 && (
        <div style={styles.subsection}>
          <h3 style={styles.subsectionTitle}>
            <Award size={18} />
            {t('cv.certifications')}
          </h3>
          <div style={styles.certList}>
            {cv.certifications.map((cert, idx) => (
              <div key={idx} style={styles.certCard}>
                <div style={styles.certHeader}>
                  <div style={styles.certName}>{cert.name}</div>
                  <div style={styles.certIssuer}>{cert.issuer}</div>
                </div>
                {cert.date && (
                  <div style={styles.certDate}>
                    {t('team.employeeDetail.achievements.issuedLabel')}: {formatDate(cert.date, notAvailableLabel)}
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

      {/* Achievements */}
      {cv?.achievements && (
        <>
          {cv.achievements.awards && cv.achievements.awards.length > 0 && (
            <div style={styles.subsection}>
              <h3 style={styles.subsectionTitle}>
                <Award size={18} />
                {t('team.employeeDetail.achievements.awardsTitle')}
              </h3>
              <ul style={styles.achievementList}>
                {cv.achievements.awards.map((award, idx) => (
                  <li key={idx} style={styles.achievementItem}>{award}</li>
                ))}
              </ul>
            </div>
          )}

          {cv.achievements.publications && cv.achievements.publications.length > 0 && (
            <div style={styles.subsection}>
              <h3 style={styles.subsectionTitle}>{t('team.employeeDetail.achievements.publicationsTitle')}</h3>
              <ul style={styles.achievementList}>
                {cv.achievements.publications.map((pub, idx) => (
                  <li key={idx} style={styles.achievementItem}>{pub}</li>
                ))}
              </ul>
            </div>
          )}

          {cv.achievements.hackathons && cv.achievements.hackathons.length > 0 && (
            <div style={styles.subsection}>
              <h3 style={styles.subsectionTitle}>{t('team.employeeDetail.achievements.hackathonsTitle')}</h3>
              <ul style={styles.achievementList}>
                {cv.achievements.hackathons.map((hack, idx) => (
                  <li key={idx} style={styles.achievementItem}>{hack}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {/* Education */}
      {cv?.education && Array.isArray(cv.education) && cv.education.length > 0 && (
        <div style={styles.subsection}>
          <h3 style={styles.subsectionTitle}>{t('cv.education')}</h3>
          <div style={styles.educationList}>
            {cv.education.map((edu, idx) => (
              <div key={idx} style={styles.eduCard}>
                <div style={styles.eduTitle}>{edu.degree}</div>
                <div style={styles.eduInstitution}>{edu.institution}</div>
                {edu.fieldOfStudy && (
                  <div style={styles.eduField}>{edu.fieldOfStudy}</div>
                )}
                {(edu.startDate || edu.endDate) && (
                  <div style={styles.eduDates}>
                    {edu.startDate ? formatYear(edu.startDate, notAvailableLabel) : ''} 
                    {' - '} 
                    {edu.endDate ? formatYear(edu.endDate, notAvailableLabel) : t('team.employeeDetail.achievements.present')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Helper: Get match color based on percentage
 */
function getMatchColor(percentage) {
  if (percentage >= 80) return '#28a745';
  if (percentage >= 60) return '#ffc107';
  return '#dc3545';
}

const styles = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1001,
    animation: 'fadeIn 0.3s ease-out',
  },
  panel: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    width: '700px',
    backgroundColor: '#fff',
    boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.25)',
    zIndex: 1002,
    display: 'flex',
    flexDirection: 'column',
    animation: 'slideInRight 0.3s ease-out',
  },
  
  // Header
  header: {
    padding: '24px',
    borderBottom: '1px solid #e1e4e8',
    backgroundColor: '#f6f8fa',
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '20px',
  },
  avatar: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: '#667eea',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: '600',
    flexShrink: 0,
  },
  headerInfo: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '600',
    color: '#24292e',
  },
  email: {
    margin: '4px 0 0 0',
    fontSize: '14px',
    color: '#586069',
  },
  closeButton: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#fff',
    color: '#586069',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    flexShrink: 0,
  },

  // Match Score
  matchScore: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  },
  scoreCircle: {
    position: 'relative',
    width: '80px',
    height: '80px',
  },
  scoreSvg: {
    transform: 'rotate(-90deg)',
  },
  scoreText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  scoreNumber: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#24292e',
  },
  scoreLabel: {
    fontSize: '11px',
    color: '#586069',
    marginTop: '-2px',
  },
  matchSummary: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  matchStat: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#586069',
  },

  // Tabs
  tabs: {
    display: 'flex',
    borderBottom: '1px solid #e1e4e8',
    backgroundColor: '#fff',
    overflowX: 'auto',
  },
  tab: {
    flex: 1,
    padding: '12px 16px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#586069',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    transition: 'all 0.2s',
    borderBottom: '2px solid transparent',
    whiteSpace: 'nowrap',
  },
  activeTab: {
    color: '#007bff',
    borderBottomColor: '#007bff',
  },

  // Content
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px',
  },
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
    color: '#24292e',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  // Certifications
  certList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  certCard: {
    padding: '14px',
    backgroundColor: '#f6f8fa',
    borderRadius: '8px',
    border: '1px solid #e1e4e8',
  },
  certHeader: {
    marginBottom: '8px',
  },
  certName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#24292e',
    marginBottom: '4px',
  },
  certIssuer: {
    fontSize: '13px',
    color: '#586069',
  },
  certDate: {
    fontSize: '12px',
    color: '#586069',
    marginTop: '6px',
  },
  certCredential: {
    fontSize: '12px',
    color: '#586069',
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

  // Achievements
  achievementList: {
    margin: 0,
    paddingLeft: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  achievementItem: {
    fontSize: '14px',
    color: '#24292e',
    lineHeight: '1.6',
  },

  // Education
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
    color: '#24292e',
    marginBottom: '4px',
  },
  eduInstitution: {
    fontSize: '14px',
    color: '#586069',
    marginBottom: '4px',
  },
  eduField: {
    fontSize: '13px',
    color: '#586069',
    marginBottom: '6px',
  },
  eduDates: {
    fontSize: '12px',
    color: '#586069',
    fontStyle: 'italic',
  },

  // Footer
  footer: {
    padding: '16px 24px',
    borderTop: '1px solid #e1e4e8',
    backgroundColor: '#f6f8fa',
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
    border: '1px solid #e1e4e8',
    borderRadius: '6px',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  assignButton: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
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
