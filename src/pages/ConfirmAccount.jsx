import React, { useEffect, useState } from 'react';
import { confirmAccount } from '../api/auth';
import { useSearchParams } from 'react-router-dom';

export default function ConfirmAccount() {
  const [searchParams] = useSearchParams();
  const [msg, setMsg] = useState('Confirming...');
  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setMsg('Token not provided');
      return;
    }
    confirmAccount(token).then(res => {
      setMsg('Account confirmed. You can now log in.');
    }).catch(err => {
      setMsg('Invalid or expired token');
    });
  }, [searchParams]);
  return <div style={{ maxWidth: 720, margin: '40px auto' }}>{msg}</div>;
}
