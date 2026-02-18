import { useState, useEffect } from 'react';
import { BellOff, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '../contexts/useNotifications';
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
  const { t } = useTranslation();
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
            <h1>{t('notifications.title')}</h1>
            <p className="notifications-subtitle">
              {t('notifications.manageNotifications')}
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
            {t('notifications.markAllAsRead')}
          </button>
        </div>

        <div className="notifications-stats">
          <div className="stat-card">
            <div className="stat-value">{totalCount}</div>
            <div className="stat-label">{t('notifications.all')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{unreadCount}</div>
            <div className="stat-label">{t('notifications.unread')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{readCount}</div>
            <div className="stat-label">{t('notifications.read')}</div>
          </div>
        </div>

        <div className="notifications-controls">
          <div className="notifications-filters">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => handleFilterChange('all')}
            >
              {t('notifications.all')} ({totalCount})
            </button>
            <button 
              className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
              onClick={() => handleFilterChange('unread')}
            >
              {t('notifications.unread')} ({unreadCount})
            </button>
            <button 
              className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
              onClick={() => handleFilterChange('read')}
            >
              {t('notifications.read')} ({readCount})
            </button>
          </div>

          <div className="notifications-sort">
            <label htmlFor="sort-select">{t('notifications.sortBy')}:</label>
            <select 
              id="sort-select"
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="recent">{t('notifications.recent')}</option>
              <option value="oldest">{t('notifications.oldest')}</option>
            </select>
          </div>
        </div>

        <div className="notifications-page-list">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>{t('notifications.loadingNotifications')}</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="empty-state-large">
              <BellOff size={64} color="#999" />
              <h3>{t('notifications.noNotifications')}</h3>
              <p>{t('notifications.noNotificationsDesc')}</p>
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
              aria-label={t('notifications.aria.previousPage')}
            >
              <ChevronLeft size={16} style={{ marginRight: '6px' }} />
              {t('notifications.previous')}
            </button>
            <span className="pagination-info">
              {t('notifications.page')} {currentPage} {t('notifications.of')} {pagination.pages}
            </span>
            <button 
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.pages}
              aria-label={t('notifications.aria.nextPage')}
            >
              {t('notifications.next')}
              <ChevronRight size={16} style={{ marginLeft: '6px' }} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
