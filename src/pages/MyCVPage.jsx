import React, { useState, useEffect } from 'react';
import { getMyCV, deleteCV, updateCV } from '../api/cv';
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
import useCVEditor from '../hooks/useCVEditor';

/**
 * MyCVPage Component
 * Displays the user's processed CV with edit and delete capabilities
 */
export default function MyCVPage() {
  const [cv, setCV] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpload, setShowUpload] = useState(false);

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

  useEffect(() => {
    loadCV();
  }, []);

  const loadCV = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getMyCV();
      const cvData = response.data?.cv || response.data;
      setCV(cvData);
      updateEditData(cvData);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('No CV found. Please upload one.');
      } else {
        setError(err.response?.data?.error || 'Error loading CV');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!cv?._id) return;
    
    if (!window.confirm('Are you sure you want to delete your CV? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteCV(cv._id);
      setCV(null);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Error deleting CV');
    }
  };

  const handleUploadSuccess = async (cvData) => {
    // El backend devuelve un resumen, necesitamos recargar el CV completo
    setShowUpload(false);
    setError(null);
    
    // Recargar el CV completo desde el backend
    await loadCV();
  };

  const handleStartEditing = () => {
    setError(null); // Limpiar errores al entrar en modo edición
    startEditing();
  };

  const handleCancelEditing = () => {
    setError(null); // Limpiar errores al cancelar edición
    cancelEditing(cv);
  };

  const handleSaveEdit = async () => {
    if (!cv?._id) return;
    
    // Validar campos requeridos
    const validationErrors = [];
    
    // Validar experiencia
    if (editData.experience && editData.experience.length > 0) {
      editData.experience.forEach((exp, index) => {
        if (!exp.company || exp.company.trim() === '') {
          validationErrors.push(`Experience ${index + 1}: Company is required`);
        }
        if (!exp.position || exp.position.trim() === '') {
          validationErrors.push(`Experience ${index + 1}: Position is required`);
        }
      });
    }
    
    // Validar educación
    if (editData.education && editData.education.length > 0) {
      editData.education.forEach((edu, index) => {
        if (!edu.institution || edu.institution.trim() === '') {
          validationErrors.push(`Education ${index + 1}: Institution is required`);
        }
        if (!edu.degree || edu.degree.trim() === '') {
          validationErrors.push(`Education ${index + 1}: Degree is required`);
        }
      });
    }
    
    // Validar skills
    if (editData.skills?.technical && editData.skills.technical.length > 0) {
      editData.skills.technical.forEach((skill, index) => {
        if (!skill.name || skill.name.trim() === '') {
          validationErrors.push(`Skill ${index + 1}: Name is required`);
        }
      });
    }
    
    // Validar idiomas
    if (editData.languages && editData.languages.length > 0) {
      editData.languages.forEach((lang, index) => {
        const langObj = typeof lang === 'string' ? { language: lang, level: '' } : lang;
        if (!langObj.language || langObj.language.trim() === '') {
          validationErrors.push(`Language ${index + 1}: Language name is required`);
        }
        if (!langObj.level || langObj.level.trim() === '') {
          validationErrors.push(`Language ${index + 1}: Level is required`);
        }
      });
    }
    
    // Validar proyectos
    if (editData.projects && editData.projects.length > 0) {
      editData.projects.forEach((project, index) => {
        if (!project.name || project.name.trim() === '') {
          validationErrors.push(`Project ${index + 1}: Name is required`);
        }
      });
    }
    
    // Validar certificaciones
    if (editData.certifications && editData.certifications.length > 0) {
      editData.certifications.forEach((cert, index) => {
        if (!cert.name || cert.name.trim() === '') {
          validationErrors.push(`Certification ${index + 1}: Name is required`);
        }
      });
    }
    
    // Si hay errores de validación, mostrarlos y no continuar
    if (validationErrors.length > 0) {
      const errorMessage = 'Please fill in all required fields:\n\n' + validationErrors.join('\n');
      setError(errorMessage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    setSaving(true);
    try {
      const response = await updateCV(cv._id, editData);
      const updatedCV = response.data?.cv || response.data;
      setCV(updatedCV);
      updateEditData(updatedCV);
      cancelEditing(updatedCV);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Error updating CV');
    } finally {
      setSaving(false);
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
          onCancel={() => setShowUpload(false)}
        />
      </div>
    );
  }

  if (!cv) {
    return <EmptyState error={error} onUpload={() => setShowUpload(true)} />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f7fa',
      display: 'flex',
      paddingTop: '64px'
    }} role="main" aria-label="My CV page">
      <CVHeader
        editMode={editMode}
        saving={saving}
        onEdit={handleStartEditing}
        onCancelEdit={handleCancelEditing}
        onSave={handleSaveEdit}
        onUpload={() => setShowUpload(true)}
        onDelete={handleDelete}
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
    </div>
  );
}