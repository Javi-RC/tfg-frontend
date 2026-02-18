import { useState } from 'react';
import { register as apiRegister, resendConfirmation } from '../api/auth';
import i18n from '../i18n';
import {
  validateRegistrationStep1,
  validateRegistrationStep2,
  validateRegistrationStep3,
  getPasswordStrengthRules,
  isPasswordStrong
} from '../validators/authValidators';

/**
 * Custom hook for Registration business logic
 * Manages multi-step registration flow
 */
export function useRegister() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    role: '',
    password: '',
    confirm: ''
  });
  
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  /**
   * Get password strength rules for current password
   */
  const passwordRules = getPasswordStrengthRules(formData.password);
  const isPasswordValid = isPasswordStrong(formData.password);

  /**
   * Update a form field
   */
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Validate current step
   */
  const validateCurrentStep = () => {
    setError('');
    
    switch (step) {
      case 1: {
        const validation = validateRegistrationStep1(formData);
        if (!validation.isValid) {
          setError(validation.error);
          return false;
        }
        return true;
      }
      
      case 2: {
        const validation = validateRegistrationStep2(formData);
        if (!validation.isValid) {
          setError(validation.error);
          return false;
        }
        return true;
      }
      
      case 3: {
        const validation = validateRegistrationStep3(formData);
        if (!validation.isValid) {
          setError(validation.error);
          return false;
        }
        return true;
      }
      
      default:
        return true;
    }
  };

  /**
   * Handle next step or final submission
   */
  const handleNext = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    // If not on final step, just move forward
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    // Final step - submit registration
    try {
      setLoading(true);
      const payload = {
        email: formData.email,
        username: formData.username,
        role: formData.role,
        password: formData.password,
        name: formData.username
      };
      
      const res = await apiRegister(payload);
      setRegistered(true);
      setResendMessage(res.data?.message || i18n.t('auth.register.accountCreated'));
    } catch (err) {
      setError(err.response?.data?.error || i18n.t('auth.register.createError'));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Go back to previous step
   */
  const handleBack = () => {
    setError('');
    if (step > 1) {
      setStep(step - 1);
    }
  };

  /**
   * Handle Enter key press
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleNext();
    }
  };

  /**
   * Resend confirmation email
   */
  const handleResend = async () => {
    setResendMessage('');
    
    if (!formData.email) {
      setResendMessage(i18n.t('auth.register.provideEmail'));
      return;
    }
    
    try {
      setResendLoading(true);
      const res = await resendConfirmation({
        email: formData.email,
        name: formData.username,
        role: formData.role
      });
      setResendMessage(res.data?.message || i18n.t('auth.register.emailResent'));
    } catch (err) {
      setResendMessage(err.response?.data?.error || i18n.t('auth.register.resendError'));
    } finally {
      setResendLoading(false);
    }
  };

  /**
   * Toggle password visibility
   */
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  /**
   * Toggle confirm password visibility
   */
  const toggleConfirmVisibility = () => {
    setShowConfirm(prev => !prev);
  };

  return {
    // State
    formData,
    step,
    error,
    loading,
    registered,
    resendLoading,
    resendMessage,
    showPassword,
    showConfirm,
    passwordRules,
    isPasswordValid,
    
    // Actions
    updateField,
    handleNext,
    handleBack,
    handleKeyPress,
    handleResend,
    togglePasswordVisibility,
    toggleConfirmVisibility
  };
}
