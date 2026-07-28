import i18n from '../i18n';

/**
 * Get the current language code (e.g., 'en' or 'es')
 * @returns {string} Two-letter language code
 */
export function getCurrentLanguage() {
  return i18n.language?.split('-')[0] || 'en';
}
