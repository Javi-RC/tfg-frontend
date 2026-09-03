// Tuning for the boot-time backend warm-up probe.
//
// The API runs as a Vercel serverless function backed by Mongo Atlas, so the
// first request after an idle period pays for both the lambda booting and the
// database connecting. These numbers are picked against what the backend
// actually does, not from intuition — see each one for its reasoning.

/**
 * Lifecycle of the warm-up probe.
 *
 * READY is terminal on purpose: once the backend has answered we never gate
 * again. A failure after that point belongs to the feature that hit it, not to
 * the boot sequence.
 */
export const WARMUP_STATUS = Object.freeze({
  IDLE: 'idle', // disabled, or not started yet
  PROBING: 'probing', // a request is in flight, or a backoff is pending
  READY: 'ready', // the backend answered — terminal
  FAILED: 'failed', // deadline spent; only retry() leaves this state
});

/** Copy stages, driven purely by elapsed time. No fabricated pipeline steps. */
export const WARMUP_STAGE = Object.freeze({
  CONNECTING: 'connecting',
  STARTING: 'starting',
  SLOW: 'slow',
});

/**
 * Ceiling for one probe.
 *
 * The backend gates every route on a live Mongo connection and waits up to
 * DB_WAIT_TIMEOUT_MS (8s by default) before giving up with a 503. Add ~1-2s of
 * lambda boot on top. Anything under ~10s would abort precisely the request
 * that was about to succeed, throwing away the cold start we just paid for.
 *
 * Deliberately below the shared DEFAULT_TIMEOUT_MS of 20s in api/axios.js:
 * that one is tuned for CRUD calls the user is waiting on, not for a probe we
 * intend to repeat.
 */
export const ATTEMPT_TIMEOUT_MS = 12_000;

/** Never fire a request with less than this left — it could only time out. */
export const MIN_ATTEMPT_TIMEOUT_MS = 1_000;

/**
 * Backoff before each attempt, indexed by attempt number. Past the table, the
 * last value repeats.
 *
 * Short on purpose: the backend's own 8s database wait already *is* the
 * backoff. An attempt costs up to 12s of wall clock, so a long delay between
 * attempts would just burn the deadline doing nothing. Worst case is roughly
 * four requests per cold boot — negligible against the backend's global rate
 * limit of 300 requests per 15 minutes.
 */
export const RETRY_DELAYS_MS = Object.freeze([0, 500, 1_500, 3_000, 5_000]);

/**
 * Total budget before giving up and showing the retry screen.
 *
 * Covers a lambda cold start plus a fresh Atlas connection at p99. Past this,
 * something is genuinely wrong, and an honest error with a button beats an
 * infinite spinner. Raise to 60s if a paused M0 cluster proves slower.
 */
export const OVERALL_DEADLINE_MS = 45_000;

/**
 * How long the probe gets before the splash is allowed to mount.
 *
 * A warm /health answers in roughly 100-250ms, so this sits above that band and
 * the splash never renders a single frame on a warm backend. It is also around
 * the floor below which an appear-then-vanish spinner reads as a flicker —
 * worse than showing nothing at all.
 */
export const SPLASH_REVEAL_DELAY_MS = 400;

/** How often the splash recomputes elapsed time to advance its copy. */
export const STAGE_TICK_MS = 1_000;

/** Roughly where "this should have been instant" becomes conscious. */
export const STAGE_STARTING_MS = 4_000;

/**
 * Past the backend's own 8s database wait, so the first attempt has certainly
 * failed by now — which makes "longer than usual" literally true.
 */
export const STAGE_SLOW_MS = 12_000;
