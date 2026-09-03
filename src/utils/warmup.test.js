import {
  getAttemptTimeoutMs,
  getRetryDelayMs,
  getStage,
  hasDeadlinePassed,
  isBackendAwakeError,
  isReadyResponse,
} from './warmup';
import { WARMUP_STAGE } from '../constants/warmup';

describe('getRetryDelayMs', () => {
  it('fires the first attempt immediately', () => {
    expect(getRetryDelayMs(0)).toBe(0);
  });

  it('follows the backoff table', () => {
    expect(getRetryDelayMs(1)).toBe(500);
    expect(getRetryDelayMs(2)).toBe(1500);
    expect(getRetryDelayMs(3)).toBe(3000);
    expect(getRetryDelayMs(4)).toBe(5000);
  });

  it('repeats the last delay past the end of the table', () => {
    expect(getRetryDelayMs(9)).toBe(5000);
    expect(getRetryDelayMs(100)).toBe(5000);
  });
});

describe('getAttemptTimeoutMs', () => {
  it('gives an attempt the full ceiling while the budget is wide open', () => {
    expect(getAttemptTimeoutMs(0)).toBe(12000);
    expect(getAttemptTimeoutMs(30000)).toBe(12000);
  });

  it('clamps the last attempt to what is left of the deadline', () => {
    expect(getAttemptTimeoutMs(40000)).toBe(5000);
  });

  it('returns 0 once the deadline is spent', () => {
    expect(getAttemptTimeoutMs(45000)).toBe(0);
    expect(getAttemptTimeoutMs(60000)).toBe(0);
  });

  it('returns 0 when too little is left for the request to be worth firing', () => {
    expect(getAttemptTimeoutMs(44500)).toBe(0);
  });
});

describe('hasDeadlinePassed', () => {
  it('is false with budget remaining and true once it is gone', () => {
    expect(hasDeadlinePassed(44000)).toBe(false);
    expect(hasDeadlinePassed(45000)).toBe(true);
  });
});

describe('getStage', () => {
  it('starts on the connecting copy', () => {
    expect(getStage(0)).toBe(WARMUP_STAGE.CONNECTING);
    expect(getStage(3999)).toBe(WARMUP_STAGE.CONNECTING);
  });

  it('moves to the starting copy at four seconds', () => {
    expect(getStage(4000)).toBe(WARMUP_STAGE.STARTING);
    expect(getStage(11999)).toBe(WARMUP_STAGE.STARTING);
  });

  it('moves to the slow copy at twelve seconds', () => {
    expect(getStage(12000)).toBe(WARMUP_STAGE.SLOW);
    expect(getStage(60000)).toBe(WARMUP_STAGE.SLOW);
  });
});

describe('isReadyResponse', () => {
  it('accepts any 2xx', () => {
    expect(isReadyResponse({ status: 200 })).toBe(true);
    expect(isReadyResponse({ status: 204 })).toBe(true);
  });

  it('rejects anything without a 2xx status', () => {
    expect(isReadyResponse(undefined)).toBe(false);
    expect(isReadyResponse({})).toBe(false);
    expect(isReadyResponse({ status: 503 })).toBe(false);
  });
});

describe('isBackendAwakeError', () => {
  it('keeps retrying the cold-database 503 the backend actually sends', () => {
    const coldStart = {
      response: {
        status: 503,
        data: { success: false, error: 'Database not connected' },
      },
    };

    expect(isBackendAwakeError(coldStart)).toBe(false);
  });

  it('keeps retrying other server errors', () => {
    expect(isBackendAwakeError({ response: { status: 500 } })).toBe(false);
  });

  it('keeps retrying a timeout', () => {
    expect(isBackendAwakeError({ code: 'ECONNABORTED' })).toBe(false);
  });

  it('keeps retrying a request that never reached the server', () => {
    expect(isBackendAwakeError({ message: 'Network Error' })).toBe(false);
  });

  it('does not treat our own cancellation as a live backend', () => {
    expect(isBackendAwakeError({ code: 'ERR_CANCELED' })).toBe(false);
  });

  it('treats a 404 as awake, since the request cleared the database gate', () => {
    expect(isBackendAwakeError({ response: { status: 404 } })).toBe(true);
  });

  it('treats a rate limit as awake rather than probing harder', () => {
    expect(isBackendAwakeError({ response: { status: 429 } })).toBe(true);
  });
});
