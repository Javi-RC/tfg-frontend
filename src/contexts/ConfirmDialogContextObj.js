import { createContext } from 'react';

/**
 * Provides `confirm(options) => Promise<boolean>`.
 * Kept in its own module so the provider file only exports components.
 */
export const ConfirmDialogContext = createContext(null);
