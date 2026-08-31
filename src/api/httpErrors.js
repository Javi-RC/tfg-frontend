/**
 * Classification of transport-level Axios failures.
 *
 * These three cases carry no HTTP response, so `error.response` is undefined and
 * the usual `error.response.data.error` extraction yields nothing. Telling them
 * apart is what lets the UI say "the server took too long" instead of the
 * catch-all "something went wrong".
 */

/** The request exceeded its configured timeout. */
export const isTimeoutError = (error) =>
  error?.code === 'ECONNABORTED' || error?.code === 'ETIMEDOUT';

/** The caller aborted the request — a component unmounted, or newer input superseded it. */
export const isCanceledError = (error) =>
  error?.code === 'ERR_CANCELED' || error?.name === 'CanceledError' || error?.name === 'AbortError';

/** The request never reached the server (offline, DNS failure, CORS rejection). */
export const isNetworkError = (error) =>
  !error?.response && !isTimeoutError(error) && !isCanceledError(error);

/**
 * A canceled request is an expected outcome, not a failure: the caller asked for
 * it. Callers use this to skip both the error state and the toast.
 */
export const isReportableError = (error) => !isCanceledError(error);
