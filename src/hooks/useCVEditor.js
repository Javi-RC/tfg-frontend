import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook to manage CV editing logic
 * Centralizes all state and handlers for CV editing
 */
export function useCVEditor(initialCV) {
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(initialCV);
  const [saving, setSaving] = useState(false);

  // Sincronizar editData cuando el CV cambie
  useEffect(() => {
    setEditData(initialCV);
  }, [initialCV]);

  /**
   * Generic handler for array field updates
   */
  const createArrayFieldHandler = useCallback((section) => {
    return (index, field, value) => {
      setEditData((prev) => {
        const updated = [...(prev[section] || [])];
        updated[index] = { ...updated[index], [field]: value };
        return { ...prev, [section]: updated };
      });
    };
  }, []);

  /**
   * Generic handler for nested object updates
   */
  const createNestedFieldHandler = useCallback((parent, child = null) => {
    return (field, value) => {
      setEditData((prev) => {
        if (child) {
          return {
            ...prev,
            [parent]: {
              ...prev[parent],
              [child]: {
                ...prev[parent]?.[child],
                [field]: value
              }
            }
          };
        }
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [field]: value
          }
        };
      });
    };
  }, []);

  /**
   * Generic add item to array handler
   */
  const createAddItemHandler = useCallback((section, defaultItem) => {
    return () => {
      setEditData((prev) => ({
        ...prev,
        [section]: [...(prev[section] || []), defaultItem]
      }));
    };
  }, []);

  /**
   * Generic remove item from array handler
   */
  const createRemoveItemHandler = useCallback((section) => {
    return (index) => {
      setEditData((prev) => ({
        ...prev,
        [section]: prev[section].filter((_, i) => i !== index)
      }));
    };
  }, []);

  // Contact handlers
  const handleContactChange = createNestedFieldHandler('contact');
  const handleContactLocationChange = createNestedFieldHandler('contact', 'location');
  const handleContactLinksChange = createNestedFieldHandler('contact', 'links');
  
  const handleContactPhoneChange = useCallback((value) => {
    setEditData((prev) => {
      const phones = prev.contact?.phones || [{ number: '', type: 'mobile' }];
      phones[0] = { ...phones[0], number: value };
      return {
        ...prev,
        contact: {
          ...prev.contact,
          phones
        }
      };
    });
  }, []);

  const handleContactPhoneTypeChange = useCallback((value) => {
    setEditData((prev) => {
      const phones = prev.contact?.phones || [{ number: '', type: 'mobile' }];
      phones[0] = { ...phones[0], type: value };
      return {
        ...prev,
        contact: {
          ...prev.contact,
          phones
        }
      };
    });
  }, []);

  // Experience handlers
  const handleExperienceChange = createArrayFieldHandler('experience');
  const addExperience = createAddItemHandler('experience', {
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    responsibilities: [],
    technologies: []
  });
  const removeExperience = createRemoveItemHandler('experience');

  // Education handlers
  const handleEducationChange = createArrayFieldHandler('education');
  const addEducation = createAddItemHandler('education', {
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    current: false,
    achievements: []
  });
  const removeEducation = createRemoveItemHandler('education');

  // Skills handlers
  const handleSkillChange = useCallback((index, field, value) => {
    setEditData((prev) => {
      const updated = [...(prev.skills?.technical || [])];
      updated[index] = { ...updated[index], [field]: value };
      return {
        ...prev,
        skills: { ...prev.skills, technical: updated }
      };
    });
  }, []);

  const addSkill = useCallback(() => {
    setEditData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        technical: [...(prev.skills?.technical || []), { name: '', level: '', category: '' }]
      }
    }));
  }, []);

  const removeSkill = useCallback((index) => {
    setEditData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        technical: (prev.skills?.technical || []).filter((_, i) => i !== index)
      }
    }));
  }, []);

  // Languages handlers
  const handleLanguageChange = useCallback((index, field, value) => {
    setEditData((prev) => {
      const updated = [...(prev.languages || [])];
      if (typeof updated[index] === 'string') {
        updated[index] = { language: updated[index], level: '' };
      }
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, languages: updated };
    });
  }, []);

  const addLanguage = createAddItemHandler('languages', { language: '', level: '' });
  const removeLanguage = createRemoveItemHandler('languages');

  // Projects handlers
  const handleProjectChange = createArrayFieldHandler('projects');
  const addProject = createAddItemHandler('projects', {
    name: '',
    description: '',
    technologies: '',
    url: ''
  });
  const removeProject = createRemoveItemHandler('projects');

  // Certifications handlers
  const handleCertificationChange = createArrayFieldHandler('certifications');
  const addCertification = createAddItemHandler('certifications', {
    name: '',
    issuer: '',
    dateObtained: '',
    credentialId: ''
  });
  const removeCertification = createRemoveItemHandler('certifications');

  // Mode control
  const startEditing = useCallback(() => setEditMode(true), []);
  const cancelEditing = useCallback((originalCV) => {
    setEditMode(false);
    setEditData(originalCV);
  }, []);

  // Update editData when CV changes
  const updateEditData = useCallback((newCV) => {
    setEditData(newCV);
  }, []);

  return {
    // State
    editMode,
    editData,
    saving,
    setSaving,
    
    // Mode control
    startEditing,
    cancelEditing,
    updateEditData,
    
    // Contact
    handleContactChange,
    handleContactLocationChange,
    handleContactLinksChange,
    handleContactPhoneChange,
    handleContactPhoneTypeChange,
    
    // Experience
    handleExperienceChange,
    addExperience,
    removeExperience,
    
    // Education
    handleEducationChange,
    addEducation,
    removeEducation,
    
    // Skills
    handleSkillChange,
    addSkill,
    removeSkill,
    
    // Languages
    handleLanguageChange,
    addLanguage,
    removeLanguage,
    
    // Projects
    handleProjectChange,
    addProject,
    removeProject,
    
    // Certifications
    handleCertificationChange,
    addCertification,
    removeCertification
  };
}
