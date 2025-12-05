import api from './axios';

class NotificationService {
  /**
   * Obtener notificaciones del usuario
   * @param {Object} params - Parámetros de filtrado
   * @param {number} params.page - Página actual
   * @param {number} params.limit - Cantidad de notificaciones por página
   * @param {boolean} params.unreadOnly - Solo notificaciones no leídas
   * @param {string} params.type - Filtrar por tipo de notificación
   * @param {string} params.priority - Filtrar por prioridad
   * @returns {Promise} - Respuesta con notificaciones
   */
  async getNotifications(params = {}) {
    const response = await api.get('/api/notifications', { params });
    return response;
  }

  /**
   * Obtener conteo de notificaciones no leídas
   * @returns {Promise} - Respuesta con el conteo
   */
  async getUnreadCount() {
    const response = await api.get('/api/notifications/unread-count');
    return response;
  }

  /**
   * Obtener estadísticas de notificaciones
   * @returns {Promise} - Respuesta con estadísticas
   */
  async getStats() {
    const response = await api.get('/api/notifications/stats');
    return response;
  }

  /**
   * Marcar una notificación como leída
   * @param {string} notificationId - ID de la notificación
   * @returns {Promise} - Respuesta de la operación
   */
  async markAsRead(notificationId) {
    const response = await api.patch(`/api/notifications/${notificationId}/read`);
    return response;
  }

  /**
   * Marcar múltiples notificaciones como leídas
   * @param {Array<string>} notificationIds - Array de IDs de notificaciones
   * @returns {Promise} - Respuesta de la operación
   */
  async markMultipleAsRead(notificationIds) {
    const response = await api.patch('/api/notifications/read-multiple', {
      notificationIds
    });
    return response;
  }

  /**
   * Marcar todas las notificaciones como leídas
   * @returns {Promise} - Respuesta de la operación
   */
  async markAllAsRead() {
    const response = await api.patch('/api/notifications/read-all');
    return response;
  }

  /**
   * Archivar una notificación
   * @param {string} notificationId - ID de la notificación
   * @returns {Promise} - Respuesta de la operación
   */
  async archiveNotification(notificationId) {
    const response = await api.patch(`/api/notifications/${notificationId}/archive`);
    return response;
  }

  /**
   * Eliminar una notificación
   * @param {string} notificationId - ID de la notificación
   * @returns {Promise} - Respuesta de la operación
   */
  async deleteNotification(notificationId) {
    const response = await api.delete(`/api/notifications/${notificationId}`);
    return response;
  }
}

export default new NotificationService();
