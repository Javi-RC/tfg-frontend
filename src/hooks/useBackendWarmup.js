import { useCallback, useEffect, useState } from 'react';
import { pingHealth } from '../api/health';
import { isCanceledError } from '../api/httpErrors';
import { WARMUP_STATUS } from '../constants/warmup';
import { delay } from '../utils/delay';
import {
  getAttemptTimeoutMs,
  getRetryDelayMs,
  isBackendAwakeError,
  isReadyResponse,
} from '../utils/warmup';

/**
 * Polls the backend until it answers, so the application can boot against a
 * warm API instead of racing a cold serverless function.
 *
 *   IDLE ──mount──▶ PROBING ──2xx, or any status below 500──▶ READY (terminal)
 *                      │  ▲
 *                      │  └── 5xx / network / timeout, budget left ──┘
 *                      │
 *                      └── budget spent ──▶ FAILED ──retry()──▶ PROBING
 *
 * @param {{ enabled?: boolean }} [options]
 * @returns {{ status: string, attempt: number, startedAt: number, retry: () => void }}
 */
export function useBackendWarmup({ enabled = true } = {}) {
  // One object so retry() changes the clock and re-keys the effect atomically.
  // Its identity is stable across re-renders, so only a retry restarts probing.
  const [run, setRun] = useState(() => ({ id: 0, startedAt: Date.now() }));
  const [state, setState] = useState({ status: WARMUP_STATUS.IDLE, attempt: 0 });

  useEffect(() => {
    if (!enabled) return undefined;

    const controller = new AbortController();
    const { signal } = controller;
    const { startedAt } = run;

    // No "already ran" ref here. Under StrictMode a latch would be actively
    // wrong: the first pass sets it, cleanup aborts the request, and the second
    // pass then does nothing — leaving the gate hung forever. Aborting instead
    // costs one canceled /health in development and nothing in production.
    let cancelled = false;
    const commit = (next) => {
      if (!cancelled) setState(next);
    };

    (async () => {
      for (let attempt = 0; !cancelled; attempt += 1) {
        const backoff = getRetryDelayMs(attempt);
        if (backoff > 0 && !(await delay(backoff, signal))) return;
        if (cancelled) return;

        const timeout = getAttemptTimeoutMs(Date.now() - startedAt);
        if (timeout === 0) {
          commit({ status: WARMUP_STATUS.FAILED, attempt });
          return;
        }

        commit({ status: WARMUP_STATUS.PROBING, attempt });

        try {
          const res = await pingHealth({ signal, timeout });
          if (isReadyResponse(res)) {
            commit({ status: WARMUP_STATUS.READY, attempt });
            return;
          }
        } catch (error) {
          if (isCanceledError(error)) return;
          if (isBackendAwakeError(error)) {
            commit({ status: WARMUP_STATUS.READY, attempt });
            return;
          }
          // 5xx (including the cold-database 503), a network error, or a
          // timeout: the backend is still waking. Loop round and try again.
        }
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [enabled, run]);

  const retry = useCallback(() => {
    setRun((prev) => ({ id: prev.id + 1, startedAt: Date.now() }));
    setState({ status: WARMUP_STATUS.PROBING, attempt: 0 });
  }, []);

  return { ...state, startedAt: run.startedAt, retry };
}

export default useBackendWarmup;
