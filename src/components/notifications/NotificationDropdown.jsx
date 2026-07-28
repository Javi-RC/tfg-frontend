import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCheck, BellOff, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationItem from './NotificationItem';
import './NotificationDropdown.css';

/**
 * NotificationDropdown Component
 * Dropdown que muestra la lista de notificaciones
 * Incluye tabs para filtrar entre todas y no leídas
 *
 * Se carga al abrir el panel (GET /api/notifications)
 */
const NotificationDropdown = ({ onClose }) => {
  const { t } = useTranslation();
  const { notifications, loading, fetchNotifications, markAllAsRead } = useNotifications();
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unread'

  useEffect(() => {
    fetchNotifications({ page: 1, limit: 20 });
  }, [fetchNotifications]);

  const filteredNotifications =
    activeTab === 'unread' ? (notifications || []).filter((n) => !n.readAt) : notifications || [];

  const hasUnreadNotifications = (notifications || []).some((n) => !n.readAt);

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  return (
    <div className="notification-dropdown">
      <div className="notification-dropdown-header">
        <h3>{t('notifications.title')}</h3>
        <button
          type="button"
          className="mark-all-read-btn"
          onClick={handleMarkAllAsRead}
          disabled={!hasUnreadNotifications}
          title={
            hasUnreadNotifications ? t('notifications.markAllAsRead') : t('notifications.noUnread')
          }
        >
          <CheckCheck size={16} />
          {t('notifications.markAllAsRead')}
        </button>
      </div>

      <div className="notification-tabs">
        <button
          type="button"
          className={`tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          {t('notifications.all')} ({(notifications || []).length})
        </button>
        <button
          type="button"
          className={`tab ${activeTab === 'unread' ? 'active' : ''}`}
          onClick={() => setActiveTab('unread')}
        >
          {t('notifications.unread')} ({(notifications || []).filter((n) => !n.readAt).length})
        </button>
      </div>

      <div className="notification-list">
        {loading ? (
          <div className="notification-loading">
            <div className="loading-spinner"></div>
            <p>{t('notifications.loading')}</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="notification-empty">
            <BellOff size={48} />
            <p>
              {t('notifications.noNotifications', {
                type: activeTab === 'unread' ? t('notifications.unread').toLowerCase() + ' ' : '',
              })}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onClose={onClose}
            />
          ))
        )}
      </div>

      <div className="notification-dropdown-footer">
        <Link to="/notifications" className="view-all-link" onClick={onClose}>
          {t('notifications.viewAll')}
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default NotificationDropdown;
