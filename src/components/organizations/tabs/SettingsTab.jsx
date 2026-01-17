import React, { useState } from 'react';
import PrimaryButton from '../../PrimaryButton';
import { updateOrganizationSettings } from '../../../api/organization';

/**
 * SettingsTab (Admin only)
 */
export default function SettingsTab({ organization, onUpdate, styles }) {
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
      alert('Settings updated successfully');
      if (onUpdate) onUpdate();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>Organization Settings</h2>

      <div style={styles.settingsGroup}>
        <label style={styles.settingItem}>
          <input
            type="checkbox"
            checked={settings.allowPublicSubmission}
            onChange={(e) => setSettings({ ...settings, allowPublicSubmission: e.target.checked })}
            style={styles.checkbox}
          />
          <div>
            <div style={styles.settingLabel}>Allow Public CV Submission</div>
            <div style={styles.settingDescription}>Allow anyone to submit their CV to this organization</div>
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
            <div style={styles.settingLabel}>Require Employee Approval</div>
            <div style={styles.settingDescription}>
              New employees need admin approval before becoming active
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
            <div style={styles.settingLabel}>Notify on CV Submission</div>
            <div style={styles.settingDescription}>Receive notifications when a new CV is submitted</div>
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
            <div style={styles.settingLabel}>Auto-process CVs with AI</div>
            <div style={styles.settingDescription}>Automatically analyze and categorize submitted CVs</div>
          </div>
        </label>
      </div>

      <div style={{ marginTop: '24px' }}>
        <PrimaryButton onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </PrimaryButton>
      </div>
    </div>
  );
}
