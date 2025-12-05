import { useNotifications } from '../../contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import './NotificationItem.css';

/**
 * NotificationItem Component
 * Componente individual de notificación
 * Muestra título, mensaje, tiempo relativo y acciones
 */
const NotificationItem = ({ notification, onClose }) => {
  const { markAsRead, deleteNotification } = useNotifications();
  const isUnread = !notification.readAt;

  const handleClick = async () => {
    if (isUnread) {
      await markAsRead(notification._id);
    }
    
    // Si tiene URL de acción, navegar
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
      onClose?.();
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    await deleteNotification(notification._id);
  };

  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
    locale: es
  });

  const priorityClass = `priority-${notification.priority || 'normal'}`;

  return (
    <div 
      className={`notification-item ${isUnread ? 'unread' : ''} ${priorityClass}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="notification-indicator">
        {isUnread && <span className="unread-dot" aria-label="No leída" />}
        <NotificationIcon type={notification.type} />
      </div>

      <div className="notification-content">
        <div className="notification-title">{notification.title}</div>
        <div className="notification-message">{notification.message}</div>
        <div className="notification-meta">
          <span className="notification-time">{timeAgo}</span>
          {notification.priority === 'urgent' && (
            <span className="urgent-badge">Urgente</span>
          )}
          {notification.priority === 'high' && (
            <span className="high-badge">Alta</span>
          )}
        </div>
      </div>

      <button 
        className="notification-delete-btn"
        onClick={handleDelete}
        aria-label="Eliminar notificación"
        title="Eliminar"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );
};

/**
 * NotificationIcon Component
 * Renderiza el icono apropiado según el tipo de notificación
 */
const NotificationIcon = ({ type }) => {
  const icons = {
    email_confirmation: '✉️',
    password_reset: '🔒',
    account_updated: '👤',
    role_changed: '⚡',
    cv_uploaded: '📄',
    cv_processed: '✅',
    cv_analysis_ready: '📊',
    cv_analysis_failed: '❌',
    admin_announcement: '📢',
    system_update: '🔄',
    custom: '📬'
  };

  return (
    <span className="notification-icon" role="img" aria-label={`Tipo: ${type}`}>
      {icons[type] || icons.custom}
    </span>
  );
};

export default NotificationItem;
