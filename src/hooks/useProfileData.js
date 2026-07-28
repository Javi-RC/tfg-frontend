import { useState, useEffect, useMemo } from 'react';
import { getProfile } from '../api/auth';

/**
 * Custom hook for profile fetching and profileUser derivation
 */
export function useProfileData() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const profileUser = useMemo(() => {
    if (!profile) return null;
    if (profile.data?.user) {
      return profile.data.user;
    }
    if (profile.user) {
      return profile.user;
    }
    return profile;
  }, [profile]);

  useEffect(() => {
    loadProfile();
  }, []);

  /**
   * Load user profile
   */
  const loadProfile = async () => {
    try {
      const res = await getProfile();
      setProfile(res.data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    setProfile,
    loading,
    profileUser,
    loadProfile,
  };
}
