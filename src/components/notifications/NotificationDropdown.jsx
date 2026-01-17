import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCheck, BellOff, ArrowRight } from 'lucide-react';
import { useNotifications } from '../../contexts/useNotifications';
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
  const { 
    notifications, 
    loading, 
    fetchNotifications, 
    markAllAsRead 
  } = useNotifications();
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unread'

  useEffect(() => {
    fetchNotifications({ page: 1, limit: 20 });
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
        <h3>Notifications</h3>
        <button 
          className="mark-all-read-btn"
          onClick={handleMarkAllAsRead}
          disabled={!hasUnreadNotifications}
          title={hasUnreadNotifications ? 'Mark all as read' : 'No unread notifications'}
        >
          <CheckCheck size={16} />
          Mark all as read
        </button>
      </div>

      <div className="notification-tabs">
        <button 
          className={`tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All ({(notifications || []).length})
        </button>
        <button 
          className={`tab ${activeTab === 'unread' ? 'active' : ''}`}
          onClick={() => setActiveTab('unread')}
        >
          Unread ({(notifications || []).filter(n => !n.readAt).length})
        </button>
      </div>

      <div className="notification-list">
        {loading ? (
          <div className="notification-loading">
            <div className="loading-spinner"></div>
            <p>Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="notification-empty">
            <BellOff size={48} />
            <p>You don't have any {activeTab === 'unread' ? 'unread ' : ''}notifications</p>
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
        <Link to="/notifications" className="view-all-link" onClick={onClose}>
          View all notifications
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default NotificationDropdown;
