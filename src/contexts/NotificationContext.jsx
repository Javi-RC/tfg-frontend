import { useState, useEffect, useCallback } from 'react';
import notificationService from '../api/notificationService';
import { getUser } from '../api/tokenStore';
import { NotificationContext } from './NotificationContextObj';

// Intervalo de polling en milisegundos (30 segundos)
const POLLING_INTERVAL = 30000;

/**
 * NotificationProvider Component
 * Proveedor de contexto global para el sistema de notificaciones in-app
 * Gestiona el estado de las notificaciones, conteo de no leídas y operaciones CRUD
 *
 * Consume la API: /api/notifications
 *
 * Funcionalidades:
 * - Polling automático cada 30 segundos para actualizar el badge
 * - Carga de notificaciones al abrir el panel
 * - Marcar como leída individual o todas
 * - Eliminar y archivar notificaciones
 */
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });

  /**
   * Obtener conteo de notificaciones no leídas (para el badge)
   * Se ejecuta al cargar la app y cada 30 segundos
   */
  const fetchUnreadCount = useCallback(async () => {
    // Solo ejecutar si hay token de autenticación
    if (!getUser()) return;

    try {
      const responseData = await notificationService.getUnreadCount();
      // La respuesta del backend es: { success, data: { count } }
      if (
        responseData?.success &&
        responseData?.data &&
        typeof responseData.data.count === 'number'
      ) {
        setUnreadCount(responseData.data.count);
      } else if (responseData && typeof responseData.count === 'number') {
        // Fallback por si el backend devuelve directamente { count }
        setUnreadCount(responseData.count);
      }
    } catch {
      // Silenciar errores (incluye 401 / sesión expirada)
    }
  }, []);

  /**
   * Obtener lista de notificaciones paginada
   * @param {Object} options - Opciones de paginación y filtrado
   * @param {number} options.page - Número de página (default: 1)
   * @param {number} options.limit - Límite por página (default: 20)
   * @param {boolean} options.unreadOnly - Solo no leídas (default: false)
   * @param {boolean} options.includeArchived - Incluir archivadas (default: false)
   * @returns {Promise<Object|null>} - Datos de la respuesta o null si falla
   */
  const fetchNotifications = useCallback(async (options = {}) => {
    // Solo ejecutar si hay token de autenticación
    if (!getUser()) return null;

    setLoading(true);
    try {
      const responseData = await notificationService.getNotifications({
        page: options.page || 1,
        limit: options.limit || 20,
        unreadOnly: options.unreadOnly || false,
        includeArchived: options.includeArchived || false,
      });

      if (responseData?.success && responseData?.data) {
        // Estructura estándar del backend
        setNotifications(responseData.data.notifications || []);
        if (responseData.data.pagination) {
          setPagination(responseData.data.pagination);
        }
        return responseData.data;
      } else if (responseData?.notifications) {
        // Fallback por si el backend devuelve directamente { notifications, pagination }
        setNotifications(responseData.notifications || []);
        if (responseData.pagination) {
          setPagination(responseData.pagination);
        }
        return responseData;
      }
      return null;
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Marcar una notificación como leída
   * @param {string} notificationId - ID de la notificación
   * @returns {Promise<boolean>} - true si fue exitoso
   */
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, readAt: new Date().toISOString() } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      return true;
    } catch {
      return false;
    }
  }, []);

  /**
   * Marcar todas las notificaciones como leídas
   * @returns {Promise<boolean>} - true si fue exitoso
   */
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, readAt: n.readAt || new Date().toISOString() }))
      );
      setUnreadCount(0);
      return true;
    } catch {
      return false;
    }
  }, []);

  /**
   * Eliminar una notificación permanentemente
   * @param {string} notificationId - ID de la notificación
   * @returns {Promise<boolean>} - true si fue exitoso
   */
  const deleteNotification = useCallback(
    async (notificationId) => {
      try {
        // Verificar si la notificación era no leída antes de eliminar
        const notification = notifications.find((n) => n._id === notificationId);
        const wasUnread = notification && !notification.readAt;

        await notificationService.deleteNotification(notificationId);
        setNotifications((prev) => prev.filter((n) => n._id !== notificationId));

        // Decrementar contador solo si era no leída
        if (wasUnread) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
        return true;
      } catch {
        return false;
      }
    },
    [notifications]
  );

  /**
   * Archivar una notificación
   * @param {string} notificationId - ID de la notificación
   * @returns {Promise<boolean>} - true si fue exitoso
   */
  const archiveNotification = useCallback(
    async (notificationId) => {
      try {
        // Verificar si la notificación era no leída antes de archivar
        const notification = notifications.find((n) => n._id === notificationId);
        const wasUnread = notification && !notification.readAt;

        await notificationService.archiveNotification(notificationId);
        setNotifications((prev) => prev.filter((n) => n._id !== notificationId));

        // Decrementar contador solo si era no leída
        if (wasUnread) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
        return true;
      } catch {
        return false;
      }
    },
    [notifications]
  );

  /**
   * Refrescar el estado de notificaciones
   * Útil después de acciones que podrían generar nuevas notificaciones
   */
  const refresh = useCallback(async () => {
    await Promise.all([fetchUnreadCount(), fetchNotifications()]);
  }, [fetchUnreadCount, fetchNotifications]);

  // Cargar conteo inicial y configurar polling solo si está autenticado
  useEffect(() => {
    if (!getUser()) return;

    // Carga inicial
    fetchUnreadCount();

    // Polling cada 30 segundos para actualizar el badge
    const interval = setInterval(fetchUnreadCount, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  const value = {
    notifications,
    unreadCount,
    loading,
    pagination,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    archiveNotification,
    refresh,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export default NotificationProvider;
