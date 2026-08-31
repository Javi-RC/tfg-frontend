import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import {
  getOrganizationById,
  getOrganizationStats,
  updateOrganization,
  updateOrganizationSettings,
  addEmployee,
  removeEmployee,
  updateEmployeeStatus,
  updateCVStatus,
} from '../api/organization';

/**
 * Custom hook for Organization Detail business logic
 * Manages organization data, employees, CVs, and settings
 */
export function useOrganization() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [organization, setOrganization] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState('');

  // Check if current user is admin of THIS specific organization
  const isAdmin =
    user &&
    organization &&
    // User has org_admin role (organization administrators have full access)
    (user.role === 'org_admin' ||
      // Or user is the creator of the organization
      organization.createdBy === user._id ||
      organization.createdBy?._id === user._id ||
      // Or user is in the admins array
      (organization.admins &&
        organization.admins.some(
          (admin) => (typeof admin === 'string' ? admin : admin._id) === user._id
        )));

  useEffect(() => {
    loadOrganization();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    // Load stats only when organization is loaded and user is admin
    if (organization && isAdmin) {
      loadStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organization, isAdmin]);

  /**
   * Load organization data
   */
  const loadOrganization = async () => {
    try {
      setLoading(true);
      const res = await getOrganizationById(id);

      if (res.data?.success && res.data?.data) {
        setOrganization(res.data.data);
      } else if (res.data && !res.data.success) {
        setOrganization(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || t('organization.errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load organization statistics
   */
  const loadStats = async () => {
    try {
      const res = await getOrganizationStats(id);
      setStats(res.data?.data || res.data);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  /**
   * Update organization settings
   */
  const handleUpdateSettings = async (settings) => {
    try {
      await updateOrganizationSettings(id, settings);
      await loadOrganization();
      return true;
    } catch (err) {
      setError(err.response?.data?.error || t('organization.errors.updateSettingsFailed'));
      return false;
    }
  };

  /**
   * Update organization profile
   */
  const handleUpdateOrganization = async (updates) => {
    try {
      await updateOrganization(id, updates);
      await loadOrganization();
      return true;
    } catch (err) {
      setError(err.response?.data?.error || t('organization.errors.updateFailed'));
      return false;
    }
  };

  /**
   * Add employee to organization
   */
  const handleAddEmployee = async (employeeData) => {
    try {
      await addEmployee(id, employeeData);
      await loadOrganization();
      return true;
    } catch (err) {
      setError(err.response?.data?.error || t('organization.errors.addEmployeeFailed'));
      return false;
    }
  };

  /**
   * Remove employee from organization
   */
  const handleRemoveEmployee = async (employeeId) => {
    const accepted = await confirm({
      message: t('organization.errors.confirmRemoveEmployee'),
      confirmLabel: t('common.remove'),
      destructive: true,
    });
    if (!accepted) return false;

    try {
      await removeEmployee(id, employeeId);
      await loadOrganization();
      return true;
    } catch (err) {
      setError(err.response?.data?.error || t('organization.errors.removeEmployeeFailed'));
      return false;
    }
  };

  /**
   * Update employee status (e.g., isProjectManager)
   */
  const handleUpdateEmployeeStatus = async (employeeId, updates) => {
    try {
      await updateEmployeeStatus(id, employeeId, updates);
      await loadOrganization();
      return true;
    } catch (err) {
      setError(err.response?.data?.error || t('organization.errors.updateEmployeeFailed'));
      return false;
    }
  };

  /**
   * Update CV status (approve/reject)
   */
  const handleUpdateCVStatus = async (cvId, status) => {
    try {
      await updateCVStatus(id, cvId, status);
      await loadOrganization();
      return true;
    } catch (err) {
      setError(err.response?.data?.error || t('organization.errors.updateCvStatusFailed'));
      return false;
    }
  };

  /**
   * Navigate to CV detail
   */
  const handleViewCV = (cvId) => {
    navigate(`/organizations/${id}/cvs/${cvId}`);
  };

  /**
   * Navigate to project
   */
  const handleViewProject = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  /**
   * Clear error
   */
  const clearError = () => {
    setError('');
  };

  return {
    // State
    organization,
    stats,
    loading,
    activeTab,
    error,

    // Permissions
    isAdmin,

    // Actions
    setActiveTab,
    handleUpdateSettings,
    handleUpdateOrganization,
    handleAddEmployee,
    handleRemoveEmployee,
    handleUpdateEmployeeStatus,
    handleUpdateCVStatus,
    handleViewCV,
    handleViewProject,
    clearError,
    reloadOrganization: loadOrganization,
    reloadStats: loadStats,
  };
}
