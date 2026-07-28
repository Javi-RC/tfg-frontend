import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function DangerZone() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="sara-card sara-card-pad sara-danger">
      <div className="sara-card-head">
        <span className="sara-card-head-icon"><AlertTriangle size={19} aria-hidden="true" /></span>
        <span className="sara-card-title">{t('accountDeletion.dangerZoneTitle')}</span>
      </div>
      <p className="sara-card-desc">{t('accountDeletion.dangerZoneDescription')}</p>

      <div className="sara-card-actions">
        <button
          type="button"
          className="sara-btn-danger"
          onClick={() => navigate('/account/delete')}
          aria-label={t('accountDeletion.actions.openPage')}
        >
          <Trash2 size={16} aria-hidden="true" />
          {t('accountDeletion.actions.openPage')}
        </button>
      </div>
    </section>
  );
}
