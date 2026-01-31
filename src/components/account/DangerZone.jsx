import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PrimaryButton from '../PrimaryButton';

export default function DangerZone() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section style={{
      padding: '32px 40px',
      background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.02) 0%, rgba(239, 68, 68, 0.02) 100%)',
      borderTop: '2px solid #fecaca'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <AlertTriangle size={20} color="#dc2626" aria-hidden="true" />
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1a202c' }}>
          {t('accountDeletion.dangerZoneTitle')}
        </h2>
      </div>
      <p style={{ fontSize: '14px', color: '#718096', marginBottom: '20px', lineHeight: '1.6' }}>
        {t('accountDeletion.dangerZoneDescription')}
      </p>
      <PrimaryButton
        onClick={() => navigate('/account/delete')}
        leftIcon={<Trash2 size={16} />}
        style={{ background: '#dc2626', padding: '10px 20px', fontSize: '14px', fontWeight: '500' }}
        aria-label={t('accountDeletion.actions.openPage')}
      >
        {t('accountDeletion.actions.openPage')}
      </PrimaryButton>
    </section>
  );
}
