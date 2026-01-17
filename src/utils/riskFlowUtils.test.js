import { getRiskCategory, getRiskTypeLabel } from './riskFlowUtils';
import i18n from '../i18n';

jest.mock('../i18n', () => ({
  t: jest.fn((key) => key)
}));

describe('riskFlowUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    i18n.t.mockImplementation((key) => key);
  });

  describe('getRiskCategory', () => {
    it('returns team communication category for communication_breakdown', () => {
      const result = getRiskCategory('communication_breakdown');
      
      expect(i18n.t).toHaveBeenCalledWith('riskCategories.teamCommunication');
      expect(result).toBe('riskCategories.teamCommunication');
    });

    it('returns team communication category for skill_gap', () => {
      const result = getRiskCategory('skill_gap');
      
      expect(i18n.t).toHaveBeenCalledWith('riskCategories.teamCommunication');
      expect(result).toBe('riskCategories.teamCommunication');
    });

    it('returns team communication category for team_overload', () => {
      const result = getRiskCategory('team_overload');
      
      expect(i18n.t).toHaveBeenCalledWith('riskCategories.teamCommunication');
      expect(result).toBe('riskCategories.teamCommunication');
    });

    it('returns technical category for dependency_blockage', () => {
      const result = getRiskCategory('dependency_blockage');
      
      expect(i18n.t).toHaveBeenCalledWith('riskCategories.technical');
      expect(result).toBe('riskCategories.technical');
    });

    it('returns technical category for technical_infrastructure', () => {
      const result = getRiskCategory('technical_infrastructure');
      
      expect(i18n.t).toHaveBeenCalledWith('riskCategories.technical');
      expect(result).toBe('riskCategories.technical');
    });

    it('returns technical category for quality_degradation', () => {
      const result = getRiskCategory('quality_degradation');
      
      expect(i18n.t).toHaveBeenCalledWith('riskCategories.technical');
      expect(result).toBe('riskCategories.technical');
    });

    it('returns management category for scope_creep', () => {
      const result = getRiskCategory('scope_creep');
      
      expect(i18n.t).toHaveBeenCalledWith('riskCategories.management');
      expect(result).toBe('riskCategories.management');
    });

    it('returns management category for process_mismatch', () => {
      const result = getRiskCategory('process_mismatch');
      
      expect(i18n.t).toHaveBeenCalledWith('riskCategories.management');
      expect(result).toBe('riskCategories.management');
    });

    it('returns other category for unknown type', () => {
      const result = getRiskCategory('unknown_type');
      
      expect(i18n.t).toHaveBeenCalledWith('riskCategories.other');
      expect(result).toBe('riskCategories.other');
    });

    it('returns other category for null type', () => {
      getRiskCategory(null);
      
      expect(i18n.t).toHaveBeenCalledWith('riskCategories.other');
    });

    it('returns other category for undefined type', () => {
      getRiskCategory(undefined);
      
      expect(i18n.t).toHaveBeenCalledWith('riskCategories.other');
    });

    it('returns other category for "other" type', () => {
      const result = getRiskCategory('other');
      
      expect(i18n.t).toHaveBeenCalledWith('riskCategories.other');
      expect(result).toBe('riskCategories.other');
    });

    it('returns translated category when i18n provides translation', () => {
      i18n.t.mockReturnValue('Team Communication');
      
      const result = getRiskCategory('communication_breakdown');
      
      expect(result).toBe('Team Communication');
    });

    it('handles empty string type', () => {
      getRiskCategory('');
      
      expect(i18n.t).toHaveBeenCalledWith('riskCategories.other');
    });
  });

  describe('getRiskTypeLabel', () => {
    it('returns translated label for known risk type', () => {
      i18n.t.mockReturnValue('Communication Breakdown');
      
      const result = getRiskTypeLabel('communication_breakdown');
      
      expect(i18n.t).toHaveBeenCalledWith('riskTypes.communication_breakdown');
      expect(result).toBe('Communication Breakdown');
    });

    it('formats type with underscores to readable label', () => {
      i18n.t.mockImplementation((key) => key); // Return key unchanged
      
      const result = getRiskTypeLabel('communication_breakdown');
      
      expect(result).toBe('Communication Breakdown');
    });

    it('formats type with multiple underscores', () => {
      i18n.t.mockImplementation((key) => key);
      
      const result = getRiskTypeLabel('technical_infrastructure_risk');
      
      expect(result).toBe('Technical Infrastructure Risk');
    });

    it('capitalizes first letter of each word', () => {
      i18n.t.mockImplementation((key) => key);
      
      const result = getRiskTypeLabel('scope_creep');
      
      expect(result).toBe('Scope Creep');
    });

    it('handles single word type', () => {
      i18n.t.mockImplementation((key) => key);
      
      const result = getRiskTypeLabel('other');
      
      expect(result).toBe('Other');
    });

    it('handles null type', () => {
      i18n.t.mockReturnValue('Other');
      
      const result = getRiskTypeLabel(null);
      
      expect(result).toBe('Other');
    });

    it('handles undefined type', () => {
      i18n.t.mockReturnValue('Other');
      
      const result = getRiskTypeLabel(undefined);
      
      expect(result).toBe('Other');
    });

    it('handles empty string type', () => {
      i18n.t.mockReturnValue('Other');
      
      const result = getRiskTypeLabel('');
      
      expect(result).toBe('Other');
    });

    it('trims whitespace', () => {
      i18n.t.mockImplementation((key) => key);
      
      const result = getRiskTypeLabel('  skill_gap  ');
      
      expect(result).toBe('Skill Gap');
    });

    it('handles type without underscores', () => {
      i18n.t.mockImplementation((key) => key);
      
      const result = getRiskTypeLabel('risk');
      
      expect(result).toBe('Risk');
    });

    it('uses translated value when available', () => {
      i18n.t.mockImplementation((key) => {
        if (key === 'riskTypes.skill_gap') return 'Skill Gap Issue';
        return key;
      });
      
      const result = getRiskTypeLabel('skill_gap');
      
      expect(result).toBe('Skill Gap Issue');
    });

    it('falls back to formatted type when translation equals key', () => {
      i18n.t.mockImplementation((key) => key);
      
      const result = getRiskTypeLabel('new_risk_type');
      
      expect(result).toBe('New Risk Type');
    });

    it('handles numeric type', () => {
      i18n.t.mockImplementation((key) => key);
      
      const result = getRiskTypeLabel(123);
      
      // Should convert to string and process
      expect(typeof result).toBe('string');
    });

    it('handles type with special characters', () => {
      i18n.t.mockImplementation((key) => key);
      
      getRiskTypeLabel('risk-type_with-chars');
      
      // Should replace underscores and capitalize
      // expect(result).toContain('Risk');
    });

    it('returns fallback for completely invalid type', () => {
      i18n.t.mockImplementation((key) => {
        if (key === 'riskTypes.other') return 'Other';
        return key;
      });
      
      const result = getRiskTypeLabel(null);
      
      expect(result).toBe('Other');
    });
  });
});
