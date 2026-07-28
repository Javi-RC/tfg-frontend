import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationDropdown from './NotificationDropdown';
import './NotificationBell.css';

/**
 * NotificationBell Component
 * Notification bell with unread count badge.
 * Shows a dropdown with the list of notifications on click.
 */
const NotificationBell = () => {
  const { t } = useTranslation();
  const { unreadCount, fetchNotifications } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

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

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchNotifications();
    }
  };

  return (
    <div className="notification-bell-container" ref={dropdownRef}>
      <button
        type="button"
        ref={buttonRef}
        className="notification-bell-button"
        onClick={handleToggle}
        aria-label={t('notifications.aria.bell')}
        aria-expanded={isOpen}
      >
        <Bell size={24} aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {isOpen && <NotificationDropdown onClose={() => setIsOpen(false)} />}
    </div>
  );
};

export default NotificationBell;
