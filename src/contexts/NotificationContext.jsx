import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import notificationService from '../api/notificationService';

const NotificationContext = createContext();

/**
 * NotificationProvider Component
 * Proveedor de contexto global para el sistema de notificaciones
 * Gestiona el estado de las notificaciones, conteo de no leídas y operaciones CRUD
 */
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  /**
   * Obtener conteo de notificaciones no leídas
   */
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await notificationService.getUnreadCount();
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Error al obtener conteo de notificaciones:', error);
    }
  }, []);

  /**
   * Obtener lista de notificaciones
   * @param {number} page - Número de página
   * @param {number} limit - Límite de notificaciones por página
   * @returns {Promise} - Datos de la respuesta
   */
  const fetchNotifications = useCallback(async (page = 1, limit = 20) => {
    setLoading(true);
    try {
      const response = await notificationService.getNotifications({
        page,
        limit,
        unreadOnly: false
      });
      setNotifications(response.data.notifications);
      return response.data;
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Marcar una notificación como leída
   * @param {string} notificationId - ID de la notificación
   */
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n => n._id === notificationId ? { ...n, readAt: new Date() } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
    }
  }, []);

  /**
   * Marcar todas las notificaciones como leídas
   */
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev =>
        prev.map(n => ({ ...n, readAt: new Date() }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error al marcar todas las notificaciones como leídas:', error);
    }
  }, []);

  /**
   * Eliminar una notificación
   * @param {string} notificationId - ID de la notificación
   */
  const deleteNotification = useCallback(async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      fetchUnreadCount();
    } catch (error) {
      console.error('Error al eliminar notificación:', error);
    }
  }, [fetchUnreadCount]);

  /**
   * Archivar una notificación
   * @param {string} notificationId - ID de la notificación
   */
  const archiveNotification = useCallback(async (notificationId) => {
    try {
      await notificationService.archiveNotification(notificationId);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      fetchUnreadCount();
    } catch (error) {
      console.error('Error al archivar notificación:', error);
    }
  }, [fetchUnreadCount]);

  // Cargar conteo inicial y configurar polling
  useEffect(() => {
    fetchUnreadCount();
    
    // Polling cada 30 segundos para actualizar el conteo
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  const value = {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    archiveNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

/**
 * Hook personalizado para usar el contexto de notificaciones
 * @throws {Error} Si se usa fuera del NotificationProvider
 * @returns {Object} Contexto de notificaciones
 */
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications debe usarse dentro de NotificationProvider');
  }
  return context;
};
