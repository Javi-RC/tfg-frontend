import React from 'react';
import { useTranslation } from 'react-i18next';
import { UserRound, Building2, Users, MapPin, Clock } from 'lucide-react';

/**
 * PersonalInfoCard
 * Read-only view of company / department / location / timezone.
 * Department is a placeholder until the backend exposes it.
 */
export default function PersonalInfoCard({
  organization,
  department,
  country,
  timezone,
  onEdit,
}) {
  const { t } = useTranslation();
  const dash = (v) => (typeof v === 'string' && v.trim() ? v : t('profile.notSpecified'));

  const rows = [
    { icon: Building2, label: t('profile.dashboard.company'), value: dash(organization) },
    { icon: Users, label: t('profile.dashboard.department'), value: dash(department) },
    { icon: MapPin, label: t('profile.location'), value: dash(country) },
    { icon: Clock, label: t('profile.timezone'), value: dash(timezone) },
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
      </div>

      <button type="button" className="sara-btn-ghost" style={{ marginTop: '20px' }} onClick={onEdit}>
        {t('profile.dashboard.editInfo')}
      </button>
    </section>
  );
}
