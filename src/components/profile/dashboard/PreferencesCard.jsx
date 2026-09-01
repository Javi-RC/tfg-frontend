import React from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, Clock, Bell, Mail, MonitorSmartphone, Users, Check } from 'lucide-react';

export default function PreferencesCard({
  flexibleSchedule,
  workingHours,
  notifications,
  editMode,
  draft,
  onUpdateDraftField,
  onUpdateNestedField,
}) {
  const { t } = useTranslation();
  const dash = (v) => (typeof v === 'string' && v.trim() ? v : '—');

  const effectiveFlexible = editMode ? Boolean(draft?.flexibleSchedule) : Boolean(flexibleSchedule);
  const effectiveHours = editMode
    ? { start: draft?.preferredWorkingHours?.start || '', end: draft?.preferredWorkingHours?.end || '' }
    : workingHours || {};
  const effectiveNotifs = editMode
    ? { email: Boolean(draft?.notificationPreferences?.email), inApp: Boolean(draft?.notificationPreferences?.inApp) }
    : notifications || {};

  const hasHours = effectiveHours?.start || effectiveHours?.end;
  const hoursText = hasHours
    ? `${dash(effectiveHours?.start)} - ${dash(effectiveHours?.end)}`
    : t('profile.notSpecified');

  const channels = [
    { key: 'email', icon: Mail, label: t('profile.dashboard.channels.email'), on: Boolean(effectiveNotifs?.email) },
    { key: 'inApp', icon: MonitorSmartphone, label: t('profile.dashboard.channels.app'), on: Boolean(effectiveNotifs?.inApp) },
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
        {editMode ? (
          <label className="sara-inline-toggle-label">
            <input
              type="checkbox"
              className="sara-inline-toggle-input"
              checked={effectiveFlexible}
              onChange={(e) => onUpdateDraftField?.('flexibleSchedule', e.target.checked)}
              aria-label={t('profile.preferencesSection.aria.enableFlexibleSchedule')}
            />
            <span className={`sara-toggle ${effectiveFlexible ? 'on' : ''}`} />
          </label>
        ) : (
          <span
            className={`sara-toggle ${effectiveFlexible ? 'on' : ''}`}
            role="img"
            aria-label={effectiveFlexible ? t('common.yes') : t('common.no')}
          />
        )}
      </div>

      <div className="sara-divider" />

      <div className="sara-pref-row">
        <span className="sara-pref-icon"><Clock size={18} aria-hidden="true" /></span>
        <div className="sara-pref-texts">
          <div className="sara-pref-title">
            {t('profile.preferencesSection.labels.preferredWorkingHours')}
          </div>
          {editMode ? (
            <div className="sara-inline-hours-row">
              <input
                type="time"
                className="sara-inline-input sara-inline-input--time"
                value={effectiveHours?.start || ''}
                onChange={(e) => onUpdateNestedField?.('preferredWorkingHours', 'start', e.target.value)}
                aria-label={t('profile.preferencesSection.aria.preferredStartTime')}
              />
              <span className="sara-inline-hours-sep">—</span>
              <input
                type="time"
                className="sara-inline-input sara-inline-input--time"
                value={effectiveHours?.end || ''}
                onChange={(e) => onUpdateNestedField?.('preferredWorkingHours', 'end', e.target.value)}
                aria-label={t('profile.preferencesSection.aria.preferredEndTime')}
              />
            </div>
          ) : (
            <div className="sara-pref-sub">{hoursText}</div>
          )}
        </div>
      </div>

      <div className="sara-divider" />

      <div className="sara-pref-row">
        <span className="sara-pref-icon"><Bell size={18} aria-hidden="true" /></span>
        <div className="sara-pref-texts">
          <div className="sara-pref-title">
            {t('profile.preferencesSection.labels.notifications')}
          </div>
          {!editMode && (
            <div className="sara-pref-sub">{t('profile.dashboard.notificationsHint')}</div>
          )}
        </div>
      </div>

      {editMode ? (
        <div className="sara-inline-notif-grid">
          <label className="sara-inline-checkbox-label">
            <input
              type="checkbox"
              checked={Boolean(effectiveNotifs?.email)}
              onChange={(e) => onUpdateNestedField?.('notificationPreferences', 'email', e.target.checked)}
              aria-label={t('profile.preferencesSection.aria.emailNotifications')}
            />
            <Mail size={15} aria-hidden="true" />
            {t('profile.dashboard.channels.email')}
          </label>
          <label className="sara-inline-checkbox-label">
            <input
              type="checkbox"
              checked={Boolean(effectiveNotifs?.inApp)}
              onChange={(e) => onUpdateNestedField?.('notificationPreferences', 'inApp', e.target.checked)}
              aria-label={t('profile.preferencesSection.aria.inAppNotifications')}
            />
            <MonitorSmartphone size={15} aria-hidden="true" />
            {t('profile.dashboard.channels.app')}
          </label>
        </div>
      ) : (
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
      )}
    </section>
  );
}
