import {
  formatDate,
  formatTime,
  formatDateTime,
  formatDateForInput,
  isValidDate,
} from './dateHelpers';

describe('dateHelpers', () => {
  describe('formatDate', () => {
    it('formats a valid date object', () => {
      const date = new Date('2024-03-15');
      const result = formatDate(date);
      expect(result).toMatch(/3\/15\/2024|Mar 15, 2024/);
    });

    it('formats a valid date string', () => {
      const result = formatDate('2024-03-15');
      expect(result).toMatch(/3\/15\/2024|Mar 15, 2024/);
    });

    it('returns fallback for null', () => {
      expect(formatDate(null)).toBe('—');
    });

    it('returns fallback for undefined', () => {
      expect(formatDate(undefined)).toBe('—');
    });

    it('returns fallback for invalid date', () => {
      expect(formatDate('invalid')).toBe('—');
    });

    it('accepts custom formatting options', () => {
      const date = new Date('2024-03-15');
      const result = formatDate(date, { year: 'numeric', month: 'long' });
      expect(result).toContain('March');
      expect(result).toContain('2024');
    });
  });

  describe('formatTime', () => {
    it('returns HH:mm string as-is', () => {
      expect(formatTime('14:30')).toBe('14:30');
    });

    it('formats a date object to time', () => {
      const date = new Date('2024-03-15T14:30:00');
      const result = formatTime(date);
      expect(result).toMatch(/2:30 PM|14:30/i);
    });

    it('returns fallback for null', () => {
      expect(formatTime(null)).toBe('—');
    });

    it('returns fallback for invalid time', () => {
      expect(formatTime('invalid')).toBe('—');
    });

    it('accepts custom formatting options', () => {
      const date = new Date('2024-03-15T14:30:00');
      const result = formatTime(date, { hour12: false });
      expect(result).toMatch(/14:30/);
    });
  });

  describe('formatDateTime', () => {
    it('formats a valid datetime', () => {
      const date = new Date('2024-03-15T14:30:00');
      const result = formatDateTime(date);
      expect(result).toMatch(/Mar 15, 2024/);
      expect(result).toMatch(/2:30 PM|14:30/i);
    });

    it('returns fallback for null', () => {
      expect(formatDateTime(null)).toBe('—');
    });

    it('returns fallback for invalid datetime', () => {
      expect(formatDateTime('invalid')).toBe('—');
    });
  });

  describe('formatDateForInput', () => {
    it('formats date to YYYY-MM-DD', () => {
      const date = new Date('2024-03-15');
      expect(formatDateForInput(date)).toBe('2024-03-15');
    });

    it('returns empty string for null', () => {
      expect(formatDateForInput(null)).toBe('');
    });

    it('returns empty string for invalid date', () => {
      expect(formatDateForInput('invalid')).toBe('');
    });

    it('handles date strings correctly', () => {
      expect(formatDateForInput('2024-03-15')).toBe('2024-03-15');
    });
  });

  describe('isValidDate', () => {
    it('returns true for valid date object', () => {
      expect(isValidDate(new Date('2024-03-15'))).toBe(true);
    });

    it('returns true for valid date string', () => {
      expect(isValidDate('2024-03-15')).toBe(true);
    });

    it('returns false for null', () => {
      expect(isValidDate(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isValidDate(undefined)).toBe(false);
    });

    it('returns false for invalid date string', () => {
      expect(isValidDate('invalid')).toBe(false);
    });

    it('returns false for invalid date object', () => {
      expect(isValidDate(new Date('invalid'))).toBe(false);
    });
  });
});
