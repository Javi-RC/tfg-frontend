import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import NotificationBell from './notifications/NotificationBell';

/**
 * TopNavBar Component
 * Top navigation bar for all authenticated users
 */
export default function TopNavBar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = user?.role === 'org_admin';

  const navItems = [
    { path: '/', label: 'Profile' },
    { path: '/my-cv', label: 'My CV' },
    { path: '/cv-stats', label: 'CV Stats' },
    ...(isAdmin ? [{ path: '/admin/cvs', label: 'All CVs', adminOnly: true }] : [])
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
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      fontFamily: 'Poppins, Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial'
    }} role="navigation" aria-label="Main navigation">
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
          CV Manager
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        {navItems.map((item) => (
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
            aria-label={`Navigate to ${item.label}`}
            aria-current={isActive(item.path) ? 'page' : undefined}
          >
            <span>{item.label}</span>
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
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        {/* Campanita de Notificaciones */}
        <NotificationBell />
        
        <div style={{
          fontSize: '14px',
          color: '#4a5568',
          fontWeight: '500'
        }}>
          {user?.username || user?.name || user?.email}
        </div>
        <button
          onClick={logout}
          style={{
            background: 'transparent',
            color: '#c0392b',
            border: '1px solid #c0392b',
            borderRadius: '8px',
            padding: '8px 20px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#c0392b';
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.color = '#c0392b';
          }}
          aria-label="Logout from application"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
