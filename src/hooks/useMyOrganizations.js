import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { getMyOrganizations, createOrganization } from '../api/organization';

const normalizeTrimmed = (rawValue) => {
  const value = rawValue?.trim();
  return value ?? '';
};

const normalizeWebsite = (rawValue) => {
  const value = rawValue?.trim();
  if (!value) {
    return undefined;
  }
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidWebsite = (rawValue) => {
  const normalized = normalizeWebsite(rawValue);
  if (!normalized) {
    return true;
  }
  try {
    const url = new URL(normalized);
    return Boolean(url);
  } catch {
    return false;
  }
};

/**
 * Custom hook for My Organizations page business logic
 * Manages loading organizations and creating new ones
 */
export function useMyOrganizations() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

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
      country: '',
    },
    email: '',
    phone: '',
    website: '',
    industry: '',
    size: '',
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
    setCreateForm((prev) => {
      if (field.startsWith('address.')) {
        const addressField = field.slice('address.'.length);
        return {
          ...prev,
          address: {
            ...prev.address,
            [addressField]: value,
          },
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
        country: '',
      },
      email: '',
      phone: '',
      website: '',
      industry: '',
      size: '',
    });
    setCreateError(null);
  };

  /**
   * Validate create form
   */
  const validateCreateForm = () => {
    const name = normalizeTrimmed(createForm.name);
    const email = normalizeTrimmed(createForm.email);

    if (!name) {
      setCreateError(t('organization.errors.nameRequired'));
      return false;
    }
    if (name.length < 2) {
      setCreateError(t('organization.errors.nameMinLength'));
      return false;
    }
    if (!email) {
      setCreateError(t('organization.errors.emailRequired'));
      return false;
    }
    if (!isValidEmail(email)) {
      setCreateError(t('organization.errors.emailInvalid'));
      return false;
    }
    if (!isValidWebsite(createForm.website)) {
      setCreateError(t('organization.errors.websiteInvalid'));
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
        country: toOptionalTrimmed(createForm.address?.country),
      };

      const hasAddress = Object.values(address).some(Boolean);

      const contact = {
        email: normalizeTrimmed(createForm.email),
        phone: toOptionalTrimmed(createForm.phone),
        website: normalizeWebsite(createForm.website),
      };

      const organizationData = {
        name: normalizeTrimmed(createForm.name),
        description: toOptionalTrimmed(createForm.description),
        taxId: toOptionalTrimmed(createForm.taxId),
        contact,
        industry: createForm.industry || undefined,
        size: createForm.size || undefined,
        ...(hasAddress ? { address } : {}),
      };

      await createOrganization(organizationData);

      // Reload organizations after creating
      await loadOrganizations();

      // Close modal and reset form
      setShowCreateModal(false);
      resetCreateForm();

      return true;
    } catch (error) {
      setCreateError(error.response?.data?.error || t('organization.errors.createFailed'));
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
    setShowCreateModal((prev) => !prev);
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
    toggleCreateModal,
  };
}
