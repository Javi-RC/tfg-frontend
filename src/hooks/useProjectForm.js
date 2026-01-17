import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  createProject, 
  updateProject, 
  getProjectById,
  activateProject 
} from '../api/projects';
import { getMyOrganizations } from '../api/organization';
import { validateCurrentStep } from '../validators/projectValidators';
import { PROJECT_STATUS } from '../types/projectTypes';

/**
 * Initial form data structure
 */
function getInitialFormData() {
  return {
    projectName: '',
    briefDescription: '',
    estimatedStartDate: '',
    estimatedEndDate: '',
    expectedDuration: { value: 1, unit: 'months' },
    requiresSynchronousCommunication: 'no',
    realTimeCommunicationLevel: 'low',
    weeklyMeetingsCount: 0,
    averageMeetingDuration: { value: 0, unit: 'minutes' },
    requiredAvailabilitySchedule: '',
    requiredLanguages: [],
    requiredLanguagesText: '',
    minimumLanguageProficiency: 'B1',
    mainTechnologies: [],
    mainTechnologiesText: '',
    requiredExperienceLevel: 'mid',
    systemComplexity: 'medium',
    sharedInfrastructureDependency: '',
    requiresSpecializedTools: { needed: false, description: '' },
    documentationLevel: 'partial',
    teamRegions: [],
    teamRegionsText: '',
    distributedWorkExperienceLevel: 'medium',
    expectedTimeOverlap: { value: 4, unit: 'hours' },
    culturalDiversityLevel: 'medium',
    specificRolesNeeded: [],
    rolesFlexibility: 'adaptable',
    rolesDependencyLevel: 'medium',
    teamAvailabilityType: 'full-time',
    partTimeWorkloadPercent: 100,
    otherCommitments: [],
    coordinationRequirements: {
      workflowIntegration: 'medium',
      dependencyManagement: 'medium',
      conflictResolutionSpeed: 'hours'
    },
    collaborationIntensity: {
      pairProgrammingFrequency: 'occasional',
      codeReviewsDepth: 'moderate',
      sharedDecisionMaking: 'balanced'
    },
    teamMaturityExpectation: {
      autonomyLevel: 'moderate',
      mentorshipAvailability: 'available',
      learningCurveAllowance: 'moderate'
    },
    involvedTeams: [],
    informationFlow: 'bidirectional',
    criticalExchanges: [],
    highLoadPeriods: [],
    managementMethod: 'scrum',
    followUpFrequency: {
      standups: { frequency: 'daily' },
      reviews: { frequency: 'weekly' },
      retrospectives: { frequency: 'biweekly' }
    },
    communicationTools: [],
    communicationToolsText: '',
    taskManagementTools: [],
    taskManagementToolsText: '',
    documentationStandardization: 'medium',
    hasOnboardingProcesses: 'partial',
    hasVersionControlAndCICD: 'yes',
    internalToolsFragmentation: 'medium'
  };
}

/**
 * Custom hook for Project Form business logic
 * Manages multi-step form state and submission
 */
