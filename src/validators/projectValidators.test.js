import {
  validateProjectName,
  validateProjectDescription,
  validateDateRange,
  validateOrganization,
  validateTeamSize,
  validateStep1,
  validateStep2,
  validateStep3,
} from './projectValidators';

describe('projectValidators', () => {
  describe('validateProjectName', () => {
    it('validates correct project name', () => {
      const result = validateProjectName('My Project');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('rejects project name shorter than 3 characters', () => {
      const result = validateProjectName('AB');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Project name must be at least 3 characters');
    });

    it('rejects empty project name', () => {
      const result = validateProjectName('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Project name must be at least 3 characters');
    });

    it('rejects project name longer than 100 characters', () => {
      const longName = 'A'.repeat(101);
      const result = validateProjectName(longName);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Project name must not exceed 100 characters');
    });

    it('accepts project name at minimum length', () => {
      const result = validateProjectName('ABC');
      expect(result.isValid).toBe(true);
    });

    it('accepts project name at maximum length', () => {
      const maxName = 'A'.repeat(100);
      const result = validateProjectName(maxName);
      expect(result.isValid).toBe(true);
    });

    it('handles whitespace-only input', () => {
      const result = validateProjectName('   ');
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateProjectDescription', () => {
    it('validates correct description', () => {
      const result = validateProjectDescription('This is a valid description');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('rejects description shorter than 10 characters', () => {
      const result = validateProjectDescription('Short');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Description must be at least 10 characters');
    });

    it('rejects empty description', () => {
      const result = validateProjectDescription('');
      expect(result.isValid).toBe(false);
    });

    it('accepts description at minimum length', () => {
      const result = validateProjectDescription('1234567890');
      expect(result.isValid).toBe(true);
    });

    it('handles whitespace-only description', () => {
      const result = validateProjectDescription('     ');
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateDateRange', () => {
    it('validates correct date range', () => {
      const result = validateDateRange('2024-01-01', '2024-12-31');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('rejects missing start date', () => {
      const result = validateDateRange('', '2024-12-31');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Start date is required');
    });

    it('rejects missing end date', () => {
      const result = validateDateRange('2024-01-01', '');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('End date is required');
    });

    it('rejects end date before start date', () => {
      const result = validateDateRange('2024-12-31', '2024-01-01');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('End date must be after start date');
    });

    it('rejects equal start and end dates', () => {
      const result = validateDateRange('2024-01-01', '2024-01-01');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('End date must be after start date');
    });

    it('accepts dates one day apart', () => {
      const result = validateDateRange('2024-01-01', '2024-01-02');
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateOrganization', () => {
    it('validates correct organization ID', () => {
      const result = validateOrganization('org-123');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('rejects empty organization ID', () => {
      const result = validateOrganization('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please select an organization');
    });

    it('rejects null organization ID', () => {
      const result = validateOrganization(null);
      expect(result.isValid).toBe(false);
    });

    it('rejects undefined organization ID', () => {
      const result = validateOrganization(undefined);
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateTeamSize', () => {
    it('validates correct team size', () => {
      const result = validateTeamSize(5);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('validates minimum team size', () => {
      const result = validateTeamSize(1);
      expect(result.isValid).toBe(true);
    });

    it('validates maximum team size', () => {
      const result = validateTeamSize(100);
      expect(result.isValid).toBe(true);
    });

    it('rejects team size below minimum', () => {
      const result = validateTeamSize(0);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Team size must be between 1 and 100');
    });

    it('rejects team size above maximum', () => {
      const result = validateTeamSize(101);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Team size must be between 1 and 100');
    });

    it('rejects empty team size', () => {
      const result = validateTeamSize('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Team size is required');
    });

    it('rejects null team size', () => {
      const result = validateTeamSize(null);
      expect(result.isValid).toBe(false);
    });

    it('rejects non-numeric team size', () => {
      const result = validateTeamSize('abc');
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateStep1', () => {
    const validFormData = {
      projectName: 'Valid Project',
      briefDescription: 'This is a valid project description',
      estimatedStartDate: '2024-01-01',
      estimatedEndDate: '2024-12-31',
      teamSize: 5
    };

    it('validates correct step 1 data', () => {
      const result = validateStep1(validFormData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('returns errors for invalid project name', () => {
      const formData = { ...validFormData, projectName: 'AB' };
      const result = validateStep1(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors.projectName).toBeDefined();
    });

    it('returns errors for invalid description', () => {
      const formData = { ...validFormData, briefDescription: 'Short' };
      const result = validateStep1(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors.briefDescription).toBeDefined();
    });

    it('returns errors for invalid team size', () => {
      const formData = { ...validFormData, teamSize: 0 };
      const result = validateStep1(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors.teamSize).toBeDefined();
    });

    it('returns errors for team size above maximum', () => {
      const formData = { ...validFormData, teamSize: 101 };
      const result = validateStep1(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors.teamSize).toBeDefined();
    });

    it('returns errors for invalid date range', () => {
      const formData = {
        ...validFormData,
        estimatedStartDate: '2024-12-31',
        estimatedEndDate: '2024-01-01'
      };
      const result = validateStep1(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors.dateRange).toBeDefined();
    });

    it('returns multiple errors for multiple invalid fields', () => {
      const formData = {
        projectName: 'AB',
        briefDescription: 'Short',
        estimatedStartDate: '',
        estimatedEndDate: '',
        teamSize: 0
      };
      const result = validateStep1(formData);
      expect(result.isValid).toBe(false);
      expect(Object.keys(result.errors).length).toBeGreaterThan(1);
    });
  });

  describe('validateStep2', () => {
    const validFormData = {
      requiresSynchronousCommunication: true,
      realTimeCommunicationLevel: 'high',
      weeklyMeetingsCount: 3,
      languages: ['English', 'Spanish']
    };

    it('validates correct step 2 data', () => {
      const result = validateStep2(validFormData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('returns error for missing synchronous communication', () => {
      const formData = { ...validFormData, requiresSynchronousCommunication: undefined };
      const result = validateStep2(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors.requiresSynchronousCommunication).toBeDefined();
    });

    it('returns error for missing real-time communication level', () => {
      const formData = { ...validFormData, realTimeCommunicationLevel: null };
      const result = validateStep2(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors.realTimeCommunicationLevel).toBeDefined();
    });

    it('returns error for missing weekly meetings count', () => {
      const formData = { ...validFormData, weeklyMeetingsCount: null };
      const result = validateStep2(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors.weeklyMeetingsCount).toBeDefined();
    });

    it('accepts zero weekly meetings', () => {
      const formData = { ...validFormData, weeklyMeetingsCount: 0 };
      const result = validateStep2(formData);
      expect(result.isValid).toBe(true);
    });

    it('accepts missing languages (optional)', () => {
      const formData = { ...validFormData, languages: [] };
      const result = validateStep2(formData);
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateStep3', () => {
    const validFormData = {
      mainTechnologies: ['JavaScript', 'React'],
      requiredExperienceLevel: 'intermediate'
    };

    it('validates correct step 3 data', () => {
      const result = validateStep3(validFormData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('returns error for empty technologies', () => {
      const formData = { ...validFormData, mainTechnologies: [] };
      const result = validateStep3(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors.mainTechnologies).toBe('At least one technology is required');
    });

    it('returns error for missing technologies', () => {
      const formData = { ...validFormData, mainTechnologies: null };
      const result = validateStep3(formData);
      expect(result.isValid).toBe(false);
    });

    it('returns error for missing experience level', () => {
      const formData = { ...validFormData, requiredExperienceLevel: null };
      const result = validateStep3(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors.requiredExperienceLevel).toBeDefined();
    });

    it('accepts single technology', () => {
      const formData = { ...validFormData, mainTechnologies: ['JavaScript'] };
      const result = validateStep3(formData);
      expect(result.isValid).toBe(true);
    });
  });
});
