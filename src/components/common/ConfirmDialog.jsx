import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { trapFocus } from '../../utils/focusManagement';
import './ConfirmDialog.css';

/**
 * Modal confirmation, replacing `window.confirm`.
 *
 * Beyond matching the rest of the interface, this restores the behaviour the
 * native dialog does not offer: it is translated, it can mark a destructive
 * action, it traps focus, it closes on Escape, and it returns focus to whatever
 * opened it.
 *
 * @param {object} props
 * @param {string} [props.title]
 * @param {string} props.message
 * @param {string} [props.confirmLabel]
 * @param {string} [props.cancelLabel]
 * @param {boolean} [props.destructive] Styles the accept button as a destructive action.
 * @param {() => void} props.onConfirm
 * @param {() => void} props.onCancel
 */
export default function ConfirmDialog({
  title,
  message,
  confirmLabel,
  cancelLabel,
  destructive = false,
  onConfirm,
  onCancel,
}) {
  const { t } = useTranslation();
  const dialogRef = useRef(null);
  const acceptRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  useEffect(() => {
    previouslyFocusedRef.current = document.activeElement;
    acceptRef.current?.focus();

    const releaseFocus = trapFocus(dialogRef.current);

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      releaseFocus();
      // Hand focus back to the control that opened the dialog.
      previouslyFocusedRef.current?.focus?.();
    };
  }, [onCancel]);

  return (
    <div
      className="confirm-dialog-backdrop"
      // Clicking the backdrop cancels, matching every other modal in the app.
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <div
        className="confirm-dialog"
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={title ? 'confirm-dialog-title' : undefined}
        aria-describedby="confirm-dialog-message"
      >
        {title && (
          <h2 className="confirm-dialog-title" id="confirm-dialog-title">
            {title}
          </h2>
        )}
        <p className="confirm-dialog-message" id="confirm-dialog-message">
          {message}
        </p>
        <div className="confirm-dialog-actions">
          <button type="button" className="confirm-dialog-button confirm-dialog-cancel" onClick={onCancel}>
            {cancelLabel || t('common.cancel')}
          </button>
          <button
            type="button"
            ref={acceptRef}
            className={`confirm-dialog-button confirm-dialog-accept${destructive ? ' is-destructive' : ''}`}
            onClick={onConfirm}
          >
            {confirmLabel || t('common.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}
