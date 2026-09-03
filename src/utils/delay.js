/**
 * Waits `ms`, or gives up early when `signal` aborts.
 *
 * Resolves rather than rejects on abort so callers can await it inside a loop
 * without wrapping every wait in a try/catch — the boolean says which happened.
 *
 * @param {number} ms
 * @param {AbortSignal} [signal]
 * @returns {Promise<boolean>} true if the wait finished, false if aborted.
 */
export function delay(ms, signal) {
  return new Promise((resolve) => {
    if (signal?.aborted) {
      resolve(false);
      return;
    }

    const onAbort = () => {
      clearTimeout(timer);
      resolve(false);
    };

    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve(true);
    }, ms);

    signal?.addEventListener('abort', onAbort, { once: true });
  });
}