export function useProjectForm() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(getInitialFormData());
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState('');

  useEffect(() => {
    loadOrganizations();
    if (isEditMode) {
      loadProject();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /**
   * Load user's organizations
   */
  const loadOrganizations = async () => {
    try {
      const res = await getMyOrganizations();
      const orgs = res.data?.success ? res.data.data : res.data;
      setOrganizations(orgs || []);
      
      if (orgs && orgs.length > 0 && !selectedOrg) {
        setSelectedOrg(orgs[0]._id);
      }
    } catch (error) {
      console.error('Error loading organizations:', error);
    }
  };

  /**
   * Load existing project for editing
   */
  const loadProject = async () => {
    try {
      setLoading(true);
      const res = await getProjectById(id, false);
      const projectData = res.data?.success ? res.data.data : res.data;
      
      // Get initial structure with all defaults
      const initialData = getInitialFormData();
      
      // Helper to safely merge objects
      const mergeObject = (target, source) => {
        if (!source || typeof source !== 'object') return target;
        const result = { ...target };
        Object.keys(source).forEach(key => {
          if (source[key] !== null && source[key] !== undefined) {
            result[key] = source[key];
          }
        });
        return result;
      };
      
      // Merge nested objects properly
      const mappedData = {
        ...initialData,
        ...projectData,
        // Format dates
        estimatedStartDate: projectData.estimatedStartDate?.split('T')[0] || '',
        estimatedEndDate: projectData.estimatedEndDate?.split('T')[0] || '',
        // Merge nested objects with defaults
        expectedDuration: mergeObject(initialData.expectedDuration, projectData.expectedDuration),
        averageMeetingDuration: mergeObject(initialData.averageMeetingDuration, projectData.averageMeetingDuration),
        expectedTimeOverlap: mergeObject(initialData.expectedTimeOverlap, projectData.expectedTimeOverlap),
        requiresSpecializedTools: mergeObject(initialData.requiresSpecializedTools, projectData.requiresSpecializedTools),
        coordinationRequirements: mergeObject(initialData.coordinationRequirements, projectData.coordinationRequirements),
        collaborationIntensity: mergeObject(initialData.collaborationIntensity, projectData.collaborationIntensity),
        teamMaturityExpectation: mergeObject(initialData.teamMaturityExpectation, projectData.teamMaturityExpectation),
        followUpFrequency: projectData.followUpFrequency ? {
          standups: mergeObject(initialData.followUpFrequency.standups, projectData.followUpFrequency.standups),
          reviews: mergeObject(initialData.followUpFrequency.reviews, projectData.followUpFrequency.reviews),
          retrospectives: mergeObject(initialData.followUpFrequency.retrospectives, projectData.followUpFrequency.retrospectives)
        } : initialData.followUpFrequency,
        // Ensure arrays are properly set
        requiredLanguages: projectData.requiredLanguages || [],
        mainTechnologies: projectData.mainTechnologies || [],
        teamRegions: projectData.teamRegions || [],
        specificRolesNeeded: projectData.specificRolesNeeded || [],
        otherCommitments: projectData.otherCommitments || [],
        involvedTeams: projectData.involvedTeams || [],
        criticalExchanges: projectData.criticalExchanges || [],
        highLoadPeriods: projectData.highLoadPeriods || [],
        communicationTools: projectData.communicationTools || [],
        taskManagementTools: projectData.taskManagementTools || []
      };

      // Keep raw text versions for comma-separated list inputs (better typing UX)
      mappedData.requiredLanguagesText = mappedData.requiredLanguages.join(', ');
      mappedData.mainTechnologiesText = mappedData.mainTechnologies.join(', ');
      mappedData.teamRegionsText = mappedData.teamRegions.join(', ');
      mappedData.communicationToolsText = mappedData.communicationTools.join(', ');
      mappedData.taskManagementToolsText = mappedData.taskManagementTools.join(', ');
      
      setFormData(mappedData);
      if (projectData.organization?._id) {
        setSelectedOrg(projectData.organization._id);
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Error loading project');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update form field
   * Accepts either (field, value) or ({ field: value })
   */
  const updateField = (fieldOrObject, value) => {
    // Handle both formats: updateField(field, value) or updateField({ field: value })
    if (typeof fieldOrObject === 'object') {
      // Object format: { field: value, anotherField: anotherValue }
      setFormData(prev => ({ ...prev, ...fieldOrObject }));
      
      // Clear errors for all updated fields
      const updatedFields = Object.keys(fieldOrObject);
      if (updatedFields.some(field => errors[field])) {
        setErrors(prev => {
          const newErrors = { ...prev };
          updatedFields.forEach(field => delete newErrors[field]);
          return newErrors;
        });
      }
    } else {
      // Two-parameter format: updateField(field, value)
      setFormData(prev => ({ ...prev, [fieldOrObject]: value }));
      
      if (errors[fieldOrObject]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[fieldOrObject];
          return newErrors;
        });
      }
    }
  };

  /**
   * Navigate to next step
   */
  const nextStep = () => {
    const validation = validateCurrentStep(currentStep, formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return false;
    }
    
    setErrors({});
    setCurrentStep(prev => prev + 1);
    return true;
  };

  /**
   * Navigate to previous step
   */
  const prevStep = () => {
    setErrors({});
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  /**
   * Go to specific step
   */
  const goToStep = (step) => {
    setErrors({});
    setCurrentStep(step);
  };

  /**
   * Submit form (save as draft or create/update)
   */
  const handleSubmit = async (shouldActivate = false) => {
    if (!selectedOrg) {
      alert('Please select an organization');
      return;
    }

    const validation = validateCurrentStep(currentStep, formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      setLoading(true);

      const payloadFormData = { ...formData };
      // Do not send helper UI-only fields to the backend
      [
        'requiredLanguagesText',
        'mainTechnologiesText',
        'teamRegionsText',
        'communicationToolsText',
        'taskManagementToolsText'
      ].forEach((key) => {
        delete payloadFormData[key];
      });

      const payload = {
        ...payloadFormData,
        organization: selectedOrg,
        status: PROJECT_STATUS.DRAFT
      };

      let projectId = id;
      
      if (isEditMode) {
        await updateProject(id, payload);
      } else {
        const res = await createProject(payload);
        projectId = res.data?.data?._id || res.data?._id;
      }

      if (shouldActivate && projectId) {
        await activateProject(projectId);
      }

      navigate('/projects');
    } catch (error) {
      alert(error.response?.data?.error || 'Error saving project');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Save as draft
   */
  const saveDraft = () => handleSubmit(false);

  /**
   * Submit and activate
   */
  const submitAndActivate = () => handleSubmit(true);

  return {
    // State
    currentStep,
    formData,
    errors,
    loading,
    organizations,
    selectedOrg,
    isEditMode,
    
    // Actions
    navigate,
    setSelectedOrg,
    updateField,
    nextStep,
    prevStep,
    goToStep,
    saveDraft,
    submitAndActivate,
    setFormData
  };
}
