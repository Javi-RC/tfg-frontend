import { toast } from 'sonner';

/**
 * Toast utility functions
 * Wraps sonner toast for consistent UX feedback across the app
 */
export const showSuccess = (message, options) =>
  toast.success(message, options);

export const showError = (message, options) =>
  toast.error(message, options);

export const showInfo = (message, options) =>
  toast(message, options);
