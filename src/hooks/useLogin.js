import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { validateLoginForm } from '../validators/authValidators';

/**
 * Custom hook for Login business logic
 * Separates authentication logic from UI components
 */
export function useLogin() {
  const navigate = useNavigate();
  const { login, loginWithOAuth } = useContext(AuthContext);
  
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Handle OAuth redirect errors from URL
   */
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const oauthError = params.get('oauth_error') || params.get('error');
      
      if (oauthError) {
        let decoded;
        try {
          decoded = decodeURIComponent(oauthError);
        } catch {
          decoded = oauthError;
        }
        
        setError(
          `Authentication error: ${decoded}. If the issue persists, complete your profile or contact support.`
        );

        // Clean URL
        const url = new URL(window.location.href);
        url.searchParams.delete('oauth_error');
        url.searchParams.delete('error');
        window.history.replaceState(null, '', url.toString());
      }
    } catch {
      // Silent fallback
    }
  }, []);

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const validation = validateLoginForm(form);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setIsLoading(true);
    try {
      await login(form);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Error logging in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update form field
   */
  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  /**
   * Toggle password visibility
   */
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  /**
   * Handle OAuth login
   */
  const handleOAuthLogin = (provider) => {
    if (!isLoading) {
      loginWithOAuth(provider);
    }
  };

  /**
   * Navigate to register page
   */
  const navigateToRegister = () => {
    if (!isLoading) navigate('/register');
  };

  /**
   * Navigate to home page
   */
  const navigateToHome = () => {
    if (!isLoading) navigate('/');
  };

  return {
    // State
    form,
    error,
    isLoading,
    showPassword,
    
    // Actions
    handleSubmit,
    updateField,
    togglePasswordVisibility,
    handleOAuthLogin,
    navigateToRegister,
    navigateToHome
  };
}
