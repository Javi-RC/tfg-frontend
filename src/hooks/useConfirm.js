import { useContext } from 'react';
import { ConfirmDialogContext } from '../contexts/ConfirmDialogContextObj';

/**
 * Returns `confirm(options) => Promise<boolean>`.
 *
 * `options` is either a message string or
 * `{ title?, message, confirmLabel?, cancelLabel?, destructive? }`.
 *
 * @throws When used outside ConfirmDialogProvider, so a missing provider fails
 *         loudly at development time instead of silently blocking an action.
 */
export function useConfirm() {
  const context = useContext(ConfirmDialogContext);

  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmDialogProvider');
  }

  return context.confirm;
}
