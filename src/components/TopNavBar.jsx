import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Building2, FolderKanban } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../contexts/AuthContext';
import NotificationBell from './notifications/NotificationBell';
import UserMenu from './navigation/UserMenu';
import LanguageSwitcher from './LanguageSwitcher';

/**
 * TopNavBar Component
 * Top navigation bar for all authenticated users
 */
export default function TopNavBar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const isAdmin = user?.role === 'org_admin';

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const mainNavItems = [
    { path: '/projects', label: t('navigation.projects'), icon: FolderKanban },
    { path: '/organizations', label: t('navigation.organizations'), icon: Building2 }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '64px',
      background: 'white',
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      zIndex: 1000,
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center',
      padding: '0 32px',
      fontFamily: 'Poppins, Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial'
    }} id="main-navigation" role="navigation" aria-label={t('navigation.aria.main')}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <div style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#1a202c',
          letterSpacing: '-0.5px'
        }}>
          Sara
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        justifyContent: 'center'
      }}>
        {mainNavItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              background: isActive(item.path) ? '#f0f4f8' : 'transparent',
              color: isActive(item.path) ? '#2563eb' : '#4a5568',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: isActive(item.path) ? '600' : '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              if (!isActive(item.path)) {
                e.target.style.background = '#f7fafc';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(item.path)) {
                e.target.style.background = 'transparent';
              }
            }}
            aria-label={t('navigation.aria.navigateTo', { label: item.label })}
            aria-current={isActive(item.path) ? 'page' : undefined}
          >
            {item.icon && <item.icon size={18} aria-hidden="true" />}
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        justifyContent: 'flex-end'
      }}>
        <LanguageSwitcher />
        <NotificationBell />
        <UserMenu user={user} onLogout={handleLogout} isAdmin={isAdmin} />
      </div>
    </nav>
  );
}
