// Decision logic for the boot-time warm-up probe. Pure functions only: no
// React, no axios, no clock of its own — every caller passes elapsed time in.
// That is what makes the retry policy testable without faking a network.
import { isCanceledError } from '../api/httpErrors';
import {
  ATTEMPT_TIMEOUT_MS,
  MIN_ATTEMPT_TIMEOUT_MS,
  OVERALL_DEADLINE_MS,
  RETRY_DELAYS_MS,
  STAGE_SLOW_MS,
  STAGE_STARTING_MS,
  WARMUP_STAGE,
} from '../constants/warmup';

/**
 * How long to wait before attempt `attempt` (0-based). Beyond the table the
 * last delay repeats, so the schedule never runs out.
 *
 * @param {number} attempt
 * @returns {number} milliseconds
 */
export function getRetryDelayMs(attempt) {
  const index = Math.min(Math.max(attempt, 0), RETRY_DELAYS_MS.length - 1);
  return RETRY_DELAYS_MS[index];
}

/**
 * Timeout for the next attempt, clamped to whatever is left of the overall
 * budget. Returns 0 when there is no useful budget left — callers read that as
 * "give up", which is why the deadline needs no separate timer.
 *
 * @param {number} elapsedMs Time since the run started.
 * @returns {number} milliseconds, or 0 to stop
 */
export function getAttemptTimeoutMs(elapsedMs) {
  const remaining = OVERALL_DEADLINE_MS - elapsedMs;
  if (remaining < MIN_ATTEMPT_TIMEOUT_MS) return 0;
  return Math.min(ATTEMPT_TIMEOUT_MS, remaining);
}

/**
 * Whether the run has spent its budget.
 *
 * @param {number} elapsedMs
 * @returns {boolean}
 */
export function hasDeadlinePassed(elapsedMs) {
  return getAttemptTimeoutMs(elapsedMs) === 0;
}

/**
 * Which message the splash should show, from elapsed time alone.
 *
 * @param {number} elapsedMs
 * @returns {string} a WARMUP_STAGE value
 */
export function getStage(elapsedMs) {
  if (elapsedMs >= STAGE_SLOW_MS) return WARMUP_STAGE.SLOW;
  if (elapsedMs >= STAGE_STARTING_MS) return WARMUP_STAGE.STARTING;
  return WARMUP_STAGE.CONNECTING;
}

/**
 * Whether a successful response means the backend is up.
 *
 * Any 2xx counts; the body is deliberately not inspected. When VITE_API_URL is
 * unset the axios baseURL is '' and vercel.json's SPA rewrite answers GET
 * /health with 200 and the index HTML. A strict `data.status === 'OK'` check
 * would then read a perfectly healthy same-origin deployment as permanently
 * cold and park every user on the failure screen. Failing open degrades the
 * gate to a no-op instead — which is exactly today's behaviour.
 *
 * @param {import('axios').AxiosResponse} res
 * @returns {boolean}
 */
export function isReadyResponse(res) {
  const status = res?.status;
  return typeof status === 'number' && status >= 200 && status < 300;
}

/**
 * Whether a *failed* probe nevertheless proves the backend is awake.
 *
 * The backend puts its Mongo-readiness middleware ahead of every route and
 * answers 503 {success:false,error:'Database not connected'} while cold. So any
 * status below 500 means the request got past that gate: the lambda booted and
 * the database is connected. A 404 (a misconfigured VITE_API_URL path) still
 * counts as awake — the real endpoints will report their own errors, which is
 * more useful than a boot screen that never clears.
 *
 * The one status produced *before* the database gate is 429, from the global
 * rate limiter. We treat it as awake too: the lambda plainly responded, and
 * probing harder is precisely the wrong answer to a rate limit.
 *
 * 5xx (the cold-database 503 included), timeouts, and no response at all
 * (offline, DNS, a CORS rejection) are all retryable.
 *
 * @param {unknown} error
 * @returns {boolean}
 */
export function isBackendAwakeError(error) {
  if (isCanceledError(error)) return false;
  const status = error?.response?.status;
  return typeof status === 'number' && status < 500;
}
