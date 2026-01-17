import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { 
  getMyOrganizations, 
  createOrganization
} from '../api/organization';

/**
 * Custom hook for My Organizations page business logic
 * Manages loading organizations and creating new ones
 */
export function useMyOrganizations() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    taxId: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    },
    email: '',
    phone: '',
    website: '',
    industry: '',
    size: ''
  });
  const [createError, setCreateError] = useState(null);
  const [creating, setCreating] = useState(false);

  const isOrgAdmin = user?.role === 'org_admin';

  useEffect(() => {
    loadOrganizations();
  }, []);

  /**
   * Load user's organizations
   */
  const loadOrganizations = async () => {
    try {
      setLoading(true);
      const res = await getMyOrganizations();
      
      if (res.data?.success && Array.isArray(res.data.data)) {
        setOrganizations(res.data.data);
      } else if (Array.isArray(res.data)) {
        setOrganizations(res.data);
      } else {
        setOrganizations([]);
      }
    } catch (error) {
      console.error('Error loading organizations:', error);
      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update create form field
   */
  const updateCreateForm = (field, value) => {
    setCreateForm(prev => {
      if (field.startsWith('address.')) {
        const addressField = field.slice('address.'.length);
        return {
          ...prev,
          address: {
            ...prev.address,
            [addressField]: value
          }
        };
      }

      return { ...prev, [field]: value };
    });
    setCreateError(null);
  };

  /**
   * Reset create form
   */
  const resetCreateForm = () => {
    setCreateForm({
      name: '',
      description: '',
      taxId: '',
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
      },
      email: '',
      phone: '',
      website: '',
      industry: '',
      size: ''
    });
    setCreateError(null);
  };

  /**
   * Validate create form
   */
  const validateCreateForm = () => {
    if (!createForm.name.trim()) {
      setCreateError('Organization name is required');
      return false;
    }
    if (createForm.name.trim().length < 2) {
      setCreateError('Organization name must be at least 2 characters');
      return false;
    }
    if (!createForm.email.trim()) {
      setCreateError('Email is required');
      return false;
    }
    setCreateError(null);
    return true;
  };

  /**
   * Handle create organization
   */
  const handleCreateOrganization = async () => {
    if (!validateCreateForm()) {
      return false;
    }

    try {
      setCreating(true);
      setCreateError(null);

      const toOptionalTrimmed = (rawValue) => {
        const value = rawValue?.trim();
        return value ? value : undefined;
      };

      const address = {
        street: toOptionalTrimmed(createForm.address?.street),
        city: toOptionalTrimmed(createForm.address?.city),
        state: toOptionalTrimmed(createForm.address?.state),
        postalCode: toOptionalTrimmed(createForm.address?.postalCode),
        country: toOptionalTrimmed(createForm.address?.country)
      };

      const hasAddress = Object.values(address).some(Boolean);

      const organizationData = {
        name: createForm.name.trim(),
        description: toOptionalTrimmed(createForm.description),
        taxId: toOptionalTrimmed(createForm.taxId),
        email: createForm.email.trim(),
        phone: toOptionalTrimmed(createForm.phone),
        website: toOptionalTrimmed(createForm.website),
        industry: createForm.industry || undefined,
        size: createForm.size || undefined,
        ...(hasAddress ? { address } : {})
      };
      
      await createOrganization(organizationData);
      
      // Reload organizations after creating
      await loadOrganizations();
      
      // Close modal and reset form
      setShowCreateModal(false);
      resetCreateForm();

      return true;
    } catch (error) {
      setCreateError(error.response?.data?.error || 'Error creating organization');
      return false;
    } finally {
      setCreating(false);
    }
  };

  /**
   * Navigate to organization detail
   */
  const navigateToOrganization = (orgId) => {
    navigate(`/organizations/${orgId}`);
  };

  /**
   * Toggle create modal
   */
  const toggleCreateModal = () => {
    setShowCreateModal(prev => !prev);
    if (showCreateModal) {
      resetCreateForm();
    }
  };

  return {
    // State
    organizations,
    loading,
    showCreateModal,
    createForm,
    createError,
    creating,
    isOrgAdmin,
    
    // Actions
    setShowCreateModal,
    loadOrganizations,
    updateCreateForm,
    resetCreateForm,
    handleCreateOrganization,
    navigateToOrganization,
    toggleCreateModal
  };
}

export default useMyOrganizations;
