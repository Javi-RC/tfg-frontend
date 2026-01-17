import {
  formatText,
  capitalize,
  toTitleCase,
  truncate,
  slugify,
  formatBoolean,
  getInitials,
} from './stringHelpers';

describe('stringHelpers', () => {
  describe('formatText', () => {
    it('returns string value as-is', () => {
      expect(formatText('Hello World')).toBe('Hello World');
    });

    it('returns fallback for null', () => {
      expect(formatText(null)).toBe('—');
    });

    it('returns fallback for undefined', () => {
      expect(formatText(undefined)).toBe('—');
    });

    it('returns fallback for empty string', () => {
      expect(formatText('')).toBe('—');
    });

    it('returns fallback for whitespace-only string', () => {
      expect(formatText('   ')).toBe('—');
    });

    it('converts number to string', () => {
      expect(formatText(123)).toBe('123');
    });

    it('uses custom fallback', () => {
      expect(formatText(null, 'N/A')).toBe('N/A');
    });
  });

  describe('capitalize', () => {
    it('capitalizes first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('handles already capitalized string', () => {
      expect(capitalize('Hello')).toBe('Hello');
    });

    it('returns empty string for null', () => {
      expect(capitalize(null)).toBe('');
    });

    it('returns empty string for empty string', () => {
      expect(capitalize('')).toBe('');
    });

    it('capitalizes single character', () => {
      expect(capitalize('a')).toBe('A');
    });
  });

  describe('toTitleCase', () => {
    it('converts to title case', () => {
      expect(toTitleCase('hello world')).toBe('Hello World');
    });

    it('handles already title case string', () => {
      expect(toTitleCase('Hello World')).toBe('Hello World');
    });

    it('handles all caps string', () => {
      expect(toTitleCase('HELLO WORLD')).toBe('Hello World');
    });

    it('returns empty string for null', () => {
      expect(toTitleCase(null)).toBe('');
    });

    it('handles single word', () => {
      expect(toTitleCase('hello')).toBe('Hello');
    });
  });

  describe('truncate', () => {
    it('truncates long text', () => {
      expect(truncate('Hello World', 5)).toBe('He...');
    });

    it('does not truncate short text', () => {
      expect(truncate('Hello', 10)).toBe('Hello');
    });

    it('uses custom suffix', () => {
      expect(truncate('Hello World', 5, '…')).toBe('Hell…');
    });

    it('returns empty string for null', () => {
      expect(truncate(null, 10)).toBe('');
    });

    it('handles exact length match', () => {
      expect(truncate('Hello', 5)).toBe('Hello');
    });

    it('trims whitespace before adding suffix', () => {
      expect(truncate('Hello World', 8)).toBe('Hello...');
    });
  });

  describe('slugify', () => {
    it('creates URL-friendly slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
    });

    it('removes special characters', () => {
      expect(slugify('Hello@World!')).toBe('helloworld');
    });

    it('handles multiple spaces', () => {
      expect(slugify('Hello   World')).toBe('hello-world');
    });

    it('removes leading and trailing hyphens', () => {
      expect(slugify('  Hello World  ')).toBe('hello-world');
    });

    it('returns empty string for null', () => {
      expect(slugify(null)).toBe('');
    });

    it('handles underscores', () => {
      expect(slugify('hello_world')).toBe('hello-world');
    });
  });

  describe('formatBoolean', () => {
    it('returns "Yes" for true', () => {
      expect(formatBoolean(true)).toBe('Yes');
    });

    it('returns "No" for false', () => {
      expect(formatBoolean(false)).toBe('No');
    });

    it('returns fallback for null', () => {
      expect(formatBoolean(null)).toBe('—');
    });

    it('returns fallback for undefined', () => {
      expect(formatBoolean(undefined)).toBe('—');
    });

    it('returns fallback for non-boolean values', () => {
      expect(formatBoolean('true')).toBe('—');
      expect(formatBoolean(1)).toBe('—');
    });
  });

  describe('getInitials', () => {
    it('extracts initials from full name', () => {
      expect(getInitials('John Doe')).toBe('JD');
    });

    it('handles single name', () => {
      expect(getInitials('John')).toBe('J');
    });

    it('limits to maxInitials', () => {
      expect(getInitials('John Michael Doe', 2)).toBe('JM');
    });

    it('handles three names with default max', () => {
      expect(getInitials('John Michael Doe')).toBe('JM');
    });

    it('returns "?" for null', () => {
      expect(getInitials(null)).toBe('?');
    });

    it('returns "?" for empty string', () => {
      expect(getInitials('')).toBe('?');
    });

    it('handles names with extra spaces', () => {
      expect(getInitials('John   Doe')).toBe('JD');
    });

    it('uppercases initials', () => {
      expect(getInitials('john doe')).toBe('JD');
    });
  });
});
