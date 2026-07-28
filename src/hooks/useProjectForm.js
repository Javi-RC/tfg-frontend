import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { createProject, updateProject, getProjectById, activateProject } from '../api/projects';
import { showError, showInfo } from '../utils/toast';
import { getMyOrganizations } from '../api/organization';
import { unwrapData } from '../api/responseAdapter';
import { validateCurrentStep } from '../validators/projectValidators';
import { PROJECT_STATUS } from '../types/projectTypes';
import { getApiErrorMessage } from '../utils/getApiErrorMessage';

/**
 * Initial form data structure
 */
function getInitialFormData() {
  return {
    projectName: '',
    briefDescription: '',
    estimatedStartDate: '',
    estimatedEndDate: '',
    teamSize: 5,
    requiresSynchronousCommunication: 'no',
    realTimeCommunicationLevel: 'low',
    weeklyMeetingsCount: 0,
    averageMeetingDuration: { value: 0, unit: 'minutes' },
    requiredAvailabilitySchedule: '',
    requiredLanguages: [],
    requiredLanguagesText: '',
    minimumLanguageProficiency: 'B1',
    involvedCountries: [],
    involvedCountriesText: '',
    culturalDiversityLevel: 'medium',
    mainTechnologies: [],
    mainTechnologiesText: '',
    requiredExperienceLevel: 'mid',
    requiredAutonomyLevel: 3,
    requiredScheduleFlexibility: 3,
    requiredTravelAvailability: 3,
    sharedInfrastructureDependency: '',
    requiresSpecializedTools: { needed: false, description: '' },
    documentationLevel: 'partial',
    documentationStandardization: 'medium',
    knowledgeManagementSystem: '',
    knowledgeManagementTools: [],
    knowledgeManagementToolsText: '',
    documentationProcesses: {
      hasStandardization: false,
      templates: false,
      reviewProcess: false,
    },
    distributedWorkExperienceLevel: 'medium',
    workMode: 'office_mode',
    workModeDetails: '',
    expectedTimeOverlap: { value: 4, unit: 'hours' },
    coreHours: { start: '', end: '', timezone: '' },
    meetingRotationPolicy: false,
    timezoneConsiderations: '',
    requiresOffHoursReporting: false,
    asyncCommunicationStrategy: '',
    rolesAndResponsibilities: [],
    teamAvailabilityType: 'full-time',
    // Backend requires this field. Keep a sensible default so the user
    // doesn't have to touch the input for the request to be valid.
    weeklyHoursPerMember: 40,
    requiresAfterHoursAvailability: 'no',
    highLoadPeriods: [],
    coordinationRequirements: {
      workflowIntegration: 'medium',
      dependencyManagement: 'medium',
      conflictResolutionSpeed: 'hours',
    },
    collaborationIntensity: {
      pairProgrammingFrequency: 'occasional',
      codeReviewsDepth: 'moderate',
      sharedDecisionMaking: 'balanced',
    },
    teamMaturityExpectation: {
      autonomyLevel: 'moderate',
      mentorshipAvailability: 'available',
      learningCurveAllowance: 'moderate',
    },
    criticalDependencies: [],
    involvedTeams: [],
    informationFlow: 'bidirectional',
    criticalExchanges: [],
    managementMethod: 'scrum',
    followUpFrequency: {
      standups: { frequency: 'daily' },
      reviews: { frequency: 'weekly' },
      retrospectives: { frequency: 'biweekly' },
    },
    communicationTools: [],
    communicationToolsText: '',
    taskManagementTools: [],
    taskManagementToolsText: '',
    taskTrackingSystem: '',
    hasOnboardingProcesses: 'partial',
    hasVersionControlAndCICD: 'partial',
    internalToolsFragmentation: 'medium',
    hasOrganizationalChart: false,
    hasStandardizedProcedures: false,
    requiresRegulatoryCompliance: false,
    complianceStandards: [],
    complianceStandardsText: '',
    standardsDocumentation: '',
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
  const { t } = useTranslation();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(() => getInitialFormData());
  const [errors, setErrors] = useState({});
  const [validationMessage, setValidationMessage] = useState(null);
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
      const orgs = unwrapData(res);
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
      const projectData = unwrapData(res);

      // Get initial structure with all defaults
      const initialData = getInitialFormData();

      // Helper to safely merge objects
      const mergeObject = (target, source) => {
        if (!source || typeof source !== 'object') return target;
        const result = { ...target };
        Object.keys(source).forEach((key) => {
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
        averageMeetingDuration: mergeObject(
          initialData.averageMeetingDuration,
          projectData.averageMeetingDuration
        ),
        expectedTimeOverlap: mergeObject(
          initialData.expectedTimeOverlap,
          projectData.expectedTimeOverlap
        ),
        requiresSpecializedTools: mergeObject(
          initialData.requiresSpecializedTools,
          projectData.requiresSpecializedTools
        ),
        coordinationRequirements: mergeObject(
          initialData.coordinationRequirements,
          projectData.coordinationRequirements
        ),
        collaborationIntensity: mergeObject(
          initialData.collaborationIntensity,
          projectData.collaborationIntensity
        ),
        teamMaturityExpectation: mergeObject(
          initialData.teamMaturityExpectation,
          projectData.teamMaturityExpectation
        ),
        followUpFrequency: projectData.followUpFrequency
          ? {
              standups: mergeObject(
                initialData.followUpFrequency.standups,
                projectData.followUpFrequency.standups
              ),
              reviews: mergeObject(
                initialData.followUpFrequency.reviews,
                projectData.followUpFrequency.reviews
              ),
              retrospectives: mergeObject(
                initialData.followUpFrequency.retrospectives,
                projectData.followUpFrequency.retrospectives
              ),
            }
          : initialData.followUpFrequency,
        // Ensure arrays are properly set
        requiredLanguages: projectData.requiredLanguages || [],
        mainTechnologies: projectData.mainTechnologies || [],
        involvedCountries: projectData.involvedCountries || [],
        knowledgeManagementTools: projectData.knowledgeManagementTools || [],
        rolesAndResponsibilities: projectData.rolesAndResponsibilities || [],
        criticalDependencies: projectData.criticalDependencies || [],
        involvedTeams: projectData.involvedTeams || [],
        criticalExchanges: projectData.criticalExchanges || [],
        highLoadPeriods: projectData.highLoadPeriods || [],
        communicationTools: projectData.communicationTools || [],
        taskManagementTools: projectData.taskManagementTools || [],
        complianceStandards: projectData.complianceStandards || [],
      };

      // Keep raw text versions for comma-separated list inputs (better typing UX)
      mappedData.requiredLanguagesText = mappedData.requiredLanguages.join(', ');
      mappedData.mainTechnologiesText = mappedData.mainTechnologies.join(', ');
      mappedData.involvedCountriesText = mappedData.involvedCountries.join(', ');
      mappedData.knowledgeManagementToolsText = mappedData.knowledgeManagementTools.join(', ');
      mappedData.communicationToolsText = mappedData.communicationTools.join(', ');
      mappedData.taskManagementToolsText = mappedData.taskManagementTools.join(', ');
      mappedData.complianceStandardsText = mappedData.complianceStandards.join(', ');

      setFormData(mappedData);
      if (projectData.organization?._id) {
        setSelectedOrg(projectData.organization._id);
      }
    } catch (error) {
      showError(getApiErrorMessage(error, t('projects.errors.loadFailed')));
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
      setFormData((prev) => ({ ...prev, ...fieldOrObject }));

      // Clear errors for all updated fields
      const updatedFields = Object.keys(fieldOrObject);
      if (updatedFields.some((field) => errors[field])) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          updatedFields.forEach((field) => delete newErrors[field]);
          return newErrors;
        });
      }
    } else {
      // Two-parameter format: updateField(field, value)
      setFormData((prev) => ({ ...prev, [fieldOrObject]: value }));

      if (errors[fieldOrObject]) {
        setErrors((prev) => {
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
      // Show generic validation message
      setValidationMessage('validation.completeRequiredFields');
      // Clear message after 5 seconds
      setTimeout(() => setValidationMessage(null), 5000);
      return false;
    }

    setErrors({});
    setValidationMessage(null);
    setCurrentStep((prev) => prev + 1);
    return true;
  };

  /**
   * Navigate to previous step
   */
  const prevStep = () => {
    setErrors({});
    setCurrentStep((prev) => Math.max(1, prev - 1));
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
      showInfo(t('projects.errors.selectOrganization'));
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
        'involvedCountriesText',
        'knowledgeManagementToolsText',
        'communicationToolsText',
        'taskManagementToolsText',
        'complianceStandardsText',
      ].forEach((key) => {
        delete payloadFormData[key];
      });

      // Normalize numeric fields that come from <input type="number"> as strings.
      const rawWeeklyHours = payloadFormData.weeklyHoursPerMember;
      const parsedWeeklyHours = Number(
        rawWeeklyHours === undefined || rawWeeklyHours === null || rawWeeklyHours === ''
          ? 40
          : rawWeeklyHours
      );
      payloadFormData.weeklyHoursPerMember =
        Number.isFinite(parsedWeeklyHours) && parsedWeeklyHours > 0 ? parsedWeeklyHours : 40;

      const payload = {
        ...payloadFormData,
        // Backend expects organizationId (validated as required + ObjectId)
        organizationId: selectedOrg,
        // Backend requires this field; force it to be present.
        weeklyHoursPerMember: payloadFormData.weeklyHoursPerMember,
        status: PROJECT_STATUS.DRAFT,
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
      showError(getApiErrorMessage(error, t('projects.errors.saveFailed')));
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
    validationMessage,
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
    setFormData,
  };
}
