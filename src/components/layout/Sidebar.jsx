import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Home,
  FolderKanban,
  Users,
  FileText,
  Brain,
  Building2,
  User,
  Settings,
  HelpCircle,
  X,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import saraIcon from '../../assets/icon.png';
import completeIllustration from '../../assets/sidebar-complete.png';
import './Sidebar.css';

/**
 * Resolve which nav item should render as active for the current path.
 * The app has no dedicated dashboard, so "/" belongs to the profile item.
 */
function activeIdForPath(pathname) {
  if (pathname === '/') return 'profile';
  if (pathname.startsWith('/notifications')) return 'home';
  if (pathname.startsWith('/projects')) return 'projects';
  if (pathname.startsWith('/organizations')) return 'companies';
  if (pathname.startsWith('/my-cv') || pathname.startsWith('/cv')) return 'cv';
  if (pathname.startsWith('/bfi-44')) return 'personality';
  if (pathname.startsWith('/teams')) return 'teams';
  if (pathname.startsWith('/settings')) return 'settings';
  if (pathname.startsWith('/help')) return 'help';
  return null;
}

/**
 * Sidebar Component
 * Left navigation for the authenticated app shell.
 * Items without a real route yet (Equipos, Recomendaciones, Ajustes, Ayuda)
 * are rendered for visual parity but marked as not-yet-available.
 */
export default function Sidebar({ open = false, collapsed = false, onClose = () => {}, onToggleCollapse = () => {}, completion = 0 }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const activeId = activeIdForPath(location.pathname);

  const navItems = [
    { id: 'home', label: t('sidebar.home'), icon: Home, path: '/notifications' },
    { id: 'projects', label: t('sidebar.projects'), icon: FolderKanban, path: '/projects' },
    { id: 'teams', label: t('sidebar.teams'), icon: Users, path: '/teams' },
    { id: 'cv', label: t('sidebar.cv'), icon: FileText, path: '/my-cv' },
    { id: 'personality', label: t('bfi44.personalityTest'), icon: Brain, path: '/bfi-44' },
    { id: 'companies', label: t('sidebar.companies'), icon: Building2, path: '/organizations' },
    { id: 'profile', label: t('sidebar.profile'), icon: User, path: '/' },
    { id: 'settings', label: t('sidebar.settings'), icon: Settings, path: '/settings' },
    { id: 'help', label: t('sidebar.help'), icon: HelpCircle, path: '/help' },
  ];

  const handleNav = (item) => {
    if (!item.path) return;
    onClose();
    navigate(item.path);
  };

  return (
    <>
      <div
        className={`sara-sidebar-overlay ${open ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`sara-sidebar ${open ? 'open' : ''} ${collapsed ? 'collapsed' : ''}`}
        aria-label={t('sidebar.aria.main')}
      >
        <div className="sara-sidebar-top">
          <button
            type="button"
            className="sara-sidebar-brand"
            onClick={() => handleNav({ path: '/' })}
            aria-label={t('sidebar.aria.goHome')}
          >
            <img src={saraIcon} alt="" className="sara-sidebar-logo" aria-hidden="true" />
            <span className="sara-sidebar-brand-text">Sara</span>
          </button>
          <button
            type="button"
            className="sara-sidebar-collapse-btn"
            onClick={onToggleCollapse}
            aria-label={collapsed ? t('sidebar.aria.expand') : t('sidebar.aria.collapse')}
            title={collapsed ? t('sidebar.aria.expand') : t('sidebar.aria.collapse')}
          >
            {collapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
          </button>
          <button
            type="button"
            className="sara-sidebar-close"
            onClick={onClose}
            aria-label={t('sidebar.aria.close')}
          >
            <X size={22} />
          </button>
        </div>

        <nav className="sara-sidebar-nav" aria-label={t('sidebar.aria.primary')}>
          {navItems.map((item) => {
            const isActive = item.id === activeId;
            const Icon = item.icon;
            return (
              <button
                type="button"
                key={item.id}
                className={`sara-nav-item ${isActive ? 'active' : ''} ${item.path ? '' : 'disabled'}`}
                onClick={() => handleNav(item)}
                aria-current={isActive ? 'page' : undefined}
                aria-disabled={item.path ? undefined : true}
                title={item.path ? undefined : t('sidebar.comingSoon')}
              >
                <span className="sara-nav-icon">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <span className="sara-nav-label">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sara-sidebar-cta">
          <img src={completeIllustration} alt="" className="sara-cta-illustration" aria-hidden="true" />
          <p className="sara-cta-title">{t('sidebar.completeCard.greeting')}</p>
          <p className="sara-cta-text">
            {t('sidebar.completeCard.text', { pct: Math.round(completion) })}
          </p>
          <button
            type="button"
            className="sara-cta-button"
            onClick={() => handleNav({ path: '/' })}
          >
            {t('sidebar.completeCard.button')}
          </button>
        </div>
      </aside>
    </>
  );
}
