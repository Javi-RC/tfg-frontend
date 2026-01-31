import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Building2, FolderKanban, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../contexts/AuthContext';
import NotificationBell from './notifications/NotificationBell';
import UserMenu from './navigation/UserMenu';
import LanguageSwitcher from './LanguageSwitcher';
import saraIcon from '../assets/icon.png';

/**
 * TopNavBar Component
 * Top navigation bar for all authenticated users
 */
export default function TopNavBar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);

  const isAdmin = user?.role === 'org_admin';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.15)' : '0 2px 12px rgba(0,0,0,0.08)',
      zIndex: 1000,
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center',
      padding: '0 32px',
      fontFamily: 'Poppins, Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
      transition: 'box-shadow 0.3s ease'
    }} id="main-navigation" role="navigation" aria-label={t('navigation.aria.main')}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <button
          onClick={() => navigate('/projects')}
          onMouseEnter={() => setLogoHovered(true)}
          onMouseLeave={() => setLogoHovered(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            transform: logoHovered ? 'scale(1.05)' : 'scale(1)'
          }}
          aria-label={t('navigation.aria.goToHome', { defaultValue: 'Go to home' })}
        >
          <img 
            src={saraIcon} 
            alt="Sara" 
            style={{
              width: '32px',
              height: '32px',
              objectFit: 'contain',
              transition: 'transform 0.3s ease',
              transform: logoHovered ? 'rotate(5deg)' : 'rotate(0deg)'
            }}
          />
          <div style={{
            fontSize: '28px',
            fontWeight: '400',
            color: '#2563eb',
            fontFamily: "'Pacifico', cursive",
            letterSpacing: '0.5px',
            transition: 'color 0.3s ease'
          }}>
            Sara
          </div>
        </button>
        {isAdmin && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
          }}>
            <Shield size={12} />
            <span>Admin</span>
          </div>
        )}
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
              position: 'relative',
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
                e.currentTarget.style.background = '#f7fafc';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(item.path)) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
            aria-label={t('navigation.aria.navigateTo', { label: item.label })}
            aria-current={isActive(item.path) ? 'page' : undefined}
          >
            {item.icon && <item.icon size={18} aria-hidden="true" />}
            <span>{item.label}</span>
            {isActive(item.path) && (
              <div style={{
                position: 'absolute',
                bottom: '-2px',
                left: '20px',
                right: '20px',
                height: '3px',
                background: 'linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)',
                borderRadius: '2px 2px 0 0',
                boxShadow: '0 -2px 8px rgba(37, 99, 235, 0.3)'
              }} />
            )}
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
