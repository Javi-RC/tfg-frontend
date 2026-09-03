import api from './axios';
import { ATTEMPT_TIMEOUT_MS } from '../constants/warmup';

/**
 * Readiness probe for the boot sequence.
 *
 * The backend gates every route on a live Mongo connection and answers 503
 * while it is still cold, so a 200 here means both "lambda booted" and
 * "database connected". No authentication required.
 *
 * @param {{ signal?: AbortSignal, timeout?: number }} [config]
 */
export const pingHealth = ({ signal, timeout = ATTEMPT_TIMEOUT_MS } = {}) =>
  api.get('/health', { signal, timeout });
