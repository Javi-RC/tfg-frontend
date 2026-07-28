import api from './axios';
import i18n from '../i18n';

/**
 * NotificationService
 * Servicio para consumir la API de notificaciones in-app
 * Base URL: /api/notifications
 *
 * Endpoints disponibles:
 * - GET /api/notifications - Obtener notificaciones paginadas
 * - GET /api/notifications/unread-count - Obtener conteo de no leídas
 * - PATCH /api/notifications/:id/read - Marcar una como leída
 * - PATCH /api/notifications/read-all - Marcar todas como leídas
 * - PATCH /api/notifications/:id/archive - Archivar notificación
 * - DELETE /api/notifications/:id - Eliminar notificación
 *
 * Soporte de idioma:
 * El backend acepta el idioma mediante (en orden de prioridad):
 * 1. Query param: ?lang=en
 * 2. Usuario: req.user.preferredLanguage
 * 3. Organización: req.user.organization.defaultLanguage
 * 4. Header: Accept-Language
 *
 * Este servicio envía tanto el query param como el header para máxima compatibilidad.
 */
class NotificationService {
  /**
   * Obtiene el código de idioma actual del sistema i18n
   * @returns {string} Código de idioma (en, es, etc.)
   * @private
   */
  _getCurrentLanguage() {
    const storedLanguage = localStorage.getItem('i18nextLng');
    const rawLanguage = storedLanguage || i18n.language || 'en';
    const lang = rawLanguage.split('-')[0]; // Extract base language (en, es)
    return lang;
  }

  /**
   * Obtener notificaciones del usuario con paginación y filtros
   * @param {Object} params - Parámetros de filtrado
   * @param {number} params.page - Página actual (default: 1)
   * @param {number} params.limit - Cantidad de notificaciones por página (default: 20)
   * @param {boolean} params.unreadOnly - Solo notificaciones no leídas (default: false)
   * @param {boolean} params.includeArchived - Incluir archivadas (default: false)
   * @param {string} params.type - Filtrar por tipo de notificación
   * @param {string} params.priority - Filtrar por prioridad (low, medium, high, urgent)
   * @returns {Promise} - Respuesta con { notifications: [], pagination: { page, limit, total, pages } }
   */
  async getNotifications(params = {}) {
    const queryParams = {
      page: params.page || 1,
      limit: params.limit || 20,
      unreadOnly: params.unreadOnly || false,
      includeArchived: params.includeArchived || false,
      lang: this._getCurrentLanguage(),
      ...(params.type && { type: params.type }),
      ...(params.priority && { priority: params.priority }),
    };
    const response = await api.get('/api/notifications', { params: queryParams });
    return response.data;
  }

  /**
   * Obtener conteo de notificaciones no leídas (para el badge)
   * @returns {Promise} - Respuesta con { count: number }
   */
  async getUnreadCount() {
    const queryParams = {
      lang: this._getCurrentLanguage(),
    };
    const response = await api.get('/api/notifications/unread-count', { params: queryParams });
    return response.data;
  }

  /**
   * Marcar una notificación como leída
   * @param {string} notificationId - ID de la notificación
   * @returns {Promise} - Respuesta de la operación
   */
  async markAsRead(notificationId) {
    const queryParams = {
      lang: this._getCurrentLanguage(),
    };
    const response = await api.patch(`/api/notifications/${notificationId}/read`, null, {
      params: queryParams,
    });
    return response.data;
  }

  /**
   * Marcar todas las notificaciones como leídas
   * @returns {Promise} - Respuesta de la operación
   */
  async markAllAsRead() {
    const queryParams = {
      lang: this._getCurrentLanguage(),
    };
    const response = await api.patch('/api/notifications/read-all', null, { params: queryParams });
    return response.data;
  }

  /**
   * Archivar una notificación
   * @param {string} notificationId - ID de la notificación
   * @returns {Promise} - Respuesta de la operación
   */
  async archiveNotification(notificationId) {
    const queryParams = {
      lang: this._getCurrentLanguage(),
    };
    const response = await api.patch(`/api/notifications/${notificationId}/archive`, null, {
      params: queryParams,
    });
    return response.data;
  }

  /**
   * Eliminar una notificación permanentemente
   * @param {string} notificationId - ID de la notificación
   * @returns {Promise} - Respuesta de la operación
   */
  async deleteNotification(notificationId) {
    const queryParams = {
      lang: this._getCurrentLanguage(),
    };
    const response = await api.delete(`/api/notifications/${notificationId}`, {
      params: queryParams,
    });
    return response.data;
  }
}

export default new NotificationService();
