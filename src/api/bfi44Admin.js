import api from './axios';

/**
 * BFI-44 Admin API service
 * Handles admin/PM endpoints for managing BFI-44 across the organization.
 * Organization is resolved server-side from the JWT token.
 */

/**
 * Get employees who have not completed the BFI-44 test.
 * Requires org_admin or project manager role.
 * @returns {Promise} Response with list of employees without test
 */
export const getEmployeesWithoutTest = () =>
  api.get('/api/bfi-44/employees-without-test');

/**
 * Send notification to all employees who haven't completed the BFI-44.
 * Requires org_admin or project manager role.
 * No request body required.
 * @returns {Promise} Response with count of notified employees
 */
export const notifyPendingEmployees = () =>
  api.post('/api/bfi-44/notify-pending');

/**
 * Send notification to a specific employee who hasn't completed the BFI-44.
 * Requires org_admin or project manager role.
 * Target user must belong to the same organization.
 * @param {string} userId - ID of the employee to notify
 * @returns {Promise} Response with notification result
 */
export const notifyPendingEmployee = (userId) =>
  api.post(`/api/bfi-44/notify-pending/${userId}`);

/**
 * Get organization-wide BFI-44 statistics.
 * Requires org_admin role.
 * @returns {Promise} Response with stats (totalEmployees, completed, pending, completionRate)
 */
export const getOrganizationBFI44Stats = () =>
  api.get('/api/bfi-44/organization-stats');

export default {
  getEmployeesWithoutTest,
  notifyPendingEmployees,
  notifyPendingEmployee,
  getOrganizationBFI44Stats
};
