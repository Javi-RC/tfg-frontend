import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { getProfile } from '../api/auth';
import { unwrapUser } from '../api/responseAdapter';
import { setToken } from '../api/tokenStore';

export default function OAuthSuccess() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, setSession } = useAuth();

  useEffect(() => {
    // OAuth backends that cannot rely on cross-site cookies deliver the JWT
    // in the URL fragment. Store it before any request so the axios
    // interceptor attaches it as a Bearer header.
    const hash = window.location.hash?.startsWith('#')
      ? window.location.hash.slice(1)
      : '';
    const urlToken = new URLSearchParams(hash).get('token');
    if (urlToken) {
      setToken(urlToken);
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    if (user && !urlToken) {
      if (user.role === 'unassigned') {
        navigate('/complete-profile', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
      return;
    }

    let cancelled = false;

    getProfile()
      .then((res) => {
        if (cancelled) return;
        const rawUser = unwrapUser(res);
        if (rawUser) {
          setSession(urlToken || null, rawUser);
          if (rawUser.role === 'unassigned') {
            navigate('/complete-profile', { replace: true });
          } else {
            navigate('/', { replace: true });
          }
        } else {
          navigate('/login', { replace: true });
        }
      })
      .catch(() => {
        if (!cancelled) {
          navigate('/login', { replace: true });
        }
      });

    return () => { cancelled = true; };
  }, [user, navigate, setSession]);

  return <div>{t('auth.processingSignIn')}</div>;
}
