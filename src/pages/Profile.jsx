import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import CVConsentModal from '../components/cv/CVConsentModal';
import PersonalityConsentModal from '../components/personality/PersonalityConsentModal';
import { useProfile } from '../hooks/useProfile';
import { 
  ProfileHeader, 
  ConsentSection, 
  PersonalityConsentSection,
  PreferencesSection, 
  CVManagementSection 
} from '../components/profile';
import { DangerZone } from '../components/account';

export default function Profile() {
  const { t } = useTranslation();
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
    navigateToCVStats,
    navigateToAdminCVs,
    loadConsent,
    // Personality consent
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
    revokePersonalityConsent
  } = useProfile();

  const role = profileUser?.role || authUser?.role;
  const isAdmin = role === 'org_admin';

  const displayName = profileUser?.name || profileUser?.username || authUser?.name || authUser?.username || 'User';
  const email = profileUser?.email || authUser?.email;
  const userInitial = (displayName || 'U').trim().charAt(0).toUpperCase();

  const formatText = (value) => (typeof value === 'string' && value.trim() ? value : t('profile.notSpecified'));

  const organizationDisplay = useMemo(() => {
    if (resolvingOrganization) return t('profile.loading');
    return formatText(resolvedOrganizationName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedOrganizationName, resolvingOrganization, t]);

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
      <p style={{ fontSize: '16px', color: '#666' }}>{t('profile.loadingProfile')}</p>
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
        <p style={{ fontSize: '16px', color: '#666' }}>{t('profile.noProfileFound')}</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #f7fafc 0%, #edf2f7 100%)',
      padding: '104px 20px 60px',
      fontFamily: 'Poppins, Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial'
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        {/* Contenedor unificado */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
          overflow: 'hidden'
        }}>
          <ProfileHeader
            displayName={displayName}
            email={email}
            role={role}
            isAdmin={isAdmin}
            userInitial={userInitial}
            profileUser={profileUser}
            organizationDisplay={organizationDisplay}
            editMode={editMode}
            saving={saving}
            onStartEditing={startEditing}
            onCancelEditing={cancelEditing}
            onSaveProfile={saveProfile}
          />
          
          <PreferencesSection
            profileUser={profileUser}
            editMode={editMode}
            draft={draft}
            saveError={saveError}
            saveSuccess={saveSuccess}
            onUpdateDraftField={updateDraftField}
            onUpdateNestedField={updateNestedField}
          />
          
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
            onNavigateToCVStats={navigateToCVStats}
            onNavigateToAdminCVs={navigateToAdminCVs}
          />

          <DangerZone />
        </div>

        <CVConsentModal
          show={showConsentModal}
          onClose={closeConsentModal}
          onAccepted={handleConsentAccepted}
        />

        <PersonalityConsentModal
          show={showPersonalityConsentModal}
          onClose={closePersonalityConsentModal}
          onAccepted={handlePersonalityConsentAccepted}
        />
      </div>
    </div>
  );
}
