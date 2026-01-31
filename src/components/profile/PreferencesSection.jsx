import React from 'react';
import { useTranslation } from 'react-i18next';
import { Bell } from 'lucide-react';
import Field from '../cv/Field';

/**
 * PreferencesSection Component
 * Displays and edits user preferences (schedule, notifications)
 */
export default function PreferencesSection({
  profileUser,
  editMode,
  draft,
  saveError,
  saveSuccess,
  onUpdateDraftField,
  onUpdateNestedField
}) {
  const { t } = useTranslation();

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const formatBoolean = (value) => (value ? t('common.yes') : t('common.no'));
  const formatTime = (value) => (typeof value === 'string' && value.trim() ? value : '—');

  return (
    <div style={{
      padding: '32px 40px',
      borderBottom: '1px solid #e2e8f0'
    }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '700',
          color: '#1a202c',
          marginBottom: '8px'
        }}>
          {t('profile.preferences')}
        </h2>
        <p style={{
          fontSize: '14px',
          color: '#718096',
          lineHeight: '1.6'
        }}>
          {t('profile.preferencesSection.description')}
        </p>
      </div>

      {saveError && (
        <div style={{
          padding: '16px 20px',
          background: '#fee',
          border: '1px solid #fcc',
          borderRadius: '8px',
          color: '#c0392b',
          fontSize: '14px',
          marginBottom: '20px',
          lineHeight: '1.6'
        }} role="alert" aria-live="assertive">
          {saveError}
        </div>
      )}

      {saveSuccess && (
        <div style={{
          display: 'flex',
          gap: '12px',
          padding: '16px',
          backgroundColor: '#D1FAE5',
          border: '1px solid #10B981',
          borderRadius: '8px',
          marginBottom: '20px',
          color: '#065f46',
          fontSize: '14px',
          lineHeight: '1.6'
        }} role="status" aria-live="polite">
          {saveSuccess}
        </div>
      )}

      {!editMode ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px'
        }}>
          <div>
            <div style={labelStyle}>{t('profile.preferencesSection.labels.flexibleSchedule')}</div>
            <p style={{ fontSize: '15px', color: '#2d3748', lineHeight: '1.6' }}>
              {formatBoolean(Boolean(profileUser?.flexibleSchedule))}
            </p>
          </div>

          <div>
            <div style={labelStyle}>{t('profile.preferencesSection.labels.preferredWorkingHours')}</div>
            <p style={{ fontSize: '15px', color: '#2d3748', lineHeight: '1.6' }}>
              {formatTime(profileUser?.preferredWorkingHours?.start)}
              <span style={{ color: '#a0aec0' }}>→</span>
              {' '}{formatTime(profileUser?.preferredWorkingHours?.end)}
            </p>
          </div>

          <div>
            <div style={labelStyle}>{t('profile.preferencesSection.labels.notifications')}</div>
            <div style={{ display: 'grid', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', color: '#2d3748' }}>
                <Bell size={16} color="#999" />
                {t('profile.preferencesSection.labels.email')}: {formatBoolean(Boolean(profileUser?.notificationPreferences?.email))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', color: '#2d3748' }}>
                <Bell size={16} color="#999" />
                {t('profile.preferencesSection.labels.inApp')}: {formatBoolean(Boolean(profileUser?.notificationPreferences?.inApp))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px'
        }}>
          <Field
            editable
            label={t('profile.name')}
            required
            value={draft.name}
            onChange={(value) => onUpdateDraftField('name', value)}
            placeholder={t('profile.preferencesSection.fields.name.placeholder')}
            aria-label={t('profile.name')}
          />

          <Field
            editable
            label={t('profile.country')}
            value={draft.country}
            onChange={(value) => onUpdateDraftField('country', value)}
            placeholder={t('profile.preferencesSection.fields.country.placeholder')}
            aria-label={t('profile.country')}
          />

          <Field
            editable
            label={t('profile.timezone')}
            value={draft.timezone}
            onChange={(value) => onUpdateDraftField('timezone', value)}
            placeholder={t('profile.preferencesSection.fields.timezone.placeholder')}
            aria-label={t('profile.timezone')}
          />

          <div>
            <div style={labelStyle}>{t('profile.preferencesSection.labels.flexibleSchedule')}</div>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '15px',
              color: '#2d3748',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={Boolean(draft.flexibleSchedule)}
                onChange={(e) => onUpdateDraftField('flexibleSchedule', e.target.checked)}
                aria-label={t('profile.preferencesSection.aria.enableFlexibleSchedule')}
              />
              {t('profile.preferencesSection.enableFlexibleSchedule')}
            </label>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <div style={labelStyle}>{t('profile.preferencesSection.labels.preferredWorkingHours')}</div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px'
            }}>
              <Field
                editable
                label={t('profile.preferencesSection.fields.preferredWorkingHours.start.label')}
                type="time"
                value={draft.preferredWorkingHours.start}
                onChange={(value) => onUpdateNestedField('preferredWorkingHours', 'start', value)}
                placeholder={t('profile.preferencesSection.fields.preferredWorkingHours.start.placeholder')}
                aria-label={t('profile.preferencesSection.aria.preferredStartTime')}
              />
              <Field
                editable
                label={t('profile.preferencesSection.fields.preferredWorkingHours.end.label')}
                type="time"
                value={draft.preferredWorkingHours.end}
                onChange={(value) => onUpdateNestedField('preferredWorkingHours', 'end', value)}
                placeholder={t('profile.preferencesSection.fields.preferredWorkingHours.end.placeholder')}
                aria-label={t('profile.preferencesSection.aria.preferredEndTime')}
              />
            </div>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <div style={labelStyle}>{t('profile.preferencesSection.labels.notificationPreferences')}</div>
            <div style={{ display: 'grid', gap: '10px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '15px',
                color: '#2d3748',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={Boolean(draft.notificationPreferences.email)}
                  onChange={(e) => onUpdateNestedField('notificationPreferences', 'email', e.target.checked)}
                  aria-label={t('profile.preferencesSection.aria.emailNotifications')}
                />
                {t('profile.preferencesSection.emailNotifications')}
              </label>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '15px',
                color: '#2d3748',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={Boolean(draft.notificationPreferences.inApp)}
                  onChange={(e) => onUpdateNestedField('notificationPreferences', 'inApp', e.target.checked)}
                  aria-label={t('profile.preferencesSection.aria.inAppNotifications')}
                />
                {t('profile.preferencesSection.inAppNotifications')}
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
