import { normalizeCvSkills } from './skillsMatch';

describe('skillsMatch', () => {
  describe('normalizeCvSkills', () => {
    it('returns empty array for null CV', () => {
      expect(normalizeCvSkills(null)).toEqual([]);
    });

    it('returns empty array for undefined CV', () => {
      expect(normalizeCvSkills(undefined)).toEqual([]);
    });

    it('returns empty array for CV without skills', () => {
      expect(normalizeCvSkills({})).toEqual([]);
    });

    it('normalizes legacy array format with objects', () => {
      const cv = {
        skills: [
          { technology: 'JavaScript', proficiency: 'advanced', category: 'technical' },
          { technology: 'React', proficiency: 'intermediate', category: 'technical' },
        ],
      };
      const result = normalizeCvSkills(cv);
      expect(result).toHaveLength(2);
      expect(result[0].technology).toBe('JavaScript');
      expect(result[0].proficiency).toBe('avanzado');
      expect(result[0].category).toBe('technical');
    });

    it('normalizes legacy array format with strings', () => {
      const cv = {
        skills: ['JavaScript', 'React', 'Node.js'],
      };
      const result = normalizeCvSkills(cv);
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({
        technology: 'JavaScript',
        proficiency: 'intermedio',
        category: 'general',
      });
    });

    it('normalizes new format with technical and soft skills', () => {
      const cv = {
        skills: {
          technical: [
            { name: 'JavaScript', level: 'Advanced' },
            { name: 'React', level: 'Intermediate' },
          ],
          soft: [
            { name: 'Communication', level: 'Expert' },
            { name: 'Leadership', level: 'Advanced' },
          ],
        },
      };
      const result = normalizeCvSkills(cv);
      expect(result).toHaveLength(4);

      const jsSkill = result.find((s) => s.technology === 'JavaScript');
      expect(jsSkill.proficiency).toBe('avanzado');
      expect(jsSkill.category).toBe('technical');

      const commSkill = result.find((s) => s.technology === 'Communication');
      expect(commSkill.proficiency).toBe('experto');
      expect(commSkill.category).toBe('soft');
    });

    it('handles skills with name property in legacy format', () => {
      const cv = {
        skills: [{ name: 'Python', level: 'Expert', category: 'programming' }],
      };
      const result = normalizeCvSkills(cv);
      expect(result[0].technology).toBe('Python');
      expect(result[0].proficiency).toBe('experto');
    });

    it('normalizes proficiency levels correctly - Spanish', () => {
      const cv = {
        skills: [
          { technology: 'Skill1', proficiency: 'básico' },
          { technology: 'Skill2', proficiency: 'intermedio' },
          { technology: 'Skill3', proficiency: 'avanzado' },
          { technology: 'Skill4', proficiency: 'experto' },
        ],
      };
      const result = normalizeCvSkills(cv);
      expect(result[0].proficiency).toBe('basico');
      expect(result[1].proficiency).toBe('intermedio');
      expect(result[2].proficiency).toBe('avanzado');
      expect(result[3].proficiency).toBe('experto');
    });

    it('normalizes proficiency levels correctly - English', () => {
      const cv = {
        skills: [
          { technology: 'Skill1', proficiency: 'beginner' },
          { technology: 'Skill2', proficiency: 'intermediate' },
          { technology: 'Skill3', proficiency: 'advanced' },
          { technology: 'Skill4', proficiency: 'expert' },
        ],
      };
      const result = normalizeCvSkills(cv);
      expect(result[0].proficiency).toBe('basico');
      expect(result[1].proficiency).toBe('intermedio');
      expect(result[2].proficiency).toBe('avanzado');
      expect(result[3].proficiency).toBe('experto');
    });

    it('defaults to intermedio for unknown proficiency', () => {
      const cv = {
        skills: [{ technology: 'JavaScript', proficiency: '' }],
      };
      const result = normalizeCvSkills(cv);
      expect(result[0].proficiency).toBe('intermedio');
    });

    it('filters out skills without technology name', () => {
      const cv = {
        skills: [
          { technology: 'JavaScript', proficiency: 'advanced' },
          { technology: '', proficiency: 'advanced' },
          { technology: null, proficiency: 'advanced' },
        ],
      };
      const result = normalizeCvSkills(cv);
      expect(result).toHaveLength(1);
      expect(result[0].technology).toBe('JavaScript');
    });

    it('handles mixed technical and soft skills in new format', () => {
      const cv = {
        skills: {
          technical: ['JavaScript', 'Python'],
          soft: ['Communication'],
        },
      };
      const result = normalizeCvSkills(cv);
      expect(result).toHaveLength(3);
      expect(result.filter((s) => s.category === 'technical')).toHaveLength(2);
      expect(result.filter((s) => s.category === 'soft')).toHaveLength(1);
    });

    it('handles empty technical and soft arrays', () => {
      const cv = {
        skills: {
          technical: [],
          soft: [],
        },
      };
      const result = normalizeCvSkills(cv);
      expect(result).toEqual([]);
    });

    it('handles proficiency case insensitivity', () => {
      const cv = {
        skills: [
          { technology: 'Skill1', proficiency: 'ADVANCED' },
          { technology: 'Skill2', proficiency: 'Advanced' },
          { technology: 'Skill3', proficiency: 'advanced' },
        ],
      };
      const result = normalizeCvSkills(cv);
      result.forEach((skill) => {
        expect(skill.proficiency).toBe('avanzado');
      });
    });

    it('handles junior and senior as proficiency levels', () => {
      const cv = {
        skills: [
          { technology: 'Skill1', proficiency: 'junior' },
          { technology: 'Skill2', proficiency: 'senior' },
        ],
      };
      const result = normalizeCvSkills(cv);
      expect(result[0].proficiency).toBe('basico');
      expect(result[1].proficiency).toBe('avanzado');
    });
  });
});
