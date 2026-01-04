import * as LucideIcons from 'lucide-react';

/**
 * Notification Types
 * Defines all possible notification types in the system
 * Synchronized with backend notification.controller.js
 */

export const NOTIFICATION_TYPES = {
  // Account/Email Related
  EMAIL_CONFIRMATION: 'email_confirmation',
  ACCOUNT_CONFIRMED: 'account_confirmed',
  PASSWORD_CHANGED: 'password_changed',
  
  // CV Related
  CV_UPLOADED: 'cv_uploaded',
  CV_UPDATED: 'cv_updated',
  CV_DELETED: 'cv_deleted',
  CV_PROCESSED: 'cv_processed',
  CV_PROCESSING_FAILED: 'cv_processing_failed',
  CV_ANALYSIS_FAILED: 'cv_analysis_failed',
  
  // Organization - CV Related
  CV_SUBMITTED_TO_ORG: 'cv_submitted_to_org',
  CV_REVIEWED: 'cv_reviewed',
  CV_STATUS_CHANGED: 'cv_status_changed',
  
  // Organization - Employee Related
  ORG_EMPLOYEE_ADDED: 'org_employee_added',
  ORG_EMPLOYEE_REMOVED: 'org_employee_removed',
  ORG_EMPLOYEE_STATUS_CHANGED: 'org_employee_status_changed',
  
  // Organization - Admin Related
  ORG_ADMIN_ADDED: 'org_admin_added',
  ORG_SETTINGS_UPDATED: 'org_settings_updated',
  
  // Project Related
  PROJECT_CREATED: 'project_created',
  PROJECT_UPDATED: 'project_updated',
  PROJECT_DELETED: 'project_deleted',
  PROJECT_ACTIVATED: 'project_activated',
  PROJECT_COMPLETED: 'project_completed',
  PROJECT_CANCELLED: 'project_cancelled',
  ASSIGNED_TO_PROJECT: 'assigned_to_project',
  REMOVED_FROM_PROJECT: 'removed_from_project',
  PROJECT_MANAGER_ROLE_ASSIGNED: 'project_manager_role_assigned',
  PROJECT_MANAGER_ROLE_REMOVED: 'project_manager_role_removed',
  
  // Profile Related
  PROFILE_UPDATED: 'profile_updated',
  PROFILE_INCOMPLETE: 'profile_incomplete',
  
  // System Related
  SYSTEM_NOTIFICATION: 'system_notification',
  WELCOME: 'welcome'
};

/**
 * Notification Priority Levels
 */
export const NOTIFICATION_PRIORITIES = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent'
};

/**
 * Get notification type label
 * @param {string} type - Notification type
 * @returns {string} Human-readable label
 */
export const getNotificationTypeLabel = (type) => {
  const labels = {
    [NOTIFICATION_TYPES.EMAIL_CONFIRMATION]: 'Email confirmation',
    [NOTIFICATION_TYPES.ACCOUNT_CONFIRMED]: 'Account confirmed',
    [NOTIFICATION_TYPES.PASSWORD_CHANGED]: 'Password changed',
    [NOTIFICATION_TYPES.CV_UPLOADED]: 'CV uploaded',
    [NOTIFICATION_TYPES.CV_UPDATED]: 'CV updated',
    [NOTIFICATION_TYPES.CV_DELETED]: 'CV deleted',
    [NOTIFICATION_TYPES.CV_PROCESSED]: 'CV processed',
    [NOTIFICATION_TYPES.CV_PROCESSING_FAILED]: 'CV processing failed',
    [NOTIFICATION_TYPES.CV_ANALYSIS_FAILED]: 'CV analysis failed',
    [NOTIFICATION_TYPES.CV_SUBMITTED_TO_ORG]: 'CV submitted to organization',
    [NOTIFICATION_TYPES.CV_REVIEWED]: 'CV reviewed',
    [NOTIFICATION_TYPES.CV_STATUS_CHANGED]: 'CV status changed',
    [NOTIFICATION_TYPES.ORG_EMPLOYEE_ADDED]: 'Added to organization',
    [NOTIFICATION_TYPES.ORG_EMPLOYEE_REMOVED]: 'Removed from organization',
    [NOTIFICATION_TYPES.ORG_EMPLOYEE_STATUS_CHANGED]: 'Employee status changed',
    [NOTIFICATION_TYPES.ORG_ADMIN_ADDED]: 'Promoted to admin',
    [NOTIFICATION_TYPES.ORG_SETTINGS_UPDATED]: 'Organization settings updated',
    [NOTIFICATION_TYPES.PROJECT_CREATED]: 'Project created',
    [NOTIFICATION_TYPES.PROJECT_UPDATED]: 'Project updated',
    [NOTIFICATION_TYPES.PROJECT_DELETED]: 'Project deleted',
    [NOTIFICATION_TYPES.PROJECT_ACTIVATED]: 'Project activated',
    [NOTIFICATION_TYPES.PROJECT_COMPLETED]: 'Project completed',
    [NOTIFICATION_TYPES.PROJECT_CANCELLED]: 'Project cancelled',
    [NOTIFICATION_TYPES.ASSIGNED_TO_PROJECT]: 'Assigned to project',
    [NOTIFICATION_TYPES.REMOVED_FROM_PROJECT]: 'Removed from project',
    [NOTIFICATION_TYPES.PROJECT_MANAGER_ROLE_ASSIGNED]: 'Assigned as project manager',
    [NOTIFICATION_TYPES.PROJECT_MANAGER_ROLE_REMOVED]: 'Project manager role removed',
    [NOTIFICATION_TYPES.PROFILE_UPDATED]: 'Profile updated',
    [NOTIFICATION_TYPES.PROFILE_INCOMPLETE]: 'Profile incomplete',
    [NOTIFICATION_TYPES.SYSTEM_NOTIFICATION]: 'System notification',
    [NOTIFICATION_TYPES.WELCOME]: 'Welcome'
  };
  
  return labels[type] || type;
};

