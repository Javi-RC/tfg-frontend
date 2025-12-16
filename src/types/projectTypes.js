/**
 * Project Types and Constants
 * Defines all enums and constants for the project management system
 */

// ==================== Project Status ====================

export const PROJECT_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const PROJECT_STATUS_LABELS = {
  draft: 'Draft',
  active: 'Active',
  paused: 'Paused',
  completed: 'Completed',
  cancelled: 'Cancelled'
};

export const PROJECT_STATUS_COLORS = {
  draft: { bg: '#F3F4F6', text: '#6B7280' },
  active: { bg: '#D1FAE5', text: '#10B981' },
  paused: { bg: '#FEF3C7', text: '#F59E0B' },
  completed: { bg: '#DBEAFE', text: '#3B82F6' },
  cancelled: { bg: '#FEE2E2', text: '#EF4444' }
};

// ==================== Time Units ====================

export const TIME_UNITS = {
  MINUTES: 'minutes',
  HOURS: 'hours',
  DAYS: 'days',
  WEEKS: 'weeks',
  MONTHS: 'months',
  YEARS: 'years'
};

// ==================== Collaboration ====================

export const SYNCHRONOUS_COMMUNICATION = {
  YES: 'yes',
  NO: 'no',
  ONLY_CRITICAL: 'only_critical_moments'
};

export const COMMUNICATION_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

export const LANGUAGE_PROFICIENCY = {
  A1: 'A1',
  A2: 'A2',
  B1: 'B1',
  B2: 'B2',
  C1: 'C1',
  C2: 'C2',
  NATIVE: 'native',
  BILINGUAL: 'bilingual'
};

// ==================== Technical Requirements ====================

export const EXPERIENCE_LEVELS = {
  JUNIOR: 'junior',
  MID: 'mid',
  SENIOR: 'senior',
  EXPERT: 'expert'
};

export const COMPLEXITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

export const DOCUMENTATION_LEVELS = {
  COMPLETE: 'complete',
  PARTIAL: 'partial',
  MINIMAL: 'minimal',
  NONE: 'none'
};

// ==================== Management Methods ====================

export const MANAGEMENT_METHODS = {
  SCRUM: 'scrum',
  KANBAN: 'kanban',
  WATERFALL: 'waterfall',
  HYBRID: 'hybrid',
  OTHER: 'other'
};

export const FREQUENCY_OPTIONS = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
  NONE: 'none'
};

// ==================== Availability ====================

export const AFTER_HOURS_OPTIONS = {
  YES: 'yes',
  NO: 'no',
  OCCASIONAL: 'occasional'
};

// ==================== Risks ====================

export const RISK_CATEGORIES = {
  COMMUNICATION: 'communication',
  TECHNOLOGY: 'technology',
  COORDINATION: 'coordination',
  LANGUAGE: 'language',
  SCHEDULE: 'schedule',
  CULTURE: 'culture',
  OTHER: 'other'
};

export const RISK_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

export const RISK_SEVERITY_COLORS = {
  low: { bg: '#D1FAE5', text: '#10B981' },
  medium: { bg: '#FEF3C7', text: '#F59E0B' },
  high: { bg: '#FFEDD5', text: '#F97316' },
  critical: { bg: '#FEE2E2', text: '#EF4444' }
};

export const DIFFICULT_AREAS = {
  COMMUNICATION: 'communication',
  TECHNOLOGY: 'technology',
  COORDINATION: 'coordination',
  LANGUAGES: 'languages',
  SCHEDULES: 'schedules',
  CULTURE: 'culture',
  BUDGET: 'budget',
  RESOURCES: 'resources',
  OTHER: 'other'
};

// ==================== Information Flow ====================

export const INFORMATION_FLOW = {
  UNIDIRECTIONAL: 'unidirectional',
  BIDIRECTIONAL: 'bidirectional',
  MULTIPLE: 'multiple'
};

// ==================== Yes/No/Partial Options ====================

export const YES_NO_PARTIAL = {
  YES: 'yes',
  NO: 'no',
  PARTIAL: 'partial'
};

// ==================== Dependency Levels ====================

export const DEPENDENCY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

// ==================== Form Steps ====================

export const FORM_STEPS = [
  { id: 1, title: 'General Information', key: 'general' },
  { id: 2, title: 'Collaboration Requirements', key: 'collaboration' },
  { id: 3, title: 'Technical Requirements', key: 'technical' },
  { id: 4, title: 'Geographic Distribution', key: 'geographic' },
  { id: 5, title: 'Roles and Responsibilities', key: 'roles' },
  { id: 6, title: 'Availability Requirements', key: 'availability' },
  { id: 7, title: 'Coordination and Management', key: 'coordination' },
  { id: 8, title: 'Team Collaboration Intensity', key: 'collaboration_intensity' },
  { id: 9, title: 'Organizational Maturity', key: 'maturity' }
];

// ==================== Risk Score Ranges ====================

export const RISK_SCORE_RANGES = {
  LOW: { min: 0, max: 5, label: 'Low Risk', color: '#10B981' },
  MEDIUM: { min: 6, max: 15, label: 'Medium Risk', color: '#F59E0B' },
  HIGH: { min: 16, max: 30, label: 'High Risk', color: '#F97316' },
  CRITICAL: { min: 31, max: Infinity, label: 'Critical Risk', color: '#EF4444' }
};

export const getRiskLevel = (score) => {
  if (score <= 5) return 'LOW';
  if (score <= 15) return 'MEDIUM';
  if (score <= 30) return 'HIGH';
  return 'CRITICAL';
};

export const getRiskScoreInfo = (score) => {
  const level = getRiskLevel(score);
  return RISK_SCORE_RANGES[level];
};
