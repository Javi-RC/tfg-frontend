import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Briefcase,
  Brain,
  Clock,
  Award,
  Info,
} from 'lucide-react';
import { getProfileByUserId } from '../../api/bfi44';
import SkillsMatchSection from './SkillsMatchSection';
import PersonalityFitSection from './PersonalityFitSection';
import AvailabilitySection from './AvailabilitySection';
import QuickInsightsSection from './QuickInsightsSection';
import EmployeeHeader from './EmployeeHeader';
import EmployeeSummary from './EmployeeSummary';
import EmployeeActions from './EmployeeActions';
import EmployeeAchievements from './EmployeeAchievements';
import EmployeeEducation from './EmployeeEducation';
import './EmployeeDetailPanel.css';

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
    return cv.skills.flatMap((skill) => {
      if (typeof skill === 'string') return [skill];
      const v = skill?.technology || skill?.name || '';
      return v ? [v] : [];
    });
  }

  // Format B: normalized CV service shape (e.g. { skills: { technical: [{name, level}], soft: [...] } })
  const technical = Array.isArray(cv.skills?.technical) ? cv.skills.technical : [];
  const soft = Array.isArray(cv.skills?.soft) ? cv.skills.soft : [];

  const toName = (skill) => {
    if (typeof skill === 'string') return skill;
    return skill?.name || skill?.technology || '';
  };

  return [...technical, ...soft].flatMap((s) => {
    const v = toName(s);
    return v ? [v] : [];
  });
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
export default function EmployeeDetailPanel({ employee, project, onClose, onAssign }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');

  const user = employee?.user ?? {};
  const displayName = (typeof user.name === 'string' ? user.name : '').trim();
  const safeDisplayName =
    displayName || t('team.employeeDetail.fallbackName', { defaultValue: 'Unknown user' });
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
        openness: backendProfile.Openness ?? 0,
      },
    };
  }, [employee]);

  const [bfiState, setBfiState] = useState(() => ({
    profile: employee?.bfi44Profile || mappedUserBfi44Profile || null,
    loading: false,
    forbidden: false,
  }));
  const lastFetchUserIdRef = useRef(null);

  // Load BFI-44 profile if not already loaded
  useEffect(() => {
    const currentProfile = employee?.bfi44Profile || mappedUserBfi44Profile;
    const hasTraits = Boolean(currentProfile?.traits);
    const userId = employee?.user?._id;
    const shouldFetch = activeTab === 'personality' && userId && !hasTraits && lastFetchUserIdRef.current !== userId;

    // Reset and set loading in one update when we will fetch
    setBfiState({
      profile: currentProfile || null,
      loading: shouldFetch,
      forbidden: false,
    });
    lastFetchUserIdRef.current = null;

    if (!shouldFetch) return;

    lastFetchUserIdRef.current = userId;

    (async () => {
      try {
        const response = await getProfileByUserId(userId);
        const profile = response.data?.data || response.data;
        setBfiState(prev => ({
          ...prev,
          profile: profile?.traits ? profile : prev.profile,
          loading: false,
        }));
      } catch (error) {
        const status = error.response?.status;
        setBfiState(prev => ({
          ...prev,
          profile: null,
          loading: false,
          forbidden: status === 403,
        }));
      }
    })();
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
    bfi44Profile: bfiState.profile || employee.bfi44Profile || mappedUserBfi44Profile,
  };

  const projectTechNames = Array.isArray(project?.mainTechnologies)
    ? project.mainTechnologies.flatMap((t) => {
        const v = normalizeTechName(t);
        return v ? [v] : [];
      })
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
    ? projectTechNames.filter(
        (tech) => !cvSkillNames.some((s) => (s || '').toLowerCase() === tech.toLowerCase())
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
    { id: 'achievements', label: t('team.employeeDetail.tabs.achievements'), icon: Award },
  ];

  return (
    <>
      <button
        type="button"
        style={{ ...styles.backdrop, border: 'none', padding: 0, cursor: 'default' }}
        onClick={onClose}
        aria-label={t('team.employeeDetail.aria.closePanel')}
      />
      <div style={styles.panel}>
        {/* Header */}
        <div style={styles.header}>
          <EmployeeHeader
            safeDisplayName={safeDisplayName}
            avatarInitial={avatarInitial}
            email={email}
            onClose={onClose}
          />

          <EmployeeSummary
            showMatchScore={showMatchScore}
            matchScorePercentage={matchScorePercentage}
            skillsMatchPercentage={skillsMatchPercentage}
            effectiveMatchedSkillsCount={effectiveMatchedSkillsCount}
            effectiveMissingSkillsCount={effectiveMissingSkillsCount}
          />
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button type="button"
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  ...styles.tab,
                  ...(activeTab === tab.id ? styles.activeTab : {}),
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
            <QuickInsightsSection employee={enhancedEmployee} project={project} />
          )}

          {activeTab === 'skills' && (
            <SkillsMatchSection employee={enhancedEmployee} project={project} />
          )}

          {activeTab === 'personality' && (
            <PersonalityFitSection
              employee={enhancedEmployee}
              loading={bfiState.loading}
              forbidden={bfiState.forbidden}
            />
          )}

          {activeTab === 'availability' && <AvailabilitySection employee={enhancedEmployee} />}

          {activeTab === 'achievements' && (
            <>
              <EmployeeAchievements employee={enhancedEmployee} />
              <EmployeeEducation employee={enhancedEmployee} />
            </>
          )}
        </div>

        {/* Footer Actions */}
        <EmployeeActions employee={employee} onAssign={onAssign} />
      </div>
    </>
  );
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
    borderBottom: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-bg-muted)',
  },

  // Tabs
  tabs: {
    display: 'flex',
    borderBottom: '1px solid var(--color-border)',
    backgroundColor: '#fff',
    overflowX: 'auto',
  },
  tab: {
    flex: 1,
    padding: '12px 16px',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--color-text-secondary)',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    transition: 'all 0.2s',
    borderBottomWidth: '2px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'transparent',
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
};
