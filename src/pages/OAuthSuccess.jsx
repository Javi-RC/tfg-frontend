import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { getProfile } from '../api/auth';
import { unwrapUser } from '../api/responseAdapter';

export default function OAuthSuccess() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, setSession } = useAuth();

  useEffect(() => {
    if (user) {
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
          setSession(null, rawUser);
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