/**
 * Get notification type icon component
 * Returns a Lucide React icon component class
 * @param {string} type - Notification type
 * @returns {React.Component} Lucide icon component
 */
export const getNotificationTypeIcon = (type) => {
  const iconMap = {
    [NOTIFICATION_TYPES.EMAIL_CONFIRMATION]: LucideIcons.Mail,
    [NOTIFICATION_TYPES.ACCOUNT_CONFIRMED]: LucideIcons.CheckCircle,
    [NOTIFICATION_TYPES.PASSWORD_CHANGED]: LucideIcons.Lock,
    [NOTIFICATION_TYPES.CV_UPLOADED]: LucideIcons.FileText,
    [NOTIFICATION_TYPES.CV_UPDATED]: LucideIcons.Edit3,
    [NOTIFICATION_TYPES.CV_DELETED]: LucideIcons.Trash2,
    [NOTIFICATION_TYPES.CV_PROCESSED]: LucideIcons.CheckCircle,
    [NOTIFICATION_TYPES.CV_PROCESSING_FAILED]: LucideIcons.XCircle,
    [NOTIFICATION_TYPES.CV_ANALYSIS_FAILED]: LucideIcons.AlertTriangle,
    [NOTIFICATION_TYPES.CV_SUBMITTED_TO_ORG]: LucideIcons.Send,
    [NOTIFICATION_TYPES.CV_REVIEWED]: LucideIcons.Eye,
    [NOTIFICATION_TYPES.CV_STATUS_CHANGED]: LucideIcons.RefreshCw,
    [NOTIFICATION_TYPES.ORG_EMPLOYEE_ADDED]: LucideIcons.Users,
    [NOTIFICATION_TYPES.ORG_EMPLOYEE_REMOVED]: LucideIcons.UserMinus,
    [NOTIFICATION_TYPES.ORG_EMPLOYEE_STATUS_CHANGED]: LucideIcons.RefreshCw,
    [NOTIFICATION_TYPES.ORG_ADMIN_ADDED]: LucideIcons.Crown,
    [NOTIFICATION_TYPES.ORG_SETTINGS_UPDATED]: LucideIcons.Settings,
    [NOTIFICATION_TYPES.PROJECT_CREATED]: LucideIcons.Rocket,
    [NOTIFICATION_TYPES.PROJECT_UPDATED]: LucideIcons.Edit,
    [NOTIFICATION_TYPES.PROJECT_DELETED]: LucideIcons.Trash2,
    [NOTIFICATION_TYPES.PROJECT_ACTIVATED]: LucideIcons.CheckCircle,
    [NOTIFICATION_TYPES.PROJECT_COMPLETED]: LucideIcons.PartyPopper,
    [NOTIFICATION_TYPES.PROJECT_CANCELLED]: LucideIcons.XCircle,
    [NOTIFICATION_TYPES.ASSIGNED_TO_PROJECT]: LucideIcons.User,
    [NOTIFICATION_TYPES.REMOVED_FROM_PROJECT]: LucideIcons.UserMinus,
    [NOTIFICATION_TYPES.PROJECT_MANAGER_ROLE_ASSIGNED]: LucideIcons.Target,
    [NOTIFICATION_TYPES.PROJECT_MANAGER_ROLE_REMOVED]: LucideIcons.BarChart3,
    [NOTIFICATION_TYPES.PROFILE_UPDATED]: LucideIcons.Sparkles,
    [NOTIFICATION_TYPES.PROFILE_INCOMPLETE]: LucideIcons.AlertTriangle,
    [NOTIFICATION_TYPES.SYSTEM_NOTIFICATION]: LucideIcons.Info,
    [NOTIFICATION_TYPES.WELCOME]: LucideIcons.PartyPopper
  };
  
  return iconMap[type] || LucideIcons.Bell;
};

