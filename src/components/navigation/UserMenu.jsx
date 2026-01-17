import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, FileText, BarChart3, Brain, Database, LogOut, ChevronDown } from 'lucide-react';

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

  const userMenuItems = [
    { path: '/', label: t('navigation.profile'), icon: User },
    { path: '/my-cv', label: t('cv.myCV'), icon: FileText },
    { path: '/cv-stats', label: t('cv.cvStatistics'), icon: BarChart3 },
    { path: '/bfi-44', label: t('bfi44.personalityTest'), icon: Brain },
    ...(isAdmin ? [{ path: '/admin/cvs', label: t('navigation.adminCvs'), icon: Database, adminOnly: true }] : [])
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

  const isActive = (path) => location.pathname === path;
  const displayName = user?.username || user?.name || user?.email || t('navigation.user');

  return (
    <div style={{ position: 'relative' }}>
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        style={{
          background: isOpen ? '#f0f4f8' : 'transparent',
          color: '#1a202c',
          border: 'none',
          borderRadius: '8px',
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.target.style.background = '#f7fafc';
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.target.style.background = 'transparent';
          }
        }}
        aria-label={t('navigation.aria.userMenu')}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <User size={18} aria-hidden="true" />
        <span>{displayName}</span>
        <ChevronDown
          size={16}
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s'
          }}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            minWidth: '220px',
            padding: '8px',
            zIndex: 1001,
            animation: 'slideDown 0.2s ease-out'
          }}
          role="menu"
          aria-label={t('navigation.aria.userMenuOptions')}
        >
          {userMenuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleItemClick(item.path)}
              style={{
                width: '100%',
                background: isActive(item.path) ? '#f0f4f8' : 'transparent',
                color: isActive(item.path) ? '#2563eb' : '#4a5568',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: isActive(item.path) ? '600' : '500',
                cursor: 'pointer',
                transition: 'all 0.15s',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                textAlign: 'left'
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
              role="menuitem"
              aria-current={isActive(item.path) ? 'page' : undefined}
            >
              {item.icon && <item.icon size={18} aria-hidden="true" />}
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.adminOnly && (
                <span style={{
                  fontSize: '10px',
                  padding: '2px 6px',
                  background: '#e8f4f8',
                  color: '#0066cc',
                  borderRadius: '4px',
                  fontWeight: '600'
                }}>
                  ADMIN
                </span>
              )}
            </button>
          ))}

          <div style={{
            height: '1px',
            background: '#e2e8f0',
            margin: '8px 0'
          }} />

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              background: 'transparent',
              color: '#c0392b',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.15s',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#fee';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
            }}
            role="menuitem"
          >
            <LogOut size={18} aria-hidden="true" />
            <span>{t('auth.logout')}</span>
          </button>
        </div>
      )}

      <style>
        {`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}
