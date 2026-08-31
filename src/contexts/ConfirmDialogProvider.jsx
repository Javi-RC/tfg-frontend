import React, { useCallback, useMemo, useRef, useState } from 'react';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { ConfirmDialogContext } from './ConfirmDialogContextObj';

/**
 * Hosts the single confirmation dialog and exposes an awaitable `confirm`.
 *
 * The promise is resolved from the dialog's own callbacks, which lets call sites
 * keep the straight-line shape they had with `window.confirm`:
 *
 *   if (!(await confirm({ message })) ) return;
 */
export function ConfirmDialogProvider({ children }) {
  const [request, setRequest] = useState(null);
  const resolverRef = useRef(null);

  const settle = useCallback((accepted) => {
    setRequest(null);
    resolverRef.current?.(accepted);
    resolverRef.current = null;
  }, []);

  const confirm = useCallback((options) => {
    // A second call while one is open resolves the first as cancelled, so no
    // caller is left awaiting a promise that can never settle.
    resolverRef.current?.(false);

    const normalized = typeof options === 'string' ? { message: options } : options || {};

    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setRequest(normalized);
    });
  }, []);

  const value = useMemo(() => ({ confirm }), [confirm]);

  return (
    <ConfirmDialogContext.Provider value={value}>
      {children}
      {request && (
        <ConfirmDialog
          {...request}
          onConfirm={() => settle(true)}
          onCancel={() => settle(false)}
        />
      )}
    </ConfirmDialogContext.Provider>
  );
}

export default ConfirmDialogProvider;
