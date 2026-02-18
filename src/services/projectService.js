/**
 * Project Data Transformation Service
 * Handles normalization and transformation of project data
 */
import i18n from '../i18n';

/**
 * Normalize project manager data
 * @param {Object|string} projectManager - Project manager data or ID
 * @returns {Object|null} Normalized project manager object
 */
export function normalizeProjectManager(projectManager) {
  if (!projectManager) return null;
  
  if (typeof projectManager === 'string') {
    return { _id: projectManager, username: i18n.t('common.unknown') };
  }
  
  return projectManager;
}

/**
 * Normalize organization data
 * @param {Object|string} organization - Organization data or ID
 * @returns {Object|null} Normalized organization object
 */
export function normalizeOrganization(organization) {
  if (!organization) return null;
  
  if (typeof organization === 'string') {
    return { _id: organization, name: i18n.t('common.unknownOrganization') };
  }
  
  return organization;
}

/**
 * Normalize project data
 * @param {Object} project - Raw project data from API
 * @returns {Object} Normalized project object
 */
export function normalizeProject(project) {
  if (!project) return null;
  
  return {
    ...project,
    projectManager: normalizeProjectManager(project.projectManager),
    organization: normalizeOrganization(project.organization),
    createdAt: project.createdAt ? new Date(project.createdAt) : null,
    updatedAt: project.updatedAt ? new Date(project.updatedAt) : null,
    startDate: project.startDate ? new Date(project.startDate) : null,
    endDate: project.endDate ? new Date(project.endDate) : null
  };
}

/**
 * Extract unique organizations from projects list
 * @param {Array} projects - Array of projects
 * @returns {Array} Array of unique organizations
 */
export function extractUniqueOrganizations(projects) {
  const orgMap = new Map();
  
  projects.forEach(project => {
    const org = project.organization;
    if (org && org._id) {
      orgMap.set(org._id, org);
    }
  });
  
  return Array.from(orgMap.values());
}

/**
 * Group projects by status
 * @param {Array} projects - Array of projects
 * @returns {Object} Projects grouped by status
 */
export function groupProjectsByStatus(projects) {
  return projects.reduce((acc, project) => {
    const status = project.status || 'unknown';
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(project);
    return acc;
  }, {});
}

/**
 * Calculate project statistics
 * @param {Array} projects - Array of projects
 * @returns {Object} Project statistics
 */
export function calculateProjectStats(projects) {
  const stats = {
    total: projects.length,
    byStatus: {},
    byOrganization: {}
  };
  
  projects.forEach(project => {
    // Count by status
    const status = project.status || 'unknown';
    stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
    
    // Count by organization
    const orgId = project.organization?._id || 'unknown';
    stats.byOrganization[orgId] = (stats.byOrganization[orgId] || 0) + 1;
  });
  
  return stats;
}
