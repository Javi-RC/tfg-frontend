/**
 * Project Types and Constants
 * Defines all enums and constants for the project management system
 */
import i18n from '../i18n';

// ==================== Project Status ====================

export const PROJECT_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const getProjectStatusLabel = (status) => i18n.t(`projectStatus.${status}`, status);

export const PROJECT_STATUS_COLORS = {
  draft: { bg: '#F3F4F6', text: '#6B7280' },
  active: { bg: '#D1FAE5', text: '#10B981' },
  paused: { bg: '#FEF3C7', text: '#F59E0B' },
  completed: { bg: '#DBEAFE', text: '#3B82F6' },
  cancelled: { bg: '#FEE2E2', text: '#EF4444' },
};

// ==================== Time Units ====================

export const TIME_UNITS = {
  MINUTES: 'minutes',
  HOURS: 'hours',
  DAYS: 'days',
  WEEKS: 'weeks',
  MONTHS: 'months',
  YEARS: 'years',
};

// ==================== Collaboration ====================

export const SYNCHRONOUS_COMMUNICATION = {
  YES: 'yes',
  NO: 'no',
  ONLY_CRITICAL: 'only_critical_moments',
};

export const COMMUNICATION_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

export const LANGUAGE_PROFICIENCY = {
  A1: 'A1',
  A2: 'A2',
  B1: 'B1',
  B2: 'B2',
  C1: 'C1',
  C2: 'C2',
  NATIVE: 'native',
  BILINGUAL: 'bilingual',
};

// ==================== Technical Requirements ====================

export const EXPERIENCE_LEVELS = {
  JUNIOR: 'junior',
  MID: 'mid',
  SENIOR: 'senior',
  EXPERT: 'expert',
};

export const COMPLEXITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

export const DOCUMENTATION_LEVELS = {
  COMPLETE: 'complete',
  PARTIAL: 'partial',
  MINIMAL: 'minimal',
  NONE: 'none',
};

const DOCUMENTATION_STANDARDIZATION = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

// ==================== Work Mode ====================

export const WORK_MODE = {
  INHERIT: 'inherit_from_organization',
  OFFICE_MODE: 'office_mode',
  OFFICE_FIRST: 'office_first',
  OFFICE_REMOTE_MIX: 'office_remote_mix',
  REMOTE_FIRST: 'remote_first',
  REMOTE_MODE: 'remote_mode',
};

export const getWorkModeLabel = (mode) => {
  const map = {
    inherit_from_organization: 'projects.workMode.inherit',
    office_mode: 'projects.workMode.officeMode',
    office_first: 'projects.workMode.officeFirst',
    office_remote_mix: 'projects.workMode.officeMix',
    remote_first: 'projects.workMode.remoteFirst',
    remote_mode: 'projects.workMode.remoteMode',
  };
  return i18n.t(map[mode] || mode);
};

// ==================== Management Methods ====================

export const MANAGEMENT_METHODS = {
  SCRUM: 'scrum',
  KANBAN: 'kanban',
  WATERFALL: 'waterfall',
  HYBRID: 'hybrid',
  OTHER: 'other',
};

export const FREQUENCY_OPTIONS = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
  NONE: 'none',
};

// ==================== Availability ====================

export const AFTER_HOURS_OPTIONS = {
  YES: 'yes',
  NO: 'no',
  OCCASIONAL: 'occasional',
};

// ==================== Risks ====================

const RISK_CATEGORIES = {
  COMMUNICATION: 'communication',
  TECHNOLOGY: 'technology',
  COORDINATION: 'coordination',
  LANGUAGE: 'language',
  SCHEDULE: 'schedule',
  CULTURE: 'culture',
  OTHER: 'other',
};

const RISK_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

const RISK_SEVERITY_COLORS = {
  low: { bg: '#D1FAE5', text: '#10B981' },
  medium: { bg: '#FEF3C7', text: '#F59E0B' },
  high: { bg: '#FFEDD5', text: '#F97316' },
  critical: { bg: '#FEE2E2', text: '#EF4444' },
};

const DIFFICULT_AREAS = {
  COMMUNICATION: 'communication',
  TECHNOLOGY: 'technology',
  COORDINATION: 'coordination',
  LANGUAGES: 'languages',
  SCHEDULES: 'schedules',
  CULTURE: 'culture',
  BUDGET: 'budget',
  RESOURCES: 'resources',
  OTHER: 'other',
};

// ==================== Information Flow ====================

export const INFORMATION_FLOW = {
  UNIDIRECTIONAL: 'unidirectional',
  BIDIRECTIONAL: 'bidirectional',
  MULTIPLE: 'multiple',
};

// ==================== Yes/No/Partial Options ====================

export const YES_NO_PARTIAL = {
  YES: 'yes',
  NO: 'no',
  PARTIAL: 'partial',
};

// ==================== Dependency Levels ====================

export const DEPENDENCY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

// ==================== Form Steps ====================

export const FORM_STEPS = [
  { id: 1, titleKey: 'projects.steps.step1.title', key: 'general' },
  { id: 2, titleKey: 'projects.steps.step2.title', key: 'collaboration' },
  { id: 3, titleKey: 'projects.steps.step3.title', key: 'technical' },
  { id: 4, titleKey: 'projects.steps.step4.title', key: 'geographic' },
  { id: 5, titleKey: 'projects.steps.step5.title', key: 'roles' },
  { id: 6, titleKey: 'projects.steps.step6.title', key: 'availability' },
  { id: 7, titleKey: 'projects.steps.step7.title', key: 'coordination' },
  { id: 8, titleKey: 'projects.steps.step8.title', key: 'collaboration_intensity' },
  { id: 9, titleKey: 'projects.steps.step9.title', key: 'maturity' },
];


