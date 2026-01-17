import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * SkipLink Component
 * Provides keyboard navigation shortcuts to main content areas
 * Visible only when focused for accessibility
 */
export default function SkipLink() {
  const { t } = useTranslation();
  
  return (
    <div className="skip-links">
      <a href="#main-content" className="skip-link">
        {t('navigation.skipToMain')}
      </a>
      <a href="#main-navigation" className="skip-link">
        {t('navigation.mainNavigation')}
      </a>
    </div>
  );
}
