import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Menu } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import NotificationBell from '../notifications/NotificationBell';
import UserMenu from '../navigation/UserMenu';
import LanguageSwitcher from '../LanguageSwitcher';
import './AppTopBar.css';

/**
 * AppTopBar Component
 * Top bar of the authenticated app shell: search, language, notifications, user.
 */
export default function AppTopBar({ onOpenSidebar = () => {} }) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'org_admin';

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="sara-topbar" aria-label={t('sidebar.aria.topbar')}>
      <button
        type="button"
        className="sara-topbar-hamburger"
        onClick={onOpenSidebar}
        aria-label={t('sidebar.aria.openMenu')}
      >
        <Menu size={22} />
      </button>

      <div className="sara-topbar-search">
        <Search size={18} className="sara-topbar-search-icon" aria-hidden="true" />
        <input
          type="search"
          className="sara-topbar-search-input"
          placeholder={t('sidebar.searchPlaceholder')}
          aria-label={t('sidebar.searchPlaceholder')}
        />
      </div>

      <div className="sara-topbar-right">
        <LanguageSwitcher />
        <NotificationBell />
        <UserMenu user={user} onLogout={handleLogout} isAdmin={isAdmin} />
      </div>
    </header>
  );
}
