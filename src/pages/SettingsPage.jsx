import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Languages, UserCog, ShieldAlert, Trash2 } from 'lucide-react';
import LanguageSwitcher from '../components/LanguageSwitcher';
import './AppPage.css';

/**
 * SettingsPage
 * Lightweight settings hub for the "Ajustes" sidebar entry: language,
 * profile/notification shortcuts and account actions.
 */
export default function SettingsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="app-page">
      <div className="app-page-header">
        <h1 className="app-page-title">{t('simplePages.settings.title')}</h1>
        <p className="app-page-subtitle">{t('simplePages.settings.subtitle')}</p>
      </div>

      <section className="app-card">
        <div className="app-card-head">
          <span className="app-card-icon"><Languages size={20} aria-hidden="true" /></span>
          <span className="app-card-title">{t('simplePages.settings.language')}</span>
        </div>
        <p className="app-card-desc">{t('simplePages.settings.languageDesc')}</p>
        <div className="app-card-body">
          <LanguageSwitcher />
        </div>
      </section>

      <section className="app-card">
        <div className="app-card-head">
          <span className="app-card-icon"><UserCog size={20} aria-hidden="true" /></span>
          <span className="app-card-title">{t('simplePages.settings.profile')}</span>
        </div>
        <p className="app-card-desc">{t('simplePages.settings.profileDesc')}</p>
        <div className="app-card-body">
          <button type="button" className="app-btn" onClick={() => navigate('/')}>
            {t('simplePages.settings.editProfile')}
          </button>
        </div>
      </section>

      <section className="app-card">
        <div className="app-card-head">
          <span className="app-card-icon"><ShieldAlert size={20} aria-hidden="true" /></span>
          <span className="app-card-title">{t('simplePages.settings.account')}</span>
        </div>
        <p className="app-card-desc">{t('simplePages.settings.accountDesc')}</p>
        <div className="app-card-body">
          <button
            type="button"
            className="app-btn danger"
            onClick={() => navigate('/account/delete')}
          >
            <Trash2 size={16} aria-hidden="true" />
            {t('simplePages.settings.deleteAccount')}
          </button>
        </div>
      </section>
    </div>
  );
}
