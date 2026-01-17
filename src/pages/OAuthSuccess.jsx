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
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    try {
      const decoded = decodeJwt(token);
      const userData = decoded.user || decoded;
      setSession(token, userData);
      
      // Navigate after setting session
      if (userData.role === 'unassigned') {
        navigate('/complete-profile', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      console.error('Invalid token on OAuth success:', err);
      navigate('/login', { replace: true });
    }
  }, [searchParams, setSession, navigate]);

  return <div style={{ maxWidth: 720, margin: '40px auto' }}>{t('auth.processingSignIn')}</div>;
}
