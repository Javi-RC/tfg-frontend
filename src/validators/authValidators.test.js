import {
  EMAIL_REGEX,
  MIN_PASSWORD_LENGTH,
  MIN_USERNAME_LENGTH,
  validateEmail,
  validatePassword,
  validateUsername,
  validateRole,
  validateLoginForm,
  getPasswordStrengthRules,
} from './authValidators';

describe('authValidators', () => {
  describe('validateEmail', () => {
    it('validates correct email', () => {
      const result = validateEmail('test@example.com');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('rejects empty email', () => {
      const result = validateEmail('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Email is required');
    });

    it('rejects email without @', () => {
      const result = validateEmail('testexample.com');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('rejects email without domain', () => {
      const result = validateEmail('test@');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('rejects email without TLD', () => {
      const result = validateEmail('test@example');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('handles whitespace-only email', () => {
      const result = validateEmail('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Email is required');
    });

    it('validates complex email addresses', () => {
      expect(validateEmail('user+tag@example.co.uk').isValid).toBe(true);
      expect(validateEmail('first.last@example.com').isValid).toBe(true);
    });
  });

  describe('validatePassword', () => {
    it('validates correct password', () => {
      const result = validatePassword('password123');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('rejects empty password', () => {
      const result = validatePassword('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password is required');
    });

    it('rejects password shorter than minimum length', () => {
      const result = validatePassword('12345');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
    });

    it('accepts password at minimum length', () => {
      const result = validatePassword('123456');
      expect(result.isValid).toBe(true);
    });

    it('accepts long password', () => {
      const result = validatePassword('verylongpassword123456789');
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateUsername', () => {
    it('validates correct username', () => {
      const result = validateUsername('john');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('rejects empty username', () => {
      const result = validateUsername('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(`Username must be at least ${MIN_USERNAME_LENGTH} characters`);
    });

    it('rejects username shorter than minimum', () => {
      const result = validateUsername('ab');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(`Username must be at least ${MIN_USERNAME_LENGTH} characters`);
    });

    it('accepts username at minimum length', () => {
      const result = validateUsername('abc');
      expect(result.isValid).toBe(true);
    });

    it('handles whitespace-only username', () => {
      const result = validateUsername('   ');
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateRole', () => {
    it('validates provided role', () => {
      const result = validateRole('admin');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('rejects empty role', () => {
      const result = validateRole('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please indicate what type of user you are');
    });

    it('rejects null role', () => {
      const result = validateRole(null);
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateLoginForm', () => {
    it('validates correct form data', () => {
      const formData = {
        email: 'test@example.com',
        password: 'password123',
      };
      const result = validateLoginForm(formData);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('returns email error first if both invalid', () => {
      const formData = {
        email: 'invalid',
        password: '123',
      };
      const result = validateLoginForm(formData);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('returns password error if email valid', () => {
      const formData = {
        email: 'test@example.com',
        password: '123',
      };
      const result = validateLoginForm(formData);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
    });
  });

  describe('getPasswordStrengthRules', () => {
    it('checks all rules for strong password', () => {
      const rules = getPasswordStrengthRules('StrongPass123!');
      expect(rules.length).toBe(true);
      expect(rules.uppercase).toBe(true);
      expect(rules.lowercase).toBe(true);
      expect(rules.number).toBe(true);
      expect(rules.special).toBe(true);
    });

    it('detects missing uppercase', () => {
      const rules = getPasswordStrengthRules('weakpass123!');
      expect(rules.uppercase).toBe(false);
    });

    it('detects missing lowercase', () => {
      const rules = getPasswordStrengthRules('WEAKPASS123!');
      expect(rules.lowercase).toBe(false);
    });

    it('detects missing numbers', () => {
      const rules = getPasswordStrengthRules('WeakPass!');
      expect(rules.number).toBe(false);
    });

    it('detects missing special characters', () => {
      const rules = getPasswordStrengthRules('WeakPass123');
      expect(rules.special).toBe(false);
    });

    it('detects insufficient length', () => {
      const rules = getPasswordStrengthRules('Pass1!');
      expect(rules.length).toBe(false);
    });
  });

  describe('constants', () => {
    it('exports EMAIL_REGEX', () => {
      expect(EMAIL_REGEX).toBeInstanceOf(RegExp);
    });

    it('exports MIN_PASSWORD_LENGTH', () => {
      expect(MIN_PASSWORD_LENGTH).toBe(6);
    });

    it('exports MIN_USERNAME_LENGTH', () => {
      expect(MIN_USERNAME_LENGTH).toBe(3);
    });
  });
});