/**
 * Get notification type color
 * @param {string} type - Notification type
 * @returns {string} Color code
 */
export const getNotificationTypeColor = (type) => {
  const colors = {
    [NOTIFICATION_TYPES.EMAIL_CONFIRMATION]: '#2196f3',
    [NOTIFICATION_TYPES.ACCOUNT_CONFIRMED]: '#4caf50',
    [NOTIFICATION_TYPES.PASSWORD_CHANGED]: '#607d8b',
    [NOTIFICATION_TYPES.CV_UPLOADED]: '#2196f3',
    [NOTIFICATION_TYPES.CV_UPDATED]: '#ff9800',
    [NOTIFICATION_TYPES.CV_DELETED]: '#f44336',
    [NOTIFICATION_TYPES.CV_PROCESSED]: '#4caf50',
    [NOTIFICATION_TYPES.CV_PROCESSING_FAILED]: '#f44336',
    [NOTIFICATION_TYPES.CV_ANALYSIS_FAILED]: '#f44336',
    [NOTIFICATION_TYPES.CV_SUBMITTED_TO_ORG]: '#2196f3',
    [NOTIFICATION_TYPES.CV_REVIEWED]: '#9c27b0',
    [NOTIFICATION_TYPES.CV_STATUS_CHANGED]: '#ff9800',
    [NOTIFICATION_TYPES.ORG_EMPLOYEE_ADDED]: '#4caf50',
    [NOTIFICATION_TYPES.ORG_EMPLOYEE_REMOVED]: '#f44336',
    [NOTIFICATION_TYPES.ORG_EMPLOYEE_STATUS_CHANGED]: '#ff9800',
    [NOTIFICATION_TYPES.ORG_ADMIN_ADDED]: '#673ab7',
    [NOTIFICATION_TYPES.ORG_SETTINGS_UPDATED]: '#607d8b',
    [NOTIFICATION_TYPES.PROJECT_CREATED]: '#2196f3',
    [NOTIFICATION_TYPES.PROJECT_UPDATED]: '#ff9800',
    [NOTIFICATION_TYPES.PROJECT_DELETED]: '#f44336',
    [NOTIFICATION_TYPES.PROJECT_ACTIVATED]: '#4caf50',
    [NOTIFICATION_TYPES.PROJECT_COMPLETED]: '#673ab7',
    [NOTIFICATION_TYPES.PROJECT_CANCELLED]: '#f44336',
    [NOTIFICATION_TYPES.ASSIGNED_TO_PROJECT]: '#4caf50',
    [NOTIFICATION_TYPES.REMOVED_FROM_PROJECT]: '#ff9800',
    [NOTIFICATION_TYPES.PROJECT_MANAGER_ROLE_ASSIGNED]: '#673ab7',
    [NOTIFICATION_TYPES.PROJECT_MANAGER_ROLE_REMOVED]: '#ff9800',
    [NOTIFICATION_TYPES.PROFILE_UPDATED]: '#4caf50',
    [NOTIFICATION_TYPES.PROFILE_INCOMPLETE]: '#ff9800',
    [NOTIFICATION_TYPES.SYSTEM_NOTIFICATION]: '#2196f3',
    [NOTIFICATION_TYPES.WELCOME]: '#4caf50'
  };
  
  return colors[type] || '#2196f3';
};

export default {
  NOTIFICATION_TYPES,
  NOTIFICATION_PRIORITIES,
  getNotificationTypeLabel,
  getNotificationTypeIcon,
  getNotificationTypeColor
};
