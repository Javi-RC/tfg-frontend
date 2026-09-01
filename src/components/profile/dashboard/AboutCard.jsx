import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileText } from 'lucide-react';

export default function AboutCard({ bio, editMode, draft, onUpdateDraftField, onEdit }) {
  const { t } = useTranslation();
  const text = typeof bio === 'string' && bio.trim() ? bio : t('profile.dashboard.aboutPlaceholder');
  const displayBio = editMode ? (draft?.bio || '') : text;
  const isPlaceholder = !editMode && !(typeof bio === 'string' && bio.trim());

  return (
    <section className="sara-card sara-card-pad">
      <div className="sara-card-head">
        <span className="sara-card-head-icon"><FileText size={19} aria-hidden="true" /></span>
        <span className="sara-card-title">{t('profile.dashboard.about')}</span>
        {!editMode && (
          <span className="sara-card-head-action">
            <button type="button" className="sara-btn-ghost" onClick={onEdit}>
              {t('profile.dashboard.edit')}
            </button>
          </span>
        )}
      </div>
      {editMode ? (
        <textarea
          className="sara-inline-input sara-inline-textarea"
          value={displayBio}
          onChange={(e) => onUpdateDraftField?.('bio', e.target.value)}
          placeholder={t('profile.dashboard.aboutPlaceholder')}
          rows={4}
          aria-label={t('profile.dashboard.about')}
        />
      ) : (
        <p className={`sara-about-text ${isPlaceholder ? 'sara-about-text--placeholder' : ''}`}>
          {displayBio}
        </p>
      )}
    </section>
  );
}
