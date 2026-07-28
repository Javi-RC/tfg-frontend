import React from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, Clock, Bell, Mail, MonitorSmartphone, Users, Check } from 'lucide-react';

/**
 * PreferencesCard
 * Read-only view of work preferences: flexible schedule, preferred hours
 * and notification channels. Teams channel is a placeholder.
 */
export default function PreferencesCard({
  flexibleSchedule,
  workingHours,
  notifications,
}) {
  const { t } = useTranslation();
  const dash = (v) => (typeof v === 'string' && v.trim() ? v : '—');

  const hasHours = workingHours?.start || workingHours?.end;
  const hoursText = hasHours
    ? `${dash(workingHours?.start)} - ${dash(workingHours?.end)}`
    : t('profile.notSpecified');

  const channels = [
    { key: 'email', icon: Mail, label: t('profile.dashboard.channels.email'), on: Boolean(notifications?.email) },
    { key: 'inApp', icon: MonitorSmartphone, label: t('profile.dashboard.channels.app'), on: Boolean(notifications?.inApp) },
    { key: 'teams', icon: Users, label: t('profile.dashboard.channels.teams'), on: false },
  ];

  return (
    <section className="sara-card sara-card-pad">
      <div className="sara-card-head">
        <span className="sara-card-head-icon"><Settings size={19} aria-hidden="true" /></span>
        <span className="sara-card-title">{t('profile.preferences')}</span>
      </div>

      <div className="sara-pref-row">
        <span className="sara-pref-icon"><Clock size={18} aria-hidden="true" /></span>
        <div className="sara-pref-texts">
          <div className="sara-pref-title">
            {t('profile.preferencesSection.labels.flexibleSchedule')}
          </div>
          <div className="sara-pref-sub">{t('profile.dashboard.flexibleScheduleHint')}</div>
        </div>
        <span
          className={`sara-toggle ${flexibleSchedule ? 'on' : ''}`}
          role="img"
          aria-label={
            flexibleSchedule ? t('common.yes') : t('common.no')
          }
        />
      </div>

      <div className="sara-divider" />

      <div className="sara-pref-row">
        <span className="sara-pref-icon"><Clock size={18} aria-hidden="true" /></span>
        <div className="sara-pref-texts">
          <div className="sara-pref-title">
            {t('profile.preferencesSection.labels.preferredWorkingHours')}
          </div>
          <div className="sara-pref-sub">{hoursText}</div>
        </div>
      </div>

      <div className="sara-divider" />

      <div className="sara-pref-row">
        <span className="sara-pref-icon"><Bell size={18} aria-hidden="true" /></span>
        <div className="sara-pref-texts">
          <div className="sara-pref-title">
            {t('profile.preferencesSection.labels.notifications')}
          </div>
          <div className="sara-pref-sub">{t('profile.dashboard.notificationsHint')}</div>
        </div>
      </div>

      <div className="sara-chips">
        {channels.map((ch) => {
          const Icon = ch.icon;
          return (
            <span key={ch.key} className={`sara-chip ${ch.on ? '' : 'off'}`}>
              <Icon size={15} aria-hidden="true" />
              {ch.label}
              <span className="sara-chip-check">
                <Check size={14} aria-hidden="true" />
              </span>
            </span>
          );
        })}
      </div>
    </section>
  );
}
