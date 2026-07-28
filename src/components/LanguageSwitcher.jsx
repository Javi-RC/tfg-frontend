import React from 'react';
import { useTranslation } from 'react-i18next';
import enFlag from '../assets/en.svg';
import esFlag from '../assets/es.svg';
import { updateLanguagePreference } from '../api/language';
import { getUser } from '../api/tokenStore';
import './LanguageSwitcher.css';

const languages = [
  { code: 'en', label: 'English', flagSrc: enFlag },
  { code: 'es', label: 'Español', flagSrc: esFlag },
];

/**
 * LanguageSwitcher Component
 * Allows users to switch between English and Spanish
 * Syncs language preference with backend
 */
export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const activeCode = (i18n.language || 'en').split('-')[0];
  const currentLanguage = languages.find((lang) => lang.code === activeCode) || languages[0];

  const handleLanguageChange = async (langCode) => {
    if (langCode === activeCode || isSaving) return;

    setIsSaving(true);
    setIsOpen(false);

    try {
      // Update i18n immediately for better UX
      await i18n.changeLanguage(langCode);

      // Sync with backend (only if user is authenticated)
      if (getUser()) {
        try {
          await updateLanguagePreference(langCode);
        } catch (err) {
          // Silently fail if backend sync fails - language is still changed locally
          console.warn('Failed to sync language preference with backend:', err);
        }
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="languageswitcher-root">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isSaving}
        className="languageswitcher-toggle"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <img
          src={currentLanguage.flagSrc}
          alt={currentLanguage.label}
          width={18}
          height={18}
          className="languageswitcher-flag"
        />
        <span>{currentLanguage.code.toUpperCase()}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="languageswitcher-backdrop"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div
            className="languageswitcher-dropdown"
            role="menu"
          >
            {languages.map((lang) => (
              <button
                type="button"
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                disabled={isSaving}
                className={`languageswitcher-option ${currentLanguage.code === lang.code ? 'languageswitcher-option--active' : 'languageswitcher-option--inactive'} ${isSaving ? 'languageswitcher-option--saving' : ''}`}
                role="menuitem"
              >
                <img
                  src={lang.flagSrc}
                  alt={lang.label}
                  width={20}
                  height={20}
                  className="languageswitcher-option-flag"
                />
                <span>{lang.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
