import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getLanguagePreference } from '../api/language';
import { getUser } from '../api/tokenStore';

export const useLanguagePreference = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const loadLanguagePreference = async () => {
      if (!getUser()) return;

      try {
        const response = await getLanguagePreference();
        const effectiveLanguage =
          response?.data?.data?.effectiveLanguage ||
          response?.data?.effectiveLanguage ||
          response?.data?.language ||
          null;

        if (effectiveLanguage && effectiveLanguage !== i18n.language) {
          await i18n.changeLanguage(effectiveLanguage);
        }
      } catch {
        // Silently fail
      }
    };

    loadLanguagePreference();
  }, [i18n]);

  return null;
};
