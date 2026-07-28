import { useState, useEffect } from 'react';
import { getMyOrganizations, getOrganizationById } from '../api/organization';

const isLikelyObjectId = (value) =>
  typeof value === 'string' && /^[a-f\d]{24}$/i.test(value.trim());

const getOrganizationValue = (primaryUser, fallbackUser) => {
  const candidate =
    primaryUser?.organization ??
    primaryUser?.organizationId ??
    primaryUser?.organization_id ??
    primaryUser?.orgId ??
    primaryUser?.org ??
    primaryUser?.organizationRef ??
    fallbackUser?.organization ??
    fallbackUser?.organizationId ??
    fallbackUser?.organization_id ??
    fallbackUser?.orgId ??
    fallbackUser?.org ??
    fallbackUser?.organizationRef;

  if (Array.isArray(candidate)) {
    if (candidate.length === 0) return null;
    return candidate[0];
  }

  if (
    primaryUser?.organizations &&
    Array.isArray(primaryUser.organizations) &&
    primaryUser.organizations.length > 0
  ) {
    return primaryUser.organizations[0];
  }

  if (
    fallbackUser?.organizations &&
    Array.isArray(fallbackUser.organizations) &&
    fallbackUser.organizations.length > 0
  ) {
    return fallbackUser.organizations[0];
  }

  return candidate ?? null;
};

/**
 * Custom hook for organization ID-to-name resolution
 * @param {Object} options
 * @param {Object|null} options.profileUser - Current profile user object
 * @param {Object|null} options.authUser - Authenticated user from context
 */
export function useOrganizationName({ profileUser, authUser }) {
  const [resolvedOrganizationName, setResolvedOrganizationName] = useState(null);
  const [resolvingOrganization, setResolvingOrganization] = useState(false);

  useEffect(() => {
    let mounted = true;

    const resolveOrganization = async () => {
      setResolvedOrganizationName(null);
      setResolvingOrganization(false);

      const orgValue = getOrganizationValue(profileUser, authUser);
      if (!orgValue) {
        setResolvingOrganization(true);
        try {
          const res = await getMyOrganizations();
          const list = res?.data?.success ? res?.data?.data : res?.data;
          const firstOrg = Array.isArray(list) ? list[0] : null;
          const name = firstOrg?.name || firstOrg?.title || null;
          if (mounted) setResolvedOrganizationName(name);
        } catch (err) {
          console.error('Error loading my organizations:', err);
          if (mounted) setResolvedOrganizationName(null);
        } finally {
          if (mounted) setResolvingOrganization(false);
        }
        return;
      }

      if (typeof orgValue === 'object') {
        const name = orgValue?.name || orgValue?.title || orgValue?.organizationName;
        if (mounted) setResolvedOrganizationName(name || null);
        return;
      }

      if (!isLikelyObjectId(orgValue)) {
        if (mounted) setResolvedOrganizationName(String(orgValue));
        return;
      }

      setResolvingOrganization(true);
      try {
        const res = await getOrganizationById(orgValue);
        const org = res?.data?.success && res?.data?.data ? res.data.data : res?.data;
        const name = org?.name || org?.title || null;
        if (mounted) setResolvedOrganizationName(name);
      } catch (err) {
        console.error('Error resolving organization:', err);
        if (mounted) setResolvedOrganizationName(null);
      } finally {
        if (mounted) setResolvingOrganization(false);
      }
    };

    resolveOrganization();
    return () => {
      mounted = false;
    };
  }, [profileUser, authUser]);

  return {
    resolvedOrganizationName,
    resolvingOrganization,
  };
}
