import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getLanguagePreference } from '../api/language';

/**
 * Hook to load and apply user's language preference from backend
 * Runs once when component mounts if user is authenticated
 */
export const useLanguagePreference = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const loadLanguagePreference = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        // User not authenticated, use browser/localStorage language
        return;
      }

      try {
        const response = await getLanguagePreference();
        
        // Handle different response structures
        const effectiveLanguage = 
          response?.data?.data?.effectiveLanguage || 
          response?.data?.effectiveLanguage ||
          response?.data?.language ||
          null;
        
        if (effectiveLanguage && effectiveLanguage !== i18n.language) {
          // Apply backend preference if different from current
          await i18n.changeLanguage(effectiveLanguage);
          console.log('[useLanguagePreference] Applied language from backend:', effectiveLanguage);
        }
      } catch (error) {
        // Silently fail - user will use browser/localStorage language
        // Only log if it's not a 404 (endpoint not implemented)
        if (error?.response?.status !== 404) {
          console.warn('Failed to load language preference:', error.message);
        }
      }
    };

    loadLanguagePreference();
  }, []); // Run only once on mount

  return null;
};
