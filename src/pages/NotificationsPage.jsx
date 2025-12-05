import { useState, useEffect } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import NotificationItem from '../components/notifications/NotificationItem';
import './NotificationsPage.css';

/**
 * NotificationsPage Component
 * Página completa dedicada a la gestión de notificaciones
 * Incluye filtros, paginación y lista completa de notificaciones
 */
const NotificationsPage = () => {
  const { 
    notifications, 
    loading, 
    fetchNotifications,
    markAllAsRead 
  } = useNotifications();
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'read'
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('recent'); // 'recent' | 'oldest'

  useEffect(() => {
    fetchNotifications(page, 20);
  }, [page, fetchNotifications]);

  const filteredNotifications = (notifications || [])
    .filter(n => {
      if (filter === 'unread') return !n.readAt;
      if (filter === 'read') return n.readAt;
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortBy === 'recent' ? dateB - dateA : dateA - dateB;
    });

  const unreadCount = (notifications || []).filter(n => !n.readAt).length;
  const readCount = (notifications || []).filter(n => n.readAt).length;

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  return (
    <div className="notifications-page">
      <div className="notifications-page-container">
        <div className="notifications-page-header">
          <div>
            <h1>Notificaciones</h1>
            <p className="notifications-subtitle">
              Gestiona tus notificaciones y mantente al día
            </p>
          </div>
          <button 
            className="mark-all-read-btn-large"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Marcar todas como leídas
          </button>
        </div>

        <div className="notifications-stats">
          <div className="stat-card">
            <div className="stat-value">{(notifications || []).length}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{unreadCount}</div>
            <div className="stat-label">No leídas</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{readCount}</div>
            <div className="stat-label">Leídas</div>
          </div>
        </div>

        <div className="notifications-controls">
          <div className="notifications-filters">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Todas ({(notifications || []).length})
            </button>
            <button 
              className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
              onClick={() => setFilter('unread')}
            >
              No leídas ({unreadCount})
            </button>
            <button 
              className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
              onClick={() => setFilter('read')}
            >
              Leídas ({readCount})
            </button>
          </div>

          <div className="notifications-sort">
            <label htmlFor="sort-select">Ordenar por:</label>
            <select 
              id="sort-select"
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="recent">Más recientes</option>
              <option value="oldest">Más antiguas</option>
            </select>
          </div>
        </div>

        <div className="notifications-page-list">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Cargando notificaciones...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="empty-state-large">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <h3>No tienes notificaciones {filter !== 'all' && filter}</h3>
              <p>Cuando recibas notificaciones, aparecerán aquí</p>
            </div>
          ) : (
            <div className="notifications-grid">
              {filteredNotifications.map(notification => (
                <NotificationItem 
                  key={notification._id} 
                  notification={notification}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
