import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users, ArrowRight, Loader } from 'lucide-react';
import { useTeams } from '../hooks/useTeams';
import './AppPage.css';

export default function TeamsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { teams, loading } = useTeams();

  return (
    <div className="app-page">
      <div className="app-page-header">
        <h1 className="app-page-title">{t('simplePages.teams.title')}</h1>
        <p className="app-page-subtitle">{t('simplePages.teams.subtitle')}</p>
      </div>

      {loading ? (
        <div className="app-card" style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <Loader size={24} className="app-spinner" />
        </div>
      ) : teams.length > 0 ? (
        <div className="app-card">
          <div className="app-list">
            {teams.map(team => (
              <div
                key={team.id}
                className="app-list-item"
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/projects/${team.projectId}`)}
                onKeyDown={e => e.key === 'Enter' && navigate(`/projects/${team.projectId}`)}
              >
                <div className="app-list-item-icon">
                  <Users size={20} />
                </div>
                <div className="app-list-item-content">
                  <span className="app-list-item-title">{team.name}</span>
                  <span className="app-list-item-subtitle">
                    {team.memberCount} {t('common.members')} · {team.role}
                  </span>
                </div>
                <ArrowRight size={16} className="app-list-item-arrow" />
              </div>
            ))}
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
}
