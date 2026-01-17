import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import {
  getOrganizationById,
  getOrganizationStats,
  updateOrganizationSettings,
  addEmployee,
  removeEmployee,
  updateEmployeeStatus,
  updateCVStatus
} from '../api/organization';

/**
 * Custom hook for Organization Detail business logic
 * Manages organization data, employees, CVs, and settings
 */
export function useOrganization() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [organization, setOrganization] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState('');

  // Check if current user is admin of THIS specific organization
  const isAdmin = user && organization && (
    // User is the creator of the organization
    (organization.createdBy === user._id || organization.createdBy?._id === user._id) ||
    // Or user is in the admins array
    (organization.admins && organization.admins.some(admin => 
      (typeof admin === 'string' ? admin : admin._id) === user._id
    ))
  );

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
      setError(err.response?.data?.error || err.message || 'Error loading organization');
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
      setError(err.response?.data?.error || 'Error updating settings');
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
      setError(err.response?.data?.error || 'Error adding employee');
      return false;
    }
  };

  /**
   * Remove employee from organization
   */
  const handleRemoveEmployee = async (employeeId) => {
    if (!window.confirm('Are you sure you want to remove this employee?')) {
      return false;
    }

    try {
      await removeEmployee(id, employeeId);
      await loadOrganization();
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Error removing employee');
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
      setError(err.response?.data?.error || 'Error updating employee');
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
      setError(err.response?.data?.error || 'Error updating CV status');
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
    handleAddEmployee,
    handleRemoveEmployee,
    handleUpdateEmployeeStatus,
    handleUpdateCVStatus,
    handleViewCV,
    handleViewProject,
    clearError,
    reloadOrganization: loadOrganization,
    reloadStats: loadStats
  };
}
