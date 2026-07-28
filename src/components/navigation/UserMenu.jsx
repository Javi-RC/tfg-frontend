import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, FileText, BarChart3, Brain, Database, LogOut, ChevronDown } from 'lucide-react';
import './UserMenu.css';

/**
 * UserMenu Component
 * Dropdown menu for user-related actions and navigation
 */
export default function UserMenu({ user, onLogout, isAdmin }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const menuItemRefs = useRef([]);

  const handleMenuKeyDown = useCallback((e) => {
    const items = menuItemRefs.current.filter(Boolean);
    const currentIndex = items.indexOf(document.activeElement);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
      items[nextIndex]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      items[prevIndex]?.focus();
    }
  }, []);

  const userMenuItems = [
    { path: '/', label: t('navigation.profile'), icon: User },
    { path: '/my-cv', label: t('cv.myCV'), icon: FileText },
    { path: '/cv-stats', label: t('cv.cvStatistics'), icon: BarChart3 },
    { path: '/bfi-44', label: t('bfi44.personalityTest'), icon: Brain },
    ...(isAdmin
      ? [{ path: '/admin/cvs', label: t('navigation.adminCvs'), icon: Database, adminOnly: true }]
      : []),
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleItemClick = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = () => {
    setIsOpen(false);
    onLogout();
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const firstItem = menuItemRefs.current[0];
      if (firstItem) {
        firstItem.focus();
      }
    }
  }, [isOpen]);

  const isActive = (path) => location.pathname === path;
  const displayName = user?.username || user?.name || user?.email || t('navigation.user');

  return (
    <div className="usermenu-wrapper">
      <button
        type="button"
        ref={buttonRef}
        onClick={toggleMenu}
        className="usermenu-trigger"
        data-open={String(isOpen)}
        aria-label={t('navigation.aria.userMenu')}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <User size={18} aria-hidden="true" />
        <span>{displayName}</span>
        <ChevronDown
          size={16}
          className="usermenu-chevron"
          data-open={String(isOpen)}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="usermenu-dropdown"
          role="menu"
          aria-label={t('navigation.aria.userMenuOptions')}
          onKeyDown={handleMenuKeyDown}
        >
          {userMenuItems.map((item, index) => (
            <button
              type="button"
              key={item.path}
              ref={(el) => { menuItemRefs.current[index] = el; }}
              onClick={() => handleItemClick(item.path)}
              className="usermenu-item"
              data-active={String(isActive(item.path))}
              role="menuitem"
              tabIndex={-1}
              aria-current={isActive(item.path) ? 'page' : undefined}
            >
              {item.icon && <item.icon size={18} aria-hidden="true" />}
              <span className="usermenu-item-label">{item.label}</span>
              {item.adminOnly && (
                <span className="usermenu-admin-badge">
                  ADMIN
                </span>
              )}
            </button>
          ))}

          <div className="usermenu-divider" />

          <button
            type="button"
            ref={(el) => { menuItemRefs.current[userMenuItems.length] = el; }}
            onClick={handleLogout}
            className="usermenu-logout"
            role="menuitem"
            tabIndex={-1}
          >
            <LogOut size={18} aria-hidden="true" />
            <span>{t('auth.logout')}</span>
          </button>
        </div>
      )}
    </div>
  );
}
