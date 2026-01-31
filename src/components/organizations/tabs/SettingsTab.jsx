import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PrimaryButton from '../../PrimaryButton';
import { updateOrganizationSettings } from '../../../api/organization';

/**
 * SettingsTab (Admin only)
 */
export default function SettingsTab({ organization, onUpdate, styles }) {
  const { t } = useTranslation();
  const [settings, setSettings] = useState({
    allowPublicSubmission: organization.settings?.allowPublicSubmission || false,
    requireApproval: organization.settings?.requireApproval || false,
    notifyOnCVSubmission: organization.settings?.notifyOnCVSubmission || true,
    autoProcessCVs: organization.settings?.autoProcessCVs || false
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateOrganizationSettings(organization._id, settings);
      alert(t('organization.settings.updateSuccess'));
      if (onUpdate) onUpdate();
    } catch (err) {
      alert(err.response?.data?.message || t('organization.settings.updateError'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>{t('organization.settings.title')}</h2>

      <div style={styles.settingsGroup}>
        <label style={styles.settingItem}>
          <input
            type="checkbox"
            checked={settings.allowPublicSubmission}
            onChange={(e) => setSettings({ ...settings, allowPublicSubmission: e.target.checked })}
            style={styles.checkbox}
          />
          <div>
            <div style={styles.settingLabel}>{t('organization.settings.allowPublicSubmission')}</div>
            <div style={styles.settingDescription}>{t('organization.settings.allowPublicSubmissionDesc')}</div>
          </div>
        </label>

        <label style={styles.settingItem}>
          <input
            type="checkbox"
            checked={settings.requireApproval}
            onChange={(e) => setSettings({ ...settings, requireApproval: e.target.checked })}
            style={styles.checkbox}
          />
          <div>
            <div style={styles.settingLabel}>{t('organization.settings.requireApproval')}</div>
            <div style={styles.settingDescription}>
              {t('organization.settings.requireApprovalDesc')}
            </div>
          </div>
        </label>

        <label style={styles.settingItem}>
          <input
            type="checkbox"
            checked={settings.notifyOnCVSubmission}
            onChange={(e) => setSettings({ ...settings, notifyOnCVSubmission: e.target.checked })}
            style={styles.checkbox}
          />
          <div>
            <div style={styles.settingLabel}>{t('organization.settings.notifyOnCVSubmission')}</div>
            <div style={styles.settingDescription}>{t('organization.settings.notifyOnCVSubmissionDesc')}</div>
          </div>
        </label>

        <label style={styles.settingItem}>
          <input
            type="checkbox"
            checked={settings.autoProcessCVs}
            onChange={(e) => setSettings({ ...settings, autoProcessCVs: e.target.checked })}
            style={styles.checkbox}
          />
          <div>
            <div style={styles.settingLabel}>{t('organization.settings.autoProcessCVs')}</div>
            <div style={styles.settingDescription}>{t('organization.settings.autoProcessCVsDesc')}</div>
          </div>
        </label>
      </div>

      <div style={{ marginTop: '24px' }}>
        <PrimaryButton onClick={handleSave} disabled={saving}>
          {saving ? t('organization.settings.saving') : t('organization.settings.saveSettings')}
        </PrimaryButton>
      </div>
    </div>
  );
}
