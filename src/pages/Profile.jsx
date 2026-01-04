import React, { useEffect, useMemo, useState, useContext } from 'react';
import { User, Mail, Shield, Building2, Globe, Clock, Bell } from 'lucide-react';
import { getProfile } from '../api/auth';
import { AuthContext } from '../contexts/AuthContext';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import Field from '../components/cv/Field';
import CVConsentModal from '../components/cv/CVConsentModal';
import { getCVConsent, updateCVConsent } from '../api/cvConsent';
import { getOrganizationById } from '../api/organization';

export default function Profile() {
  const { user: authUser, updateProfile } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(null);

  const [consentLoading, setConsentLoading] = useState(false);
  const [consentError, setConsentError] = useState(null);
  const [consentSuccess, setConsentSuccess] = useState(null);
  const [consentData, setConsentData] = useState(null);
  const [hasConsent, setHasConsent] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);

  const [resolvedOrganizationName, setResolvedOrganizationName] = useState(null);
  const [resolvingOrganization, setResolvingOrganization] = useState(false);
  const [draft, setDraft] = useState({
    name: '',
    country: '',
    timezone: '',
    flexibleSchedule: false,
    preferredWorkingHours: { start: '', end: '' },
    notificationPreferences: { email: true, inApp: true, push: false }
  });

  useEffect(() => {
    getProfile()
      .then(res => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const loadConsent = async () => {
    setConsentLoading(true);
    setConsentError(null);
    try {
      const res = await getCVConsent();
      setHasConsent(Boolean(res?.data?.hasConsent));
      setConsentData(res?.data?.consent || null);
    } catch (err) {
      setHasConsent(false);
      setConsentData(null);
      setConsentError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          'Could not load consent status.'
      );
    } finally {
      setConsentLoading(false);
    }
  };

  useEffect(() => {
    loadConsent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const profileUser = useMemo(() => {
    if (!profile) return null;
    return profile.user || profile;
  }, [profile]);

  const isLikelyObjectId = (value) =>
    typeof value === 'string' && /^[a-f\d]{24}$/i.test(value.trim());

  useEffect(() => {
    let mounted = true;

    const resolveOrganization = async () => {
      setResolvedOrganizationName(null);
      setResolvingOrganization(false);

      const orgValue = profileUser?.organization;

      if (!orgValue) return;

      if (typeof orgValue === 'object') {
        const name = orgValue?.name || orgValue?.title || orgValue?.organizationName;
        if (mounted) setResolvedOrganizationName(name || null);
        return;
      }

      if (!isLikelyObjectId(orgValue)) {
        // It's already a readable string.
        if (mounted) setResolvedOrganizationName(String(orgValue));
        return;
      }

      // Fetch by ID to display the actual organization name.
      setResolvingOrganization(true);
      try {
        const res = await getOrganizationById(orgValue);
        const org = (res?.data?.success && res?.data?.data) ? res.data.data : res?.data;
        const name = org?.name || org?.title || null;
        if (mounted) setResolvedOrganizationName(name);
      } catch {
        // If the endpoint isn't ready yet, don't show raw IDs to users.
        if (mounted) setResolvedOrganizationName(null);
      } finally {
        if (mounted) setResolvingOrganization(false);
      }
    };

    resolveOrganization();
    return () => {
      mounted = false;
    };
  }, [profileUser?.organization]);

  const buildDraftFromUser = (u) => {
    const preferredWorkingHours = u?.preferredWorkingHours || {};
    const notificationPreferences = u?.notificationPreferences || {};

    return {
      name: u?.name || u?.username || '',
      country: u?.country || '',
      timezone: u?.timezone || '',
      flexibleSchedule: Boolean(u?.flexibleSchedule),
      preferredWorkingHours: {
        start: preferredWorkingHours?.start || '',
        end: preferredWorkingHours?.end || ''
      },
      notificationPreferences: {
        email: notificationPreferences?.email ?? true,
        inApp: notificationPreferences?.inApp ?? true,
        push: notificationPreferences?.push ?? false
      }
    };
  };

  useEffect(() => {
    if (!profileUser) return;
    if (editMode) return;
    setDraft(buildDraftFromUser(profileUser));
  }, [profileUser, editMode]);

  const role = profileUser?.role || authUser?.role;
  const isAdmin = role === 'org_admin';

  const displayName = profileUser?.name || profileUser?.username || authUser?.name || authUser?.username || 'User';
  const email = profileUser?.email || authUser?.email;

  const formatBoolean = (value) => (value ? 'Yes' : 'No');
  const formatTime = (value) => (typeof value === 'string' && value.trim() ? value : '—');
  const formatText = (value) => (typeof value === 'string' && value.trim() ? value : '—');

  const formatDateTime = (value) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleString();
  };

  const userInitial = (displayName || 'U').trim().charAt(0).toUpperCase();

  const organizationDisplay = useMemo(() => {
    if (resolvingOrganization) return 'Loading…';
    return formatText(resolvedOrganizationName);
  }, [resolvedOrganizationName, resolvingOrganization]);

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const validateDraft = (data) => {
    const trimmedName = (data.name || '').trim();
    if (trimmedName.length < 2 || trimmedName.length > 50) {
      return 'Name must be between 2 and 50 characters.';
    }

    const tz = (data.timezone || '').trim();
    if (tz) {
      // Basic IANA-like validation (e.g. Europe/Madrid, Etc/GMT+1)
      const ianaLike = /^[A-Za-z0-9._+-]+(?:\/[A-Za-z0-9._+-]+)+$/;
      if (!ianaLike.test(tz)) {
        return 'Timezone must be a valid IANA value (e.g. Europe/Madrid).';
      }
    }

    const start = (data.preferredWorkingHours?.start || '').trim();
    const end = (data.preferredWorkingHours?.end || '').trim();
    const hhmm = /^([01]\d|2[0-3]):[0-5]\d$/;
    if ((start && !end) || (!start && end)) {
      return 'Preferred working hours must include both start and end.';
    }
    if (start && end) {
      if (!hhmm.test(start) || !hhmm.test(end)) {
        return 'Preferred working hours must be in HH:MM format.';
      }
    }

    return null;
  };

  const extractApiErrorMessage = (err) => {
    const data = err?.response?.data;
    if (!data) return 'Could not update profile. Please try again.';
    if (typeof data === 'string') return data;
    if (data.message) return data.message;
    if (data.error) return data.error;
    return 'Could not update profile. Please try again.';
  };

  const handleStartEdit = () => {
    setSaveError(null);
    setSaveSuccess(null);
    setDraft(buildDraftFromUser(profileUser));
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setSaveError(null);
    setSaveSuccess(null);
    setDraft(buildDraftFromUser(profileUser));
    setEditMode(false);
  };

  const handleSave = async () => {
    setSaveError(null);
    setSaveSuccess(null);

    const validationError = validateDraft(draft);
    if (validationError) {
      setSaveError(validationError);
      return;
    }

    const payload = {
      name: (draft.name || '').trim(),
      flexibleSchedule: Boolean(draft.flexibleSchedule),
      notificationPreferences: {
        email: Boolean(draft.notificationPreferences?.email),
        inApp: Boolean(draft.notificationPreferences?.inApp),
        push: Boolean(draft.notificationPreferences?.push)
      }
    };

    const country = (draft.country || '').trim();
    if (country) payload.country = country;

    const timezone = (draft.timezone || '').trim();
    if (timezone) payload.timezone = timezone;

    const start = (draft.preferredWorkingHours?.start || '').trim();
    const end = (draft.preferredWorkingHours?.end || '').trim();
    if (start && end) {
      payload.preferredWorkingHours = { start, end };
    }

    setSaving(true);
    try {
      await updateProfile(payload);
      const refreshed = await getProfile();
      setProfile(refreshed.data);
      setEditMode(false);
      setSaveSuccess('Profile updated successfully.');
    } catch (err) {
      setSaveError(extractApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#fafbfc',
        padding: '40px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p style={{ fontSize: '16px', color: '#666' }}>Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#fafbfc',
        padding: '40px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p style={{ fontSize: '16px', color: '#666' }}>Error loading profile</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fafbfc',
      padding: '104px 20px 40px',
      fontFamily: 'Poppins, Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial'
    }}>
      <CVConsentModal
        show={showConsentModal}
        onClose={() => setShowConsentModal(false)}
        onAccepted={() => {
          setShowConsentModal(false);
          setConsentSuccess('Consent saved. You can now upload CVs.');
          loadConsent();
        }}
      />

      <div style={{
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {/* Header Section */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '24px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'start'
          }}>
            <div style={{ display: 'flex', gap: '18px', alignItems: 'flex-start' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '999px',
                overflow: 'hidden',
                background: '#f0f4f8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #e2e8f0',
                flex: '0 0 auto'
              }} aria-label="User avatar">
                {profileUser?.avatar ? (
                  <img
                    src={profileUser.avatar}
                    alt="User avatar"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '26px',
                    fontWeight: '700',
                    color: '#4a5568'
                  }}>
                    {userInitial}
                  </div>
                )}
              </div>

              <div style={{ flex: 1 }}>
              <h1 style={{
                fontSize: '32px',
                fontWeight: '600',
                color: '#1a1a1a',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <User size={28} color="#666" />
                {displayName}
              </h1>
              <p style={{
                fontSize: '16px',
                color: '#666',
                marginBottom: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Mail size={16} color="#999" />
                {email || '—'}
              </p>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 16px',
                background: isAdmin ? '#e8f4f8' : '#f0f0f0',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500',
                color: isAdmin ? '#0066cc' : '#666',
                marginTop: '8px'
              }}>
                <Shield size={14} />
                {role || '—'}
              </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              justifyContent: 'flex-end'
            }}>
              {!editMode ? (
                <SecondaryButton onClick={handleStartEdit} style={{ padding: '12px 18px' }}>
                  Edit profile
                </SecondaryButton>
              ) : (
                <>
                  <SecondaryButton onClick={handleCancelEdit} disabled={saving} style={{ padding: '12px 18px' }}>
                    Cancel
                  </SecondaryButton>
                  <PrimaryButton onClick={handleSave} disabled={saving} style={{ padding: '14px 22px' }}>
                    {saving ? 'Saving...' : 'Save changes'}
                  </PrimaryButton>
                </>
              )}
            </div>
          </div>

          <div style={{
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid #f0f0f0',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px'
          }}>
            <div>
              <div style={labelStyle}>Organization</div>
              <p style={{ fontSize: '15px', color: '#2d3748', lineHeight: '1.6', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={16} color="#999" />
                {organizationDisplay}
              </p>
            </div>

            <div>
              <div style={labelStyle}>Location</div>
              <p style={{ fontSize: '15px', color: '#2d3748', lineHeight: '1.6', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe size={16} color="#999" />
                {formatText(profileUser?.country)}
              </p>
            </div>

            <div>
              <div style={labelStyle}>Timezone</div>
              <p style={{ fontSize: '15px', color: '#2d3748', lineHeight: '1.6', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} color="#999" />
                {formatText(profileUser?.timezone)}
              </p>
            </div>
          </div>
        </div>

        {/* Privacy & Consent Section */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '24px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '16px'
          }}>
            Privacy & Consent
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#666',
            marginBottom: '20px'
          }}>
            Manage your consent for AI processing of your CV
          </p>

          {consentError && (
            <div style={{
              padding: '12px 16px',
              background: '#fee',
              border: '1px solid #fcc',
              borderRadius: '8px',
              color: '#c0392b',
              fontSize: '14px',
              marginBottom: '16px'
            }} role="alert" aria-live="assertive">
              {consentError}
            </div>
          )}

          {consentSuccess && (
            <div style={{
              padding: '12px 16px',
              background: '#D1FAE5',
              border: '1px solid #10B981',
              borderRadius: '8px',
              color: '#065f46',
              fontSize: '14px',
              marginBottom: '16px'
            }} role="status" aria-live="polite">
              {consentSuccess}
            </div>
          )}

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
            marginBottom: '16px'
          }}>
            <div>
              <div style={labelStyle}>CV AI Processing Consent</div>
              <p style={{ fontSize: '15px', color: hasConsent ? '#065f46' : '#9a3412', lineHeight: '1.6' }}>
                {consentLoading ? 'Loading…' : hasConsent ? 'Accepted' : 'Not accepted'}
              </p>
            </div>

            <div>
              <div style={labelStyle}>Accepted At</div>
              <p style={{ fontSize: '15px', color: '#2d3748', lineHeight: '1.6' }}>
                {formatDateTime(consentData?.acceptedAt)}
              </p>
            </div>

            <div>
              <div style={labelStyle}>Terms Version</div>
              <p style={{ fontSize: '15px', color: '#2d3748', lineHeight: '1.6' }}>
                {formatText(consentData?.version)}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <SecondaryButton
              onClick={() => loadConsent()}
              disabled={consentLoading}
            >
              Refresh
            </SecondaryButton>

            {!hasConsent ? (
              <PrimaryButton
                onClick={() => {
                  setConsentError(null);
                  setConsentSuccess(null);
                  setShowConsentModal(true);
                }}
                disabled={consentLoading}
              >
                Review and accept
              </PrimaryButton>
            ) : (
              <SecondaryButton
                onClick={async () => {
                  const confirmed = window.confirm(
                    'Revoke consent? You will not be able to upload CVs until you accept again.'
                  );
                  if (!confirmed) return;

                  setConsentError(null);
                  setConsentSuccess(null);
                  setConsentLoading(true);
                  try {
                    const res = await updateCVConsent({ accepted: false });
                    setHasConsent(Boolean(res?.data?.hasConsent));
                    setConsentData(res?.data?.consent || null);
                    setConsentSuccess(
                      res?.data?.message ||
                        'Consent revoked. You cannot upload CVs until you accept again.'
                    );
                  } catch (err) {
                    setConsentError(
                      err?.response?.data?.error ||
                        err?.response?.data?.message ||
                        'Could not revoke consent.'
                    );
                  } finally {
                    setConsentLoading(false);
                  }
                }}
                disabled={consentLoading}
              >
                Revoke consent
              </SecondaryButton>
            )}
          </div>
        </div>

        {/* Preferences Section */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '24px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '16px'
          }}>
            Preferences
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#666',
            marginBottom: '20px'
          }}>
            Your work schedule and notification settings
          </p>

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
                <div style={labelStyle}>Flexible Schedule</div>
                <p style={{ fontSize: '15px', color: '#2d3748', lineHeight: '1.6' }}>
                  {formatBoolean(Boolean(profileUser?.flexibleSchedule))}
                </p>
              </div>

              <div>
                <div style={labelStyle}>Preferred Working Hours</div>
                <p style={{ fontSize: '15px', color: '#2d3748', lineHeight: '1.6' }}>
                  {formatTime(profileUser?.preferredWorkingHours?.start)}
                  <span style={{ color: '#a0aec0' }}>→</span>
                  {' '}{formatTime(profileUser?.preferredWorkingHours?.end)}
                </p>
              </div>

              <div>
                <div style={labelStyle}>Notifications</div>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', color: '#2d3748' }}>
                    <Bell size={16} color="#999" />
                    Email: {formatBoolean(Boolean(profileUser?.notificationPreferences?.email))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', color: '#2d3748' }}>
                    <Bell size={16} color="#999" />
                    In-app: {formatBoolean(Boolean(profileUser?.notificationPreferences?.inApp))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', color: '#2d3748' }}>
                    <Bell size={16} color="#999" />
                    Push: {formatBoolean(Boolean(profileUser?.notificationPreferences?.push))}
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
                label="Name"
                required
                value={draft.name}
                onChange={(value) => setDraft((prev) => ({ ...prev, name: value }))}
                placeholder="Your name"
              />

              <Field
                editable
                label="Country"
                value={draft.country}
                onChange={(value) => setDraft((prev) => ({ ...prev, country: value }))}
                placeholder="Country"
              />

              <Field
                editable
                label="Timezone"
                value={draft.timezone}
                onChange={(value) => setDraft((prev) => ({ ...prev, timezone: value }))}
                placeholder="Europe/Madrid"
              />

              <div>
                <div style={labelStyle}>Flexible Schedule</div>
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
                    onChange={(e) => setDraft((prev) => ({ ...prev, flexibleSchedule: e.target.checked }))}
                  />
                  Enable flexible schedule
                </label>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <div style={labelStyle}>Preferred Working Hours</div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '12px'
                }}>
                  <Field
                    editable
                    label="Start"
                    type="time"
                    value={draft.preferredWorkingHours.start}
                    onChange={(value) => setDraft((prev) => ({
                      ...prev,
                      preferredWorkingHours: { ...prev.preferredWorkingHours, start: value }
                    }))}
                    placeholder="09:00"
                  />
                  <Field
                    editable
                    label="End"
                    type="time"
                    value={draft.preferredWorkingHours.end}
                    onChange={(value) => setDraft((prev) => ({
                      ...prev,
                      preferredWorkingHours: { ...prev.preferredWorkingHours, end: value }
                    }))}
                    placeholder="18:00"
                  />
                </div>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <div style={labelStyle}>Notification Preferences</div>
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
                      onChange={(e) => setDraft((prev) => ({
                        ...prev,
                        notificationPreferences: { ...prev.notificationPreferences, email: e.target.checked }
                      }))}
                    />
                    Email notifications
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
                      onChange={(e) => setDraft((prev) => ({
                        ...prev,
                        notificationPreferences: { ...prev.notificationPreferences, inApp: e.target.checked }
                      }))}
                    />
                    In-app notifications
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
                      checked={Boolean(draft.notificationPreferences.push)}
                      onChange={(e) => setDraft((prev) => ({
                        ...prev,
                        notificationPreferences: { ...prev.notificationPreferences, push: e.target.checked }
                      }))}
                    />
                    Push notifications
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CV Management Section */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '24px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '16px'
          }}>
            CV Management
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#666',
            marginBottom: '20px'
          }}>
            Manage your curriculum vitae and view statistics
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px'
          }}>
            <PrimaryButton
              onClick={() => window.location.href = '/my-cv'}
              style={{ width: '100%' }}
            >
              My CV
            </PrimaryButton>
            <SecondaryButton
              onClick={() => window.location.href = '/cv-stats'}
              style={{ width: '100%' }}
            >
              View Statistics
            </SecondaryButton>
          </div>
        </div>

        {/* Admin Section */}
        {isAdmin && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            border: '2px solid #e8f4f8'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1a1a1a',
              marginBottom: '16px'
            }}>
              Admin Panel
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '20px'
            }}>
              Access administrative features and manage all CVs
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px'
            }}>
              <PrimaryButton
                onClick={() => window.location.href = '/admin/cvs'}
                style={{
                  width: '100%',
                  background: '#0066cc'
                }}
              >
                View All CVs
              </PrimaryButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
