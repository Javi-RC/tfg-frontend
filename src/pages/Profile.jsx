import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CVConsentModal from '../components/cv/CVConsentModal';
import PersonalityConsentModal from '../components/personality/PersonalityConsentModal';
import { useProfile } from '../hooks/useProfile';
import { useProfileDashboard } from '../hooks/useProfileDashboard';
import { computeProfileCompletion } from '../utils/profileCompletion';
import ProfileHero from '../components/profile/dashboard/ProfileHero';
import StatsRow from '../components/profile/dashboard/StatsRow';
import PersonalInfoCard from '../components/profile/dashboard/PersonalInfoCard';
import PreferencesCard from '../components/profile/dashboard/PreferencesCard';
import CompetenciasCard from '../components/profile/dashboard/CompetenciasCard';
import AboutCard from '../components/profile/dashboard/AboutCard';
import RecentActivityCard from '../components/profile/dashboard/RecentActivityCard';
import ConsentSection from '../components/profile/ConsentSection';
import PersonalityConsentSection from '../components/profile/PersonalityConsentSection';
import CVManagementSection from '../components/profile/CVManagementSection';
import DangerZone from '../components/account/DangerZone';
import '../components/profile/dashboard/ProfileDashboard.css';

export default function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    authUser,
    profile,
    profileUser,
    loading,
    editMode,
    saving,
    saveError,
    saveSuccess,
    draft,
    consentLoading,
    consentError,
    consentSuccess,
    consentData,
    hasConsent,
    showConsentModal,
    resolvedOrganizationName,
    resolvingOrganization,
    startEditing,
    cancelEditing,
    updateDraftField,
    updateNestedField,
    saveProfile,
    openConsentModal,
    closeConsentModal,
    handleConsentAccepted,
    revokeConsent,
    navigateToCV,
    navigateToUploadCV,
    navigateToCVStats,
    navigateToAdminCVs,
    loadConsent,
    personalityConsentLoading,
    personalityConsentError,
    personalityConsentSuccess,
    personalityConsentData,
    hasPersonalityConsent,
    showPersonalityConsentModal,
    loadPersonalityConsent,
    openPersonalityConsentModal,
    closePersonalityConsentModal,
    handlePersonalityConsentAccepted,
    revokePersonalityConsent,
  } = useProfile();

  const role = profileUser?.role || authUser?.role;
  const isAdmin = role === 'org_admin';

  const displayName =
    profileUser?.name || profileUser?.username || authUser?.name || authUser?.username || t('common.user');
  const firstName = (displayName || '').trim().split(' ')[0] || displayName;
  const email = profileUser?.email || authUser?.email;
  const userInitial = (displayName || 'U').trim().charAt(0).toUpperCase();

  const completion = useMemo(() => computeProfileCompletion(profileUser), [profileUser]);

  const { stats, skills, activity } = useProfileDashboard({ profileUser });

  const organizationDisplay = useMemo(() => {
    if (resolvingOrganization) return t('profile.loading');
    return resolvedOrganizationName || '';
  }, [resolvedOrganizationName, resolvingOrganization, t]);

  // Real where available, placeholder otherwise.
  const jobTitle = profileUser?.jobTitle || t('profile.dashboard.defaultJobTitle');
  const department = profileUser?.department || t('profile.dashboard.defaultDepartment');
  const bio = profileUser?.bio || profileUser?.about || '';

  if (loading) {
    return (
      <div className="sara-profile" style={{ display: 'flex', justifyContent: 'center' }}>
        <p style={{ fontSize: '16px', color: 'var(--sara-text-muted)' }}>
          {t('profile.loadingProfile')}
        </p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="sara-profile" style={{ display: 'flex', justifyContent: 'center' }}>
        <p style={{ fontSize: '16px', color: 'var(--sara-text-muted)' }}>
          {t('profile.noProfileFound')}
        </p>
      </div>
    );
  }

  return (
    <div className="sara-profile">
      <ProfileHero
        displayName={firstName}
        jobTitle={jobTitle}
        email={email}
        country={profileUser?.country}
        timezone={profileUser?.timezone}
        isAdmin={isAdmin}
        userInitial={userInitial}
        avatar={profileUser?.avatar}
        completion={completion}
        editMode={editMode}
        saving={saving}
        onStartEditing={startEditing}
        onCancelEditing={cancelEditing}
        onSaveProfile={saveProfile}
      />

      <StatsRow stats={stats.filter(s => s.key === 'projects' || s.key === 'teams')} onNavigate={(path) => path && navigate(path)} />

      {saveError && (
        <div className="sara-alert error" role="alert" aria-live="assertive" style={{ marginBottom: 20 }}>
          {saveError}
        </div>
      )}

      {saveSuccess && (
        <div className="sara-alert success" role="status" aria-live="polite" style={{ marginBottom: 20 }}>
          {saveSuccess}
        </div>
      )}

      <div className="sara-cards-grid">
        <PersonalInfoCard
          organization={organizationDisplay}
          department={department}
          country={profileUser?.country}
          timezone={profileUser?.timezone}
          editMode={editMode}
          draft={draft}
          onUpdateDraftField={updateDraftField}
          onEdit={startEditing}
        />

        <PreferencesCard
          flexibleSchedule={Boolean(profileUser?.flexibleSchedule)}
          workingHours={profileUser?.preferredWorkingHours}
          notifications={profileUser?.notificationPreferences}
          editMode={editMode}
          draft={draft}
          onUpdateDraftField={updateDraftField}
          onUpdateNestedField={updateNestedField}
        />

        <CompetenciasCard skills={skills} onSeeAll={navigateToCV} />

        <AboutCard
          bio={bio}
          editMode={editMode}
          draft={draft}
          onUpdateDraftField={updateDraftField}
          onEdit={startEditing}
        />

        <RecentActivityCard items={activity} />
      </div>

      {/* Functional sections, restyled as dashboard cards. */}
      <div className="sara-cards-grid">
        <ConsentSection
          consentLoading={consentLoading}
          consentError={consentError}
          consentSuccess={consentSuccess}
          hasConsent={hasConsent}
          consentData={consentData}
          onLoadConsent={loadConsent}
          onOpenConsentModal={openConsentModal}
          onRevokeConsent={revokeConsent}
        />

        <PersonalityConsentSection
          loading={personalityConsentLoading}
          error={personalityConsentError}
          success={personalityConsentSuccess}
          hasConsent={hasPersonalityConsent}
          consentData={personalityConsentData}
          onRefresh={loadPersonalityConsent}
          onOpenConsentModal={openPersonalityConsentModal}
          onRevokeConsent={revokePersonalityConsent}
        />

        <CVManagementSection
          isAdmin={isAdmin}
          onNavigateToCV={navigateToCV}
          onNavigateToUploadCV={navigateToUploadCV}
          onNavigateToCVStats={navigateToCVStats}
          onNavigateToAdminCVs={navigateToAdminCVs}
        />
      </div>

      <DangerZone />

      <CVConsentModal
        key={showConsentModal ? 'open' : 'closed'}
        show={showConsentModal}
        onClose={closeConsentModal}
        onAccepted={handleConsentAccepted}
      />

      <PersonalityConsentModal
        key={showPersonalityConsentModal ? 'open' : 'closed'}
        show={showPersonalityConsentModal}
        onClose={closePersonalityConsentModal}
        onAccepted={handlePersonalityConsentAccepted}
      />
    </div>
  );
}
