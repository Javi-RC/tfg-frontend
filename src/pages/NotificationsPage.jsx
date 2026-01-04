import { useState, useEffect } from 'react';
import { BellOff } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import NotificationItem from '../components/notifications/NotificationItem';
import './NotificationsPage.css';

/**
 * NotificationsPage Component
 * Página completa dedicada a la gestión de notificaciones
 * Incluye filtros, paginación y lista completa de notificaciones
 * 
 * Consume la API: GET /api/notifications con paginación
 */
const NotificationsPage = () => {
  const { 
    notifications, 
    loading, 
    pagination,
    fetchNotifications,
    markAllAsRead 
  } = useNotifications();
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'read'
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('recent'); // 'recent' | 'oldest'
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    fetchNotifications({ 
      page: currentPage, 
      limit: ITEMS_PER_PAGE,
      unreadOnly: filter === 'unread'
    });
  }, [currentPage, fetchNotifications, filter]);

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
  const totalCount = pagination?.total || (notifications || []).length;

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1); // Resetear a página 1 cuando cambia el filtro
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (pagination?.pages || 1)) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="notifications-page">
      <div className="notifications-page-container">
        <div className="notifications-page-header">
          <div>
            <h1>Notifications</h1>
            <p className="notifications-subtitle">
              Manage your notifications and stay up to date
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
            Mark all as read
          </button>
        </div>

        <div className="notifications-stats">
          <div className="stat-card">
            <div className="stat-value">{totalCount}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{unreadCount}</div>
            <div className="stat-label">Unread</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{readCount}</div>
            <div className="stat-label">Read</div>
          </div>
        </div>

        <div className="notifications-controls">
          <div className="notifications-filters">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => handleFilterChange('all')}
            >
              All ({totalCount})
            </button>
            <button 
              className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
              onClick={() => handleFilterChange('unread')}
            >
              Unread ({unreadCount})
            </button>
            <button 
              className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
              onClick={() => handleFilterChange('read')}
            >
              Read ({readCount})
            </button>
          </div>

          <div className="notifications-sort">
            <label htmlFor="sort-select">Sort by:</label>
            <select 
              id="sort-select"
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="recent">Most recent</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>

        <div className="notifications-page-list">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="empty-state-large">
              <BellOff size={64} color="#999" />
              <h3>You don't have any {filter !== 'all' && filter === 'unread' ? 'unread ' : filter === 'read' ? 'read ' : ''}notifications</h3>
              <p>When you receive notifications, they'll appear here</p>
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

        {/* Paginación */}
        {pagination && pagination.pages > 1 && (
          <div className="notifications-pagination">
            <button 
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              ← Previous
            </button>
            <span className="pagination-info">
              Page {currentPage} of {pagination.pages}
            </span>
            <button 
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.pages}
              aria-label="Next page"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
