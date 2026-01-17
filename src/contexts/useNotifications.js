import { useContext } from 'react';
import { NotificationContext } from './NotificationContext';

/**
 * Hook personalizado para usar el contexto de notificaciones
 * @throws {Error} Si se usa fuera del NotificationProvider
 * @returns {Object} Contexto de notificaciones
 */
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications debe usarse dentro de NotificationProvider');
  }
  return context;
}
