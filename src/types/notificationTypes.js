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
    [NOTIFICATION_TYPES.EMAIL_CONFIRMATION]: 'Confirmación de Email',
    [NOTIFICATION_TYPES.ACCOUNT_CONFIRMED]: 'Cuenta Confirmada',
    [NOTIFICATION_TYPES.PASSWORD_CHANGED]: 'Contraseña Cambiada',
    [NOTIFICATION_TYPES.CV_UPLOADED]: 'CV Subido',
    [NOTIFICATION_TYPES.CV_UPDATED]: 'CV Actualizado',
    [NOTIFICATION_TYPES.CV_DELETED]: 'CV Eliminado',
    [NOTIFICATION_TYPES.CV_PROCESSED]: 'CV Procesado',
    [NOTIFICATION_TYPES.CV_PROCESSING_FAILED]: 'Error en Procesamiento de CV',
    [NOTIFICATION_TYPES.CV_ANALYSIS_FAILED]: 'Error en Análisis de CV',
    [NOTIFICATION_TYPES.CV_SUBMITTED_TO_ORG]: 'CV Enviado a Organización',
    [NOTIFICATION_TYPES.CV_REVIEWED]: 'CV Revisado',
    [NOTIFICATION_TYPES.CV_STATUS_CHANGED]: 'Estado de CV Cambiado',
    [NOTIFICATION_TYPES.ORG_EMPLOYEE_ADDED]: 'Agregado a Organización',
    [NOTIFICATION_TYPES.ORG_EMPLOYEE_REMOVED]: 'Removido de Organización',
    [NOTIFICATION_TYPES.ORG_EMPLOYEE_STATUS_CHANGED]: 'Estado de Empleado Cambiado',
    [NOTIFICATION_TYPES.ORG_ADMIN_ADDED]: 'Promovido a Administrador',
    [NOTIFICATION_TYPES.ORG_SETTINGS_UPDATED]: 'Configuración de Organización Actualizada',
    [NOTIFICATION_TYPES.PROFILE_UPDATED]: 'Perfil Actualizado',
    [NOTIFICATION_TYPES.PROFILE_INCOMPLETE]: 'Perfil Incompleto',
    [NOTIFICATION_TYPES.SYSTEM_NOTIFICATION]: 'Notificación del Sistema',
    [NOTIFICATION_TYPES.WELCOME]: 'Bienvenida'
  };
  
  return labels[type] || type;
};

/**
 * Get notification type icon
 * @param {string} type - Notification type
 * @returns {string} Emoji icon
 */
export const getNotificationTypeIcon = (type) => {
  const icons = {
    [NOTIFICATION_TYPES.EMAIL_CONFIRMATION]: '📧',
    [NOTIFICATION_TYPES.ACCOUNT_CONFIRMED]: '✅',
    [NOTIFICATION_TYPES.PASSWORD_CHANGED]: '🔒',
    [NOTIFICATION_TYPES.CV_UPLOADED]: '📄',
    [NOTIFICATION_TYPES.CV_UPDATED]: '✏️',
    [NOTIFICATION_TYPES.CV_DELETED]: '🗑️',
    [NOTIFICATION_TYPES.CV_PROCESSED]: '✅',
    [NOTIFICATION_TYPES.CV_PROCESSING_FAILED]: '❌',
    [NOTIFICATION_TYPES.CV_ANALYSIS_FAILED]: '⚠️',
    [NOTIFICATION_TYPES.CV_SUBMITTED_TO_ORG]: '📤',
    [NOTIFICATION_TYPES.CV_REVIEWED]: '👀',
    [NOTIFICATION_TYPES.CV_STATUS_CHANGED]: '🔄',
    [NOTIFICATION_TYPES.ORG_EMPLOYEE_ADDED]: '👥',
    [NOTIFICATION_TYPES.ORG_EMPLOYEE_REMOVED]: '👋',
    [NOTIFICATION_TYPES.ORG_EMPLOYEE_STATUS_CHANGED]: '🔄',
    [NOTIFICATION_TYPES.ORG_ADMIN_ADDED]: '👑',
    [NOTIFICATION_TYPES.ORG_SETTINGS_UPDATED]: '⚙️',
    [NOTIFICATION_TYPES.PROFILE_UPDATED]: '✨',
    [NOTIFICATION_TYPES.PROFILE_INCOMPLETE]: '⚠️',
    [NOTIFICATION_TYPES.SYSTEM_NOTIFICATION]: 'ℹ️',
    [NOTIFICATION_TYPES.WELCOME]: '🎉'
  };
  
  return icons[type] || '📬';
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
