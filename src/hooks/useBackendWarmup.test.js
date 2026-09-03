import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { pingHealth } from '../api/health';
import { WARMUP_STATUS } from '../constants/warmup';
import { useBackendWarmup } from './useBackendWarmup';

jest.mock('../api/health');

/** A promise whose settlement the test controls, so PROBING can be observed. */
function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

const coldStart = () => {
  const error = new Error('Service Unavailable');
  error.response = { status: 503, data: { success: false, error: 'Database not connected' } };
  return error;
};

const withStatus = (status) => {
  const error = new Error(`HTTP ${status}`);
  error.response = { status };
  return error;
};

/** Lets queued microtasks and the timers between them run to completion. */
async function flush(ms = 0) {
  await act(async () => {
    if (ms > 0) jest.advanceTimersByTime(ms);
    await Promise.resolve();
    await Promise.resolve();
  });
}

describe('useBackendWarmup', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    pingHealth.mockReset();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('probes immediately and reports READY on a 200', async () => {
    pingHealth.mockResolvedValue({ status: 200 });

    const { result } = renderHook(() => useBackendWarmup());

    await waitFor(() => expect(result.current.status).toBe(WARMUP_STATUS.READY));
    expect(pingHealth).toHaveBeenCalledTimes(1);
  });

  it('stops probing once ready', async () => {
    pingHealth.mockResolvedValue({ status: 200 });

    const { result } = renderHook(() => useBackendWarmup());
    await waitFor(() => expect(result.current.status).toBe(WARMUP_STATUS.READY));

    await flush(60000);

    expect(pingHealth).toHaveBeenCalledTimes(1);
  });

  it('stays PROBING while the first request is in flight', async () => {
    const first = deferred();
    pingHealth.mockReturnValue(first.promise);

    const { result } = renderHook(() => useBackendWarmup());

    await waitFor(() => expect(result.current.status).toBe(WARMUP_STATUS.PROBING));
  });

  it('retries the cold-database 503 and succeeds on the second attempt', async () => {
    pingHealth.mockRejectedValueOnce(coldStart()).mockResolvedValueOnce({ status: 200 });

    const { result } = renderHook(() => useBackendWarmup());

    await flush();
    expect(result.current.status).toBe(WARMUP_STATUS.PROBING);

    await flush(500);

    await waitFor(() => expect(result.current.status).toBe(WARMUP_STATUS.READY));
    expect(pingHealth).toHaveBeenCalledTimes(2);
    expect(result.current.attempt).toBe(1);
  });

  it('retries a request that never reached the server', async () => {
    pingHealth
      .mockRejectedValueOnce(new Error('Network Error'))
      .mockResolvedValueOnce({ status: 200 });

    const { result } = renderHook(() => useBackendWarmup());

    await flush();
    await flush(500);

    await waitFor(() => expect(result.current.status).toBe(WARMUP_STATUS.READY));
    expect(pingHealth).toHaveBeenCalledTimes(2);
  });

  it('retries a timeout', async () => {
    const timeout = new Error('timeout of 12000ms exceeded');
    timeout.code = 'ECONNABORTED';
    pingHealth.mockRejectedValueOnce(timeout).mockResolvedValueOnce({ status: 200 });

    const { result } = renderHook(() => useBackendWarmup());

    await flush();
    await flush(500);

    await waitFor(() => expect(result.current.status).toBe(WARMUP_STATUS.READY));
    expect(pingHealth).toHaveBeenCalledTimes(2);
  });

  it('treats a 404 as a woken backend and lets the app through', async () => {
    pingHealth.mockRejectedValue(withStatus(404));

    const { result } = renderHook(() => useBackendWarmup());

    await waitFor(() => expect(result.current.status).toBe(WARMUP_STATUS.READY));
    expect(pingHealth).toHaveBeenCalledTimes(1);
  });

  it('treats a rate limit as a woken backend rather than probing harder', async () => {
    pingHealth.mockRejectedValue(withStatus(429));

    const { result } = renderHook(() => useBackendWarmup());

    await waitFor(() => expect(result.current.status).toBe(WARMUP_STATUS.READY));
    expect(pingHealth).toHaveBeenCalledTimes(1);
  });

  it('gives up once the deadline is spent, and stops probing after that', async () => {
    pingHealth.mockRejectedValue(coldStart());

    const { result } = renderHook(() => useBackendWarmup());

    for (let i = 0; i < 25; i += 1) {
      await flush(5000);
    }

    expect(result.current.status).toBe(WARMUP_STATUS.FAILED);

    const callsAtFailure = pingHealth.mock.calls.length;
    await flush(30000);
    expect(pingHealth).toHaveBeenCalledTimes(callsAtFailure);
  });

  it('clamps the attempt timeout to what is left of the deadline', async () => {
    pingHealth.mockRejectedValue(coldStart());

    renderHook(() => useBackendWarmup());

    for (let i = 0; i < 8; i += 1) {
      await flush(5000);
    }

    const lastCall = pingHealth.mock.calls[pingHealth.mock.calls.length - 1][0];
    expect(lastCall.timeout).toBeLessThan(12000);
    expect(lastCall.timeout).toBeGreaterThan(0);
  });

  it('restarts the run from a clean clock on retry', async () => {
    pingHealth.mockRejectedValue(coldStart());

    const { result } = renderHook(() => useBackendWarmup());

    for (let i = 0; i < 25; i += 1) {
      await flush(5000);
    }
    expect(result.current.status).toBe(WARMUP_STATUS.FAILED);

    const callsAtFailure = pingHealth.mock.calls.length;
    const failedAt = result.current.startedAt;
    pingHealth.mockResolvedValue({ status: 200 });

    await act(async () => {
      result.current.retry();
    });
    await flush();

    expect(result.current.startedAt).toBeGreaterThan(failedAt);
    expect(result.current.attempt).toBe(0);
    expect(pingHealth.mock.calls.length).toBeGreaterThan(callsAtFailure);
    await waitFor(() => expect(result.current.status).toBe(WARMUP_STATUS.READY));
  });

  it('aborts the in-flight probe on unmount without touching state afterwards', async () => {
    const first = deferred();
    pingHealth.mockReturnValue(first.promise);

    const { unmount } = renderHook(() => useBackendWarmup());
    await flush();

    const { signal } = pingHealth.mock.calls[0][0];
    expect(signal.aborted).toBe(false);

    unmount();

    expect(signal.aborted).toBe(true);

    await act(async () => {
      first.resolve({ status: 200 });
      await Promise.resolve();
    });
  });

  it('never probes when disabled', async () => {
    pingHealth.mockResolvedValue({ status: 200 });

    const { result } = renderHook(() => useBackendWarmup({ enabled: false }));
    await flush(60000);

    expect(pingHealth).not.toHaveBeenCalled();
    expect(result.current.status).toBe(WARMUP_STATUS.IDLE);
  });

  it('still reaches READY under StrictMode, whose cleanup aborts the first probe', async () => {
    pingHealth.mockResolvedValue({ status: 200 });

    const { result } = renderHook(() => useBackendWarmup(), {
      wrapper: ({ children }) => <React.StrictMode>{children}</React.StrictMode>,
    });

    await waitFor(() => expect(result.current.status).toBe(WARMUP_STATUS.READY));
  });
});
