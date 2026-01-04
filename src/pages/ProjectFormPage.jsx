import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save, CheckCircle } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import { 
  createProject, 
  updateProject, 
  getProjectById,
  activateProject 
} from '../api/projects';
import { getMyOrganizations } from '../api/organization';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import Step1GeneralInfo from '../components/projects/Step1GeneralInfo';
import Step2Collaboration from '../components/projects/Step2Collaboration';
import Step3Technical from '../components/projects/Step3Technical';
import Step4Geographic from '../components/projects/Step4Geographic';
import Step5Roles from '../components/projects/Step5Roles';
import Step6Availability from '../components/projects/Step6Availability';
import Step7Coordination from '../components/projects/Step7Coordination';
import Step8CollaborationIntensity from '../components/projects/Step8CollaborationIntensity';
import Step9Maturity from '../components/projects/Step9Maturity';
import { FORM_STEPS, PROJECT_STATUS } from '../types/projectTypes';

/**
 * Project Form Page
 * Multi-step form for creating/editing projects
 */
export default function ProjectFormPage() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

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
  }, [id]);

  function getInitialFormData() {
    return {
      // Step 1: General Information (OBLIGATORIOS)
      projectName: '',
      briefDescription: '',
      estimatedStartDate: '',
      estimatedEndDate: '',
      expectedDuration: { value: 1, unit: 'months' },
      
      // Step 2: Collaboration Requirements (OBLIGATORIOS con defaults)
      requiresSynchronousCommunication: 'no',
      realTimeCommunicationLevel: 'low',
      weeklyMeetingsCount: 0,
      averageMeetingDuration: { value: 0, unit: 'minutes' },
      requiredAvailabilitySchedule: '',
      requiredLanguages: [],
      minimumLanguageProficiency: 'B1',
      
      // Step 3: Technical Requirements (OBLIGATORIOS con defaults)
      mainTechnologies: [],
      requiredExperienceLevel: 'mid',
      systemComplexity: 'medium',
      sharedInfrastructureDependency: '',
      requiresSpecializedTools: { needed: false, description: '' },
      documentationLevel: 'partial',
      
      // Step 4: Geographic Distribution (OPCIONALES con defaults)
      teamRegions: [],
      distributedWorkExperienceLevel: 'medium',
      expectedTimeOverlap: { value: 4, unit: 'hours' },
      culturalDiversityLevel: 'medium',
      
      // Step 5: Roles and Responsibilities (OPCIONALES)
      keyRoles: [],
      criticalDependencies: [],
      
      // Step 6: Availability Requirements (OBLIGATORIO)
      weeklyHoursPerMember: 40,
      requiresAfterHoursAvailability: 'no',
      highLoadPeriods: [],
      
      // Step 7: Coordination and Management (OBLIGATORIO + OPCIONALES)
      managementMethod: 'scrum',
      followUpFrequency: {
        standups: { frequency: 'daily' },
        reviews: { frequency: 'weekly' },
        retrospectives: { frequency: 'biweekly' }
      },
      communicationTools: [],
      taskManagementTools: [],
      documentationStandardization: 'medium',
      informationFlow: 'bidirectional',
      
      // Step 8: Team Collaboration Intensity (OPCIONALES)
      involvedTeams: [],
      criticalExchanges: [],
      
      // Step 9: Organizational Maturity (OPCIONALES con defaults)
      hasOnboardingProcesses: 'partial',
      hasVersionControlAndCICD: 'partial',
      internalToolsFragmentation: 'medium'
    };
  }

  const loadOrganizations = async () => {
    try {
      const res = await getMyOrganizations();
      const data = res.data?.success ? res.data.data : res.data;
      
      // Filter organizations where user is project manager
      const userId = user?.userId || user?._id || user?.id;
      const pmOrgs = data.filter(org => {
        const employee = org.employees?.find(emp => {
          const empUserId = emp.user?._id || emp.user;
          return empUserId === userId;
        });
        return employee?.isProjectManager === true;
      });
      
      setOrganizations(pmOrgs || []);
      if (pmOrgs.length > 0 && !isEditMode) {
        setSelectedOrg(pmOrgs[0]._id);
      }
    } catch (error) {
      console.error('Error loading organizations:', error);
    }
  };

  const loadProject = async () => {
    try {
      setLoading(true);
      const res = await getProjectById(id);
      const project = res.data?.success ? res.data.data : res.data;
      
      // Format dates for input fields
      if (project.estimatedStartDate) {
        project.estimatedStartDate = new Date(project.estimatedStartDate).toISOString().split('T')[0];
      }
      if (project.estimatedEndDate) {
        project.estimatedEndDate = new Date(project.estimatedEndDate).toISOString().split('T')[0];
      }
      
      setFormData({ ...getInitialFormData(), ...project });
      setSelectedOrg(project.organization);
    } catch (error) {
      alert(error.response?.data?.error || 'Error loading project');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
    // Clear errors for changed fields
    const changedFields = Object.keys(updates);
    setErrors(prev => {
      const newErrors = { ...prev };
      changedFields.forEach(field => delete newErrors[field]);
      return newErrors;
    });
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.projectName || formData.projectName.trim().length < 2) {
      newErrors.projectName = 'Project name must be at least 2 characters';
    }
    if (!formData.briefDescription || formData.briefDescription.trim().length === 0) {
      newErrors.briefDescription = 'Description is required';
    }
    if (!formData.estimatedStartDate) {
      newErrors.estimatedStartDate = 'Start date is required';
    }
    if (!formData.estimatedEndDate) {
      newErrors.estimatedEndDate = 'End date is required';
    }
    if (formData.estimatedStartDate && formData.estimatedEndDate) {
      if (new Date(formData.estimatedEndDate) <= new Date(formData.estimatedStartDate)) {
        newErrors.estimatedEndDate = 'End date must be after start date';
      }
    }
    if (!formData.expectedDuration?.value || formData.expectedDuration.value < 1) {
      newErrors.expectedDuration = 'Duration must be at least 1';
    }
    if (!formData.expectedDuration?.unit) {
      newErrors.expectedDuration = 'Duration unit is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) {
      return;
    }
    
    if (currentStep < FORM_STEPS.length) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSaveDraft = async () => {
    if (!selectedOrg) {
      alert('Please select an organization');
      return;
    }

    try {
      setLoading(true);
      
      // Preparar datos asegurando todos los campos obligatorios
      const data = {
        organizationId: selectedOrg,
        
        // Campos obligatorios básicos
        projectName: formData.projectName || 'Untitled Project',
        briefDescription: formData.briefDescription || 'Project description',
        estimatedStartDate: formData.estimatedStartDate || new Date().toISOString(),
        estimatedEndDate: formData.estimatedEndDate || new Date(Date.now() + 30*24*60*60*1000).toISOString(),
        expectedDuration: formData.expectedDuration || { value: 1, unit: 'months' },
        
        // Campos obligatorios de colaboración con defaults
        requiresSynchronousCommunication: formData.requiresSynchronousCommunication || 'no',
        realTimeCommunicationLevel: formData.realTimeCommunicationLevel || 'low',
        weeklyMeetingsCount: formData.weeklyMeetingsCount ?? 0,
        averageMeetingDuration: formData.averageMeetingDuration || { value: 0, unit: 'minutes' },
        
        // Campos obligatorios técnicos con defaults
        requiredExperienceLevel: formData.requiredExperienceLevel || 'mid',
        systemComplexity: formData.systemComplexity || 'medium',
        documentationLevel: formData.documentationLevel || 'partial',
        
        // Campo obligatorio de disponibilidad
        weeklyHoursPerMember: formData.weeklyHoursPerMember ?? 40,
        
        // Campo obligatorio de gestión
        managementMethod: formData.managementMethod || 'scrum',
        
        // Campos opcionales con defaults
        minimumLanguageProficiency: formData.minimumLanguageProficiency || 'B1',
        requiresAfterHoursAvailability: formData.requiresAfterHoursAvailability || 'no',
        distributedWorkExperienceLevel: formData.distributedWorkExperienceLevel || 'medium',
        culturalDiversityLevel: formData.culturalDiversityLevel || 'medium',
        documentationStandardization: formData.documentationStandardization || 'medium',
        informationFlow: formData.informationFlow || 'bidirectional',
        hasOnboardingProcesses: formData.hasOnboardingProcesses || 'partial',
        hasVersionControlAndCICD: formData.hasVersionControlAndCICD || 'partial',
        internalToolsFragmentation: formData.internalToolsFragmentation || 'medium',
        
        // Arrays opcionales
        requiredLanguages: formData.requiredLanguages || [],
        mainTechnologies: formData.mainTechnologies || [],
        teamRegions: formData.teamRegions || [],
        keyRoles: formData.keyRoles || [],
        criticalDependencies: formData.criticalDependencies || [],
        highLoadPeriods: formData.highLoadPeriods || [],
        communicationTools: formData.communicationTools || [],
        taskManagementTools: formData.taskManagementTools || [],
        identifiedRisks: formData.identifiedRisks || [],
        anticipatedDifficultAreas: formData.anticipatedDifficultAreas || [],
        mitigationStrategies: formData.mitigationStrategies || [],
        involvedTeams: formData.involvedTeams || [],
        criticalExchanges: formData.criticalExchanges || [],
        
        // Campos complejos opcionales
        expectedTimeOverlap: formData.expectedTimeOverlap || { value: 4, unit: 'hours' },
        requiresSpecializedTools: formData.requiresSpecializedTools || { needed: false, description: '' },
        followUpFrequency: formData.followUpFrequency || {
          standups: { frequency: 'daily' },
          reviews: { frequency: 'weekly' },
          retrospectives: { frequency: 'biweekly' }
        },
        
        // Estado
        status: PROJECT_STATUS.DRAFT
      };

      if (isEditMode) {
        await updateProject(id, data);
      } else {
        const res = await createProject(data);
        const projectId = res.data?.data?._id;
        if (projectId) {
          navigate(`/projects/${projectId}`);
          return;
        }
      }

      alert('Project saved as draft successfully');
      navigate('/projects');
    } catch (error) {
      console.error('Error saving project:', error);
      alert(error.response?.data?.error || 'Error saving project');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (activateNow = false) => {
    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }

    if (!selectedOrg) {
      alert('Please select an organization');
      return;
    }

    try {
      setLoading(true);
      
      // Preparar datos asegurando todos los campos obligatorios
      const data = {
        organizationId: selectedOrg,
        
        // Campos obligatorios básicos
        projectName: formData.projectName,
        briefDescription: formData.briefDescription,
        estimatedStartDate: formData.estimatedStartDate,
        estimatedEndDate: formData.estimatedEndDate,
        expectedDuration: formData.expectedDuration,
        
        // Campos obligatorios de colaboración con defaults
        requiresSynchronousCommunication: formData.requiresSynchronousCommunication || 'no',
        realTimeCommunicationLevel: formData.realTimeCommunicationLevel || 'low',
        weeklyMeetingsCount: formData.weeklyMeetingsCount ?? 0,
        averageMeetingDuration: formData.averageMeetingDuration || { value: 0, unit: 'minutes' },
        
        // Campos obligatorios técnicos con defaults
        requiredExperienceLevel: formData.requiredExperienceLevel || 'mid',
        systemComplexity: formData.systemComplexity || 'medium',
        documentationLevel: formData.documentationLevel || 'partial',
        
        // Campo obligatorio de disponibilidad
        weeklyHoursPerMember: formData.weeklyHoursPerMember ?? 40,
        
        // Campo obligatorio de gestión
        managementMethod: formData.managementMethod || 'scrum',
        
        // Campos opcionales con defaults
        minimumLanguageProficiency: formData.minimumLanguageProficiency || 'B1',
        requiresAfterHoursAvailability: formData.requiresAfterHoursAvailability || 'no',
        distributedWorkExperienceLevel: formData.distributedWorkExperienceLevel || 'medium',
        culturalDiversityLevel: formData.culturalDiversityLevel || 'medium',
        documentationStandardization: formData.documentationStandardization || 'medium',
        informationFlow: formData.informationFlow || 'bidirectional',
        hasOnboardingProcesses: formData.hasOnboardingProcesses || 'partial',
        hasVersionControlAndCICD: formData.hasVersionControlAndCICD || 'partial',
        internalToolsFragmentation: formData.internalToolsFragmentation || 'medium',
        
        // Arrays opcionales
        requiredLanguages: formData.requiredLanguages || [],
        mainTechnologies: formData.mainTechnologies || [],
        teamRegions: formData.teamRegions || [],
        keyRoles: formData.keyRoles || [],
        criticalDependencies: formData.criticalDependencies || [],
        highLoadPeriods: formData.highLoadPeriods || [],
        communicationTools: formData.communicationTools || [],
        taskManagementTools: formData.taskManagementTools || [],
        identifiedRisks: formData.identifiedRisks || [],
        anticipatedDifficultAreas: formData.anticipatedDifficultAreas || [],
        mitigationStrategies: formData.mitigationStrategies || [],
        involvedTeams: formData.involvedTeams || [],
        criticalExchanges: formData.criticalExchanges || [],
        
        // Campos complejos opcionales
        expectedTimeOverlap: formData.expectedTimeOverlap || { value: 4, unit: 'hours' },
        requiresSpecializedTools: formData.requiresSpecializedTools || { needed: false, description: '' },
        followUpFrequency: formData.followUpFrequency || {
          standups: { frequency: 'daily' },
          reviews: { frequency: 'weekly' },
          retrospectives: { frequency: 'biweekly' }
        },
        
        // Estado
        status: PROJECT_STATUS.DRAFT
      };

      let projectId = id;
      
      if (isEditMode) {
        await updateProject(id, data);
      } else {
        const res = await createProject(data);
        projectId = res.data?.data?._id;
      }

      if (activateNow && projectId) {
        await activateProject(projectId);
        alert('Project created and activated successfully!');
      } else {
        alert(isEditMode ? 'Project updated successfully!' : 'Project created successfully!');
      }

      navigate(`/projects/${projectId}`);
    } catch (error) {
      console.error('Error submitting project:', error);
      alert(error.response?.data?.error || 'Error submitting project');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <div style={styles.container}>
        <p style={styles.loadingText}>Loading project...</p>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1GeneralInfo
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />
        );
      case 2:
        return (
          <Step2Collaboration
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />
        );
      case 3:
        return (
          <Step3Technical
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />
        );
      case 4:
        return (
          <Step4Geographic
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />
        );
      case 5:
        return (
          <Step5Roles
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />
        );
      case 6:
        return (
          <Step6Availability
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />
        );
      case 7:
        return (
          <Step7Coordination
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />
        );
      case 8:
        return (
          <Step8CollaborationIntensity
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />
        );
      case 9:
        return (
          <Step9Maturity
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <button style={styles.backButton} onClick={() => navigate('/projects')}>
            ← Back to Projects
          </button>
          <h1 style={styles.title}>
            {isEditMode ? 'Edit Project' : 'Create New Project'}
          </h1>
        </div>

        {/* Organization Selector */}
        {!isEditMode && (
          <div style={styles.orgSelector}>
            <label style={styles.label}>
              Select Organization <span style={styles.required}>*</span>
            </label>
            <select
              value={selectedOrg}
              onChange={(e) => setSelectedOrg(e.target.value)}
              style={styles.select}
            >
              {organizations.map(org => (
                <option key={org._id} value={org._id}>{org.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Progress Indicator */}
        <div style={styles.progress}>
          <div style={styles.progressBar}>
            <div 
              style={{
                ...styles.progressFill,
                width: `${(currentStep / FORM_STEPS.length) * 100}%`
              }}
            />
          </div>
          <div style={styles.progressText}>
            Step {currentStep} of {FORM_STEPS.length}
          </div>
        </div>

        {/* Steps Navigator */}
        <div style={styles.stepsNav}>
          {FORM_STEPS.map((step, idx) => (
            <div
              key={step.id}
              style={{
                ...styles.stepDot,
                ...(idx + 1 === currentStep && styles.stepDotActive),
                ...(idx + 1 < currentStep && styles.stepDotCompleted)
              }}
              onClick={() => setCurrentStep(idx + 1)}
            >
              {idx + 1}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div style={styles.formContent}>
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div style={styles.actions}>
          <div style={styles.leftActions}>
            {currentStep > 1 && (
              <SecondaryButton onClick={handlePrevious} leftIcon={<ArrowLeft size={16} />}>
                Previous
              </SecondaryButton>
            )}
          </div>
          
          <div style={styles.rightActions}>
            <SecondaryButton onClick={handleSaveDraft} disabled={loading} leftIcon={<Save size={16} />}>
              Save as Draft
            </SecondaryButton>
            
            {currentStep < FORM_STEPS.length ? (
              <PrimaryButton onClick={handleNext} rightIcon={<ArrowRight size={16} />}>
                Next
              </PrimaryButton>
            ) : (
              <>
                <PrimaryButton 
                  onClick={() => handleSubmit(false)}
                  disabled={loading}
                  leftIcon={<CheckCircle size={18} />}
                >
                  {isEditMode ? 'Update Project' : 'Create Project'}
                </PrimaryButton>
                <PrimaryButton 
                  onClick={() => handleSubmit(true)}
                  disabled={loading}
                  style={{ background: '#10B981' }}
                  leftIcon={<CheckCircle size={18} />}
                >
                  {isEditMode ? 'Update & Activate' : 'Create & Activate'}
                </PrimaryButton>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '100px 20px 40px 20px'
  },
  content: {
    background: 'white',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  header: {
    marginBottom: '32px'
  },
  backButton: {
    background: 'none',
    border: 'none',
    color: '#6B7280',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '16px',
    padding: '8px 0',
    transition: 'color 0.2s'
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#111',
    margin: 0
  },
  orgSelector: {
    marginBottom: '32px',
    padding: '20px',
    background: '#F9FAFB',
    borderRadius: '12px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#111',
    marginBottom: '8px',
    display: 'block'
  },
  required: {
    color: '#EF4444'
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #E5E7EB',
    borderRadius: '10px',
    fontSize: '15px',
    outline: 'none',
    cursor: 'pointer',
    background: 'white'
  },
  progress: {
    marginBottom: '24px'
  },
  progressBar: {
    width: '100%',
    height: '8px',
    background: '#E5E7EB',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '8px'
  },
  progressFill: {
    height: '100%',
    background: '#111',
    transition: 'width 0.3s ease'
  },
  progressText: {
    fontSize: '13px',
    color: '#6B7280',
    fontWeight: '600',
    textAlign: 'center'
  },
  stepsNav: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '40px',
    flexWrap: 'wrap'
  },
  stepDot: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: '2px solid #E5E7EB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '600',
    color: '#9CA3AF',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  stepDotActive: {
    borderColor: '#111',
    background: '#111',
    color: 'white'
  },
  stepDotCompleted: {
    borderColor: '#10B981',
    background: '#10B981',
    color: 'white'
  },
  formContent: {
    marginBottom: '40px'
  },
  simplifiedStep: {
    padding: '40px',
    background: '#F9FAFB',
    borderRadius: '12px',
    textAlign: 'center'
  },
  stepTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111',
    marginBottom: '12px'
  },
  infoText: {
    fontSize: '15px',
    color: '#6B7280',
    lineHeight: '1.6'
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    paddingTop: '32px',
    borderTop: '2px solid #E5E7EB'
  },
  leftActions: {
    display: 'flex',
    gap: '12px'
  },
  rightActions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  loadingText: {
    textAlign: 'center',
    color: '#6B7280',
    padding: '60px'
  }
};
