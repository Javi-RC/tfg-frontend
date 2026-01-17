import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { confirmAccount } from '../api/auth';
import { useSearchParams } from 'react-router-dom';

export default function ConfirmAccount() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [msg, setMsg] = useState(t('auth.confirming'));
  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setMsg(t('errors.tokenNotProvided'));
      return;
    }
    confirmAccount(token).then(() => {
      setMsg(t('auth.accountConfirmedLogIn'));
    }).catch(() => {
      setMsg(t('errors.invalidOrExpiredToken'));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);
  return <div style={{ maxWidth: 720, margin: '40px auto' }}>{msg}</div>;
}
