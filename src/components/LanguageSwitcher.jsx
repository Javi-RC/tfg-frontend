import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import enFlag from '../assets/en.svg';
import esFlag from '../assets/es.svg';
import { updateLanguagePreference } from '../api/language';

/**
 * LanguageSwitcher Component
 * Allows users to switch between English and Spanish
 * Syncs language preference with backend
 */
export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const languages = [
    { code: 'en', label: 'English', flagSrc: enFlag },
    { code: 'es', label: 'Español', flagSrc: esFlag }
  ];

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
      const token = localStorage.getItem('token');
      if (token) {
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
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isSaving}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          background: 'transparent',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          cursor: isSaving ? 'wait' : 'pointer',
          fontSize: '14px',
          color: '#4a5568',
          transition: 'all 0.2s',
          opacity: isSaving ? 0.6 : 1
        }}
        onMouseEnter={(e) => {
          if (!isSaving) {
            e.currentTarget.style.background = '#f7fafc';
            e.currentTarget.style.borderColor = '#cbd5e0';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.borderColor = '#e2e8f0';
        }}
        aria-label={t('navigation.changeLanguage')}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe size={18} aria-hidden="true" />
        <img
          src={currentLanguage.flagSrc}
          alt={currentLanguage.label}
          width={18}
          height={18}
          style={{ display: 'block', borderRadius: '2px' }}
        />
        <span>{currentLanguage.code.toUpperCase()}</span>
      </button>

      {isOpen && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999
            }}
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              right: 0,
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              minWidth: '150px',
              zIndex: 1000,
              overflow: 'hidden'
            }}
            role="menu"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                disabled={isSaving}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  background: currentLanguage.code === lang.code ? '#f0f4f8' : 'transparent',
                  border: 'none',
                  cursor: isSaving ? 'wait' : 'pointer',
                  fontSize: '14px',
                  color: currentLanguage.code === lang.code ? '#2563eb' : '#4a5568',
                  fontWeight: currentLanguage.code === lang.code ? '600' : '400',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  opacity: isSaving ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                  if (currentLanguage.code !== lang.code && !isSaving) {
                    e.currentTarget.style.background = '#f7fafc';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentLanguage.code !== lang.code) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
                role="menuitem"
              >
                <img
                  src={lang.flagSrc}
                  alt={lang.label}
                  width={20}
                  height={20}
                  style={{ display: 'block', borderRadius: '2px' }}
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
