import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home } from 'lucide-react';
import './NotFoundPage.css';

/**
 * NotFoundPage - 404 page shown when no route matches
 */
export default function NotFoundPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <main className="not-found-page">
      <h1 className="not-found-code" aria-hidden="true">
        404
      </h1>
      <h2 className="not-found-title">
        {t('navigation.pageNotFound', { defaultValue: 'Page not found' })}
      </h2>
      <p className="not-found-description">
        {t('navigation.pageNotFoundDesc', {
          defaultValue: 'The page you are looking for does not exist or has been moved.',
        })}
      </p>
      <button
        type="button"
        onClick={() => navigate('/')}
        className="not-found-home-btn"
      >
        <Home size={18} />
        {t('navigation.goHome', { defaultValue: 'Go Home' })}
      </button>
    </main>
  );
}
