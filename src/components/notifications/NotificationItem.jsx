import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { getNotificationTypeIcon } from '../../types/notificationTypes';
import './NotificationItem.css';

/**
 * NotificationItem Component
 * Componente individual de notificación
 * Muestra título, mensaje, tiempo relativo y acciones
 * 
 * Estructura de una notificación:
 * {
 *   _id: string,
 *   type: string (cv_processed, org_employee_added, etc.),
 *   title: string,
 *   message: string,
 *   priority: 'low' | 'medium' | 'high' | 'urgent',
 *   readAt: Date | null,
 *   actionUrl: string (URL para navegar),
 *   actionText: string,
 *   createdAt: Date
 * }
 */
const NotificationItem = ({ notification, onClose }) => {
  const navigate = useNavigate();
  const { markAsRead, deleteNotification } = useNotifications();
  const isUnread = !notification.readAt;

  const handleClick = async () => {
    if (isUnread) {
      await markAsRead(notification._id);
    }
    
    // Si tiene URL de acción, navegar usando React Router
    if (notification.actionUrl) {
      // Verificar si es una URL interna o externa
      const isInternalUrl = notification.actionUrl.startsWith('/');
      if (isInternalUrl) {
        navigate(notification.actionUrl);
      } else {
        window.open(notification.actionUrl, '_blank', 'noopener,noreferrer');
      }
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
  const icon = getNotificationTypeIcon(type);
  
  return (
    <span className="notification-icon" role="img" aria-label={`Tipo: ${type}`}>
      {icon}
    </span>
  );
};

export default NotificationItem;
