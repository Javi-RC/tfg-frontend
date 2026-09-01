import React from 'react';
import { useTranslation } from 'react-i18next';
import { UserRound, Building2, Users, MapPin, Clock } from 'lucide-react';

export default function PersonalInfoCard({
  organization,
  department,
  country,
  timezone,
  editMode,
  draft,
  onUpdateDraftField,
  onEdit,
}) {
  const { t } = useTranslation();
  const dash = (v) => (typeof v === 'string' && v.trim() ? v : t('profile.notSpecified'));

  const rows = [
    { icon: Building2, label: t('profile.dashboard.company'), value: dash(organization) },
    { icon: Users, label: t('profile.dashboard.department'), value: dash(department) },
  ];

  return (
    <section className="sara-card sara-card-pad">
      <div className="sara-card-head">
        <span className="sara-card-head-icon"><UserRound size={19} aria-hidden="true" /></span>
        <span className="sara-card-title">{t('profile.personalInfo')}</span>
      </div>

      <div className="sara-info-list">
        {rows.map((row) => {
          const Icon = row.icon;
          return (
            <div key={row.label} className="sara-info-row">
              <span className="sara-info-icon"><Icon size={18} aria-hidden="true" /></span>
              <div>
                <div className="sara-info-label">{row.label}</div>
                <div className="sara-info-value">{row.value}</div>
              </div>
            </div>
          );
        })}

        <div className="sara-info-row">
          <span className="sara-info-icon"><MapPin size={18} aria-hidden="true" /></span>
          <div style={{ flex: 1 }}>
            <div className="sara-info-label">{t('profile.location')}</div>
            {editMode ? (
              <input
                type="text"
                className="sara-inline-input sara-inline-input--value"
                value={draft?.country || ''}
                onChange={(e) => onUpdateDraftField?.('country', e.target.value)}
                placeholder={t('profile.preferencesSection.fields.country.placeholder')}
                aria-label={t('profile.country')}
              />
            ) : (
              <div className="sara-info-value">{dash(country)}</div>
            )}
          </div>
        </div>

        <div className="sara-info-row">
          <span className="sara-info-icon"><Clock size={18} aria-hidden="true" /></span>
          <div style={{ flex: 1 }}>
            <div className="sara-info-label">{t('profile.timezone')}</div>
            {editMode ? (
              <input
                type="text"
                className="sara-inline-input sara-inline-input--value"
                value={draft?.timezone || ''}
                onChange={(e) => onUpdateDraftField?.('timezone', e.target.value)}
                placeholder={t('profile.preferencesSection.fields.timezone.placeholder')}
                aria-label={t('profile.timezone')}
              />
            ) : (
              <div className="sara-info-value">{dash(timezone)}</div>
            )}
          </div>
        </div>
      </div>

      {!editMode && (
        <button type="button" className="sara-btn-ghost" style={{ marginTop: '20px' }} onClick={onEdit}>
          {t('profile.dashboard.editInfo')}
        </button>
      )}
    </section>
  );
}
