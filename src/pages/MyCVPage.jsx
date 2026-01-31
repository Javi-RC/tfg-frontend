import React from 'react';
import { useTranslation } from 'react-i18next';
import CVUpload from '../components/CVUpload';
import CVHeader from '../components/cv/CVHeader';
import CVErrorBanner from '../components/cv/CVErrorBanner';
import CVWrapper from '../components/cv/CVWrapper';
import EmptyState from '../components/cv/EmptyState';
import LoadingState from '../components/cv/LoadingState';
import ContactSection from '../components/cv/ContactSection';
import ExperienceSection from '../components/cv/ExperienceSection';
import EducationSection from '../components/cv/EducationSection';
import SkillsSection from '../components/cv/SkillsSection';
import LanguagesSection from '../components/cv/LanguagesSection';
import ProjectsSection from '../components/cv/ProjectsSection';
import CertificationsSection from '../components/cv/CertificationsSection';
import SubmitCVToOrganization from '../components/SubmitCVToOrganization';
import { useMyCVPage } from '../hooks/useMyCVPage';
import { useCVEditor } from '../hooks/useCVEditor';

/**
 * MyCVPage Component
 * Displays the user's processed CV with edit and delete capabilities
 */
export default function MyCVPage() {
  const { t } = useTranslation();
  const {
    cv,
    loading,
    error,
    showUpload,
    showSubmitToOrg,
    handleDelete,
    handleUploadSuccess,
    handleSaveCV,
    toggleUploadModal,
    toggleSubmitToOrgModal,
    clearError
  } = useMyCVPage();

  const cvEditor = useCVEditor(cv);
  const { 
    editMode, 
    editData, 
    saving, 
    setSaving,
    startEditing,
    cancelEditing,
    updateEditData,
    ...handlers 
  } = cvEditor;

  const handleStartEditing = () => {
    clearError();
    startEditing();
  };

  const handleCancelEditing = () => {
    clearError();
    cancelEditing(cv);
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    const result = await handleSaveCV(editData);
    setSaving(false);
    
    if (result.success) {
      updateEditData(cv);
      cancelEditing(cv);
    } else {
      // Errors are already set in the hook
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (showUpload) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#fafbfc',
        padding: '40px 20px'
      }}>
        <CVUpload
          onUploadSuccess={handleUploadSuccess}
          onCancel={toggleUploadModal}
        />
      </div>
    );
  }

  if (!cv) {
    return <EmptyState error={error} onUpload={toggleUploadModal} />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f7fa',
      display: 'flex',
      paddingTop: '64px',
      marginTop: '32px' // Added margin to provide space at the top
    }} role="main" aria-label={t('cv.aria.myCvPage')}>
      <CVHeader
        editMode={editMode}
        saving={saving}
        onEdit={handleStartEditing}
        onCancelEdit={handleCancelEditing}
        onSave={handleSaveEdit}
        onUpload={toggleUploadModal}
        onDelete={handleDelete}
        onSubmitToOrg={toggleSubmitToOrgModal}
      />
      
      <div style={{
        marginLeft: '280px',
        width: 'calc(100% - 280px)',
        padding: '40px 24px'
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto'
        }}>
          <CVErrorBanner error={error} />

        <CVWrapper>
          <ContactSection
            cv={cv}
            editData={editData}
            editMode={editMode}
            onContactChange={handlers.handleContactChange}
            onContactLocationChange={handlers.handleContactLocationChange}
            onContactLinksChange={handlers.handleContactLinksChange}
            onContactPhoneChange={handlers.handleContactPhoneChange}
            onContactPhoneTypeChange={handlers.handleContactPhoneTypeChange}
          />

          <ExperienceSection
            cv={cv}
            editData={editData}
            editMode={editMode}
            onExperienceChange={handlers.handleExperienceChange}
            onAddExperience={handlers.addExperience}
            onRemoveExperience={handlers.removeExperience}
          />

          <EducationSection
            cv={cv}
            editData={editData}
            editMode={editMode}
            onEducationChange={handlers.handleEducationChange}
            onAddEducation={handlers.addEducation}
            onRemoveEducation={handlers.removeEducation}
          />

          <SkillsSection
            cv={cv}
            editData={editData}
            editMode={editMode}
            onSkillChange={handlers.handleSkillChange}
            onAddSkill={handlers.addSkill}
            onRemoveSkill={handlers.removeSkill}
          />

          <LanguagesSection
            cv={cv}
            editData={editData}
            editMode={editMode}
            onLanguageChange={handlers.handleLanguageChange}
            onAddLanguage={handlers.addLanguage}
            onRemoveLanguage={handlers.removeLanguage}
          />

          <ProjectsSection
            cv={cv}
            editData={editData}
            editMode={editMode}
            onProjectChange={handlers.handleProjectChange}
            onAddProject={handlers.addProject}
            onRemoveProject={handlers.removeProject}
          />

          <CertificationsSection
            cv={cv}
            editData={editData}
            editMode={editMode}
            onCertificationChange={handlers.handleCertificationChange}
            onAddCertification={handlers.addCertification}
            onRemoveCertification={handlers.removeCertification}
          />
        </CVWrapper>
        </div>
      </div>

      {showSubmitToOrg && (
        <SubmitCVToOrganization
          onClose={toggleSubmitToOrgModal}
          onSuccess={() => {
            toggleSubmitToOrgModal();
            clearError();
            alert('CV submitted successfully to organization!');
          }}
        />
      )}
    </div>
  );
}