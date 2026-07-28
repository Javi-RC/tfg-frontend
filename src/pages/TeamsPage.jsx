import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users, ArrowRight } from 'lucide-react';
import './AppPage.css';

/**
 * TeamsPage
 * Placeholder for the "Equipos" sidebar entry. Teams are formed from
 * projects, so this points users there until a dedicated teams API exists.
 */
export default function TeamsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="app-page">
      <div className="app-page-header">
        <h1 className="app-page-title">{t('simplePages.teams.title')}</h1>
        <p className="app-page-subtitle">{t('simplePages.teams.subtitle')}</p>
      </div>

      <div className="app-card">
        <div className="app-empty">
          <div className="app-empty-icon">
            <Users size={32} aria-hidden="true" />
          </div>
          <h2 className="app-empty-title">{t('simplePages.teams.emptyTitle')}</h2>
          <p className="app-empty-text">{t('simplePages.teams.emptyText')}</p>
          <button type="button" className="app-btn primary" onClick={() => navigate('/projects')}>
            {t('simplePages.teams.goToProjects')}
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
