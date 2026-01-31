import React, { useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Minimal JWT payload decoder (base64url) to avoid runtime import issues
function decodeJwt(token) {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = parts[1];
    // base64url -> base64
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    // Pad base64 string length
    const pad = base64.length % 4;
    const padded = base64 + (pad ? '='.repeat(4 - pad) : '');
    const decoded = atob(padded);
    // Decode percent-encoding
    const json = decodeURIComponent(decoded.split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    return JSON.parse(json);
  } catch {
    return null;
  }
}
import { AuthContext } from '../contexts/AuthContext';

export default function OAuthSuccess() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setSession } = useContext(AuthContext);

  useEffect(() => {
    const token = searchParams.get('token');
    console.log('[OAuthSuccess] Token from URL:', token ? 'present' : 'missing');
    console.log('[OAuthSuccess] Full token value:', token);
    
    if (!token) {
      console.error('[OAuthSuccess] No token found in URL');
      navigate('/login', { replace: true });
      return;
    }

    try {
      const decoded = decodeJwt(token);
      console.log('[OAuthSuccess] Decoded JWT:', decoded);
      const userData = decoded.user || decoded;
      console.log('[OAuthSuccess] User data extracted:', userData);
      
      // CRITICAL: Call setSession FIRST to update both token and user in state
      // This prevents the AuthContext useEffect from trying to fetch profile
      // when it sees token but no user
      setSession(token, userData);
      console.log('[OAuthSuccess] setSession called');
      
      // Verify token is in localStorage after setSession
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      console.log('[OAuthSuccess] Verification - token in localStorage:', storedToken ? 'yes' : 'no');
      console.log('[OAuthSuccess] Verification - user in localStorage:', storedUser ? 'yes' : 'no');
      
      // Navigate after ensuring session is set
      setTimeout(() => {
        if (userData.role === 'unassigned') {
          navigate('/complete-profile', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      }, 100);
    } catch (err) {
      console.error('[OAuthSuccess] Invalid token on OAuth success:', err);
      navigate('/login', { replace: true });
    }
  }, [searchParams, setSession, navigate]);

  return <div style={{ maxWidth: 720, margin: '40px auto' }}>{t('auth.processingSignIn')}</div>;
}
