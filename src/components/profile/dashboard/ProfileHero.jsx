import React from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, MapPin, ShieldCheck, Pencil } from 'lucide-react';
import heroIllustration from '../../../assets/profile-hero.png';

/**
 * ProfileHero
 * Welcome banner: avatar, name, job title, contact meta, role badge,
 * profile-completion bar and edit/save actions.
 */
export default function ProfileHero({
  displayName,
  jobTitle,
  email,
  country,
  timezone,
  isAdmin,
  userInitial,
  avatar,
  completion,
  editMode,
  saving,
  onStartEditing,
  onCancelEditing,
  onSaveProfile,
}) {
  const { t } = useTranslation();
  const metaText = [country, timezone].filter(Boolean).join(' · ');

  return (
    <section className="sara-card sara-hero">
      <div className="sara-hero-actions">
        {!editMode ? (
          <button type="button" className="sara-btn-outline" onClick={onStartEditing}>
            <Pencil size={15} aria-hidden="true" />
            {t('profile.editProfile')}
          </button>
        ) : (
          <>
            <button
              type="button"
              className="sara-btn-outline"
              onClick={onCancelEditing}
              disabled={saving}
            >
              {t('common.cancel')}
            </button>
            <button
              type="button"
              className="sara-btn-primary"
              onClick={onSaveProfile}
              disabled={saving}
            >
              {saving ? t('profile.saving') : t('profile.saveChanges')}
            </button>
          </>
        )}
      </div>

      <div className="sara-hero-body">
        <div className="sara-hero-avatar-wrap">
          <div className="sara-hero-avatar" aria-label={t('profile.aria.avatar')}>
            {avatar ? (
              <img
                src={avatar}
                alt={t('common.userAvatar')}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <span className="sara-hero-avatar-initial">{userInitial}</span>
            )}
          </div>
          {!editMode && (
            <button
              type="button"
              className="sara-hero-avatar-edit"
              onClick={onStartEditing}
              aria-label={t('profile.editProfile')}
            >
              <Pencil size={15} aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="sara-hero-info">
          <h1 className="sara-hero-name">
            {t('profile.dashboard.greeting', { name: displayName })}
          </h1>
          <p className="sara-hero-role">{jobTitle}</p>

          <div className="sara-hero-meta-row">
            <Mail size={15} aria-hidden="true" />
            <span>{email || '—'}</span>
          </div>
          {metaText && (
            <div className="sara-hero-meta-row">
              <MapPin size={15} aria-hidden="true" />
              <span>{metaText}</span>
            </div>
          )}

          <span className={`sara-hero-badge ${isAdmin ? 'admin' : 'employee'}`}>
            <ShieldCheck size={13} aria-hidden="true" />
            {isAdmin ? t('profile.organizationAdmin') : t('profile.employee')}
          </span>

          <div className="sara-hero-progress-wrap">
            <div className="sara-hero-progress-row">
              <div className="sara-hero-progress-track">
                <div
                  className="sara-hero-progress-fill"
                  style={{ width: `${completion}%` }}
                  role="progressbar"
                  aria-valuenow={completion}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={t('profile.profileCompletion')}
                />
              </div>
              <span className="sara-hero-progress-pct">{completion}%</span>
            </div>
            <p className="sara-hero-progress-hint">{t('profile.dashboard.completionHint')}</p>
          </div>
        </div>
      </div>

      <img
        src={heroIllustration}
        alt=""
        aria-hidden="true"
        className="sara-hero-illustration"
      />
    </section>
  );
}
