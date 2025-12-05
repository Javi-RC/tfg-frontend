import { useEffect, useState } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import NotificationItem from './NotificationItem';
import './NotificationDropdown.css';

/**
 * NotificationDropdown Component
 * Dropdown que muestra la lista de notificaciones
 * Incluye tabs para filtrar entre todas y no leídas
 */
const NotificationDropdown = ({ onClose }) => {
  const { 
    notifications, 
    loading, 
    fetchNotifications, 
    markAllAsRead 
  } = useNotifications();
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unread'

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const filteredNotifications = activeTab === 'unread' 
    ? (notifications || []).filter(n => !n.readAt)
    : (notifications || []);

  const hasUnreadNotifications = (notifications || []).some(n => !n.readAt);

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  return (
    <div className="notification-dropdown">
      <div className="notification-dropdown-header">
        <h3>Notificaciones</h3>
        <button 
          className="mark-all-read-btn"
          onClick={handleMarkAllAsRead}
          disabled={!hasUnreadNotifications}
          title={hasUnreadNotifications ? 'Marcar todas como leídas' : 'No hay notificaciones sin leer'}
        >
          Marcar todas como leídas
        </button>
      </div>

      <div className="notification-tabs">
        <button 
          className={`tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          Todas ({(notifications || []).length})
        </button>
        <button 
          className={`tab ${activeTab === 'unread' ? 'active' : ''}`}
          onClick={() => setActiveTab('unread')}
        >
          No leídas ({(notifications || []).filter(n => !n.readAt).length})
        </button>
      </div>

      <div className="notification-list">
        {loading ? (
          <div className="notification-loading">
            <div className="loading-spinner"></div>
            <p>Cargando notificaciones...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="notification-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <p>No tienes notificaciones {activeTab === 'unread' ? 'sin leer' : ''}</p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <NotificationItem 
              key={notification._id} 
              notification={notification}
              onClose={onClose}
            />
          ))
        )}
      </div>

      <div className="notification-dropdown-footer">
        <a href="/notifications" className="view-all-link">
          Ver todas las notificaciones →
        </a>
      </div>
    </div>
  );
};

export default NotificationDropdown;
