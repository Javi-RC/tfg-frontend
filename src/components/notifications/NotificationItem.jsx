import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '../../hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import { getNotificationTypeIcon } from '../../types/notificationTypes';
import './NotificationItem.css';

/**
 * Normaliza la prioridad traducida del backend a códigos fijos
 * @param {string} priority - Prioridad del backend (puede estar traducida)
 * @returns {string} Código de prioridad normalizado (urgent, high, medium, low)
 */
const normalizePriority = (priority) => {
  if (!priority) return 'medium';

  const lowerPriority = priority.toLowerCase();

  // Mapeo de prioridades en diferentes idiomas
  const priorityMap = {
    // English
    urgent: 'urgent',
    high: 'high',
    medium: 'medium',
    low: 'low',
    // Spanish
    urgente: 'urgent',
    alta: 'high',
    media: 'medium',
    baja: 'low',
    // Just in case
    critical: 'urgent',
    crítica: 'urgent',
  };

  return priorityMap[lowerPriority] || 'medium';
};

/**
 * NotificationItem Component
 * Single notification item.
 * Shows title, message, relative time, and actions.
 *
 * Estructura de una notificación:
 * {
 *   _id: string,
 *   type: string (cv_processed, org_employee_added, etc.),
 *   title: string,
 *   message: string,
 *   priority: 'low' | 'medium' | 'high' | 'urgent' (puede venir traducido del backend),
 *   readAt: Date | null,
 *   actionUrl: string (URL para navegar),
 *   actionText: string,
 *   createdAt: Date
 * }
 */
const NotificationItem = ({ notification, onClose }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { markAsRead, deleteNotification } = useNotifications();
  const isUnread = !notification.readAt;

  // Normalizar la prioridad traducida del backend
  const normalizedPriority = normalizePriority(notification.priority);

  const handleClick = async () => {
    if (isUnread) {
      await markAsRead(notification._id);
    }

    // If it has an action URL, navigate using React Router
    if (notification.actionUrl) {
      // Check whether the URL is internal or external
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

  const timeLocale = i18n.language?.toLowerCase().startsWith('es') ? es : enUS;
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
    locale: timeLocale,
  });

  const priorityClass = `priority-${normalizedPriority}`;

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
        {isUnread && <span className="unread-dot" aria-label={t('notifications.aria.unread')} />}
        <NotificationIcon type={notification.type} />
      </div>

      <div className="notification-content">
        <div className="notification-title">{notification.title}</div>
        <div className="notification-message">{notification.message}</div>
        <div className="notification-meta">
          <span className="notification-time">{timeAgo}</span>
          {normalizedPriority === 'urgent' && (
            <span className="urgent-badge">{notification.priority}</span>
          )}
          {normalizedPriority === 'high' && (
            <span className="high-badge">{notification.priority}</span>
          )}
        </div>
      </div>

      <button
        type="button"
        className="notification-delete-btn"
        onClick={handleDelete}
        aria-label={t('notifications.aria.delete')}
        title={t('common.delete')}
      >
        <X size={16} />
      </button>
    </div>
  );
};

/**
 * NotificationIcon Component
 * Renderiza el icono apropiado según el tipo de notificación
 */
const NotificationIcon = ({ type }) => {
  const { t } = useTranslation();
  const IconComponent = getNotificationTypeIcon(type);

  return (
    <span
      className="notification-icon"
      role="img"
      aria-label={t('notifications.aria.type', { type })}
    >
      <IconComponent size={24} />
    </span>
  );
};

export default NotificationItem;
