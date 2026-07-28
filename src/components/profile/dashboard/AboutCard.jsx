import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileText } from 'lucide-react';

/**
 * AboutCard
 * "Sobre mí" bio. Falls back to a placeholder when the user has no bio,
 * since the backend does not yet store one.
 */
export default function AboutCard({ bio, onEdit }) {
  const { t } = useTranslation();
  const text = typeof bio === 'string' && bio.trim() ? bio : t('profile.dashboard.aboutPlaceholder');

  return (
    <section className="sara-card sara-card-pad">
      <div className="sara-card-head">
        <span className="sara-card-head-icon"><FileText size={19} aria-hidden="true" /></span>
        <span className="sara-card-title">{t('profile.dashboard.about')}</span>
        <span className="sara-card-head-action">
          <button type="button" className="sara-btn-ghost" onClick={onEdit}>
            {t('profile.dashboard.edit')}
          </button>
        </span>
      </div>
      <p className="sara-about-text">{text}</p>
    </section>
  );
}
