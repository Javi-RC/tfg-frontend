import i18n from '../i18n';

/**
 * Extracts a helpful user-facing message from an Axios error.
 * Falls back to status + a generic message when the API response
 * doesn't match the expected shape.
 */
export function getApiErrorMessage(error, fallbackMessage = i18n.t('common.requestFailed')) {
  const status = error?.response?.status;
  const data = error?.response?.data;

  const candidates = [
    // Common API shapes
    data?.error,
    data?.message,
    data?.msg,
    data?.detail,
    // Sometimes error is nested
    data?.error?.message,
    data?.error?.detail,
    // Validation arrays
    Array.isArray(data?.errors)
      ? data.errors
          .flatMap((e) => {
            const v = e?.message || e?.msg || e?.detail || e;
            return v ? [v] : [];
          })
          .join('\n')
      : undefined,
  ].filter(Boolean);

  const message = candidates[0] || error?.message || fallbackMessage;

  return status ? `${status} - ${message}` : message;
}
