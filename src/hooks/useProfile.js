import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProfileData } from './useProfileData';
import { useProfileEdit } from './useProfileEdit';
import { useCVConsent } from './useCVConsent';
import { usePersonalityConsent } from './usePersonalityConsent';
import { useOrganizationName } from './useOrganizationName';
import { useProfileNavigation } from './useProfileNavigation';

/**
 * Orchestrator hook composing all profile-related sub-hooks
 * Consumers continue calling useProfile() — zero breaking changes
 */
export function useProfile() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();

  const profileData = useProfileData();
  const profileEdit = useProfileEdit({
    profileUser: profileData.profileUser,
    onProfileUpdated: (data) => profileData.setProfile(data),
  });
  const cvConsent = useCVConsent();
  const personalityConsent = usePersonalityConsent();
  const organization = useOrganizationName({
    profileUser: profileData.profileUser,
    authUser,
  });
  const navigation = useProfileNavigation({ navigate });

  return {
    authUser,
    ...profileData,
    ...profileEdit,
    ...cvConsent,
    ...personalityConsent,
    ...organization,
    ...navigation,
  };
}
