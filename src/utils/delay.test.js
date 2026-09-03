import { delay } from './delay';

describe('delay', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('resolves true once the wait elapses', async () => {
    const promise = delay(1000);

    jest.advanceTimersByTime(1000);

    await expect(promise).resolves.toBe(true);
  });

  it('resolves false immediately for an already-aborted signal, without scheduling a timer', async () => {
    const controller = new AbortController();
    controller.abort();

    const promise = delay(1000, controller.signal);

    expect(jest.getTimerCount()).toBe(0);
    await expect(promise).resolves.toBe(false);
  });

  it('resolves false and clears the timer when aborted mid-wait', async () => {
    const controller = new AbortController();
    const promise = delay(1000, controller.signal);

    jest.advanceTimersByTime(400);
    controller.abort();

    await expect(promise).resolves.toBe(false);
    expect(jest.getTimerCount()).toBe(0);
  });

  it('stays resolved as false after an abort even once the full wait would have passed', async () => {
    const controller = new AbortController();
    const promise = delay(1000, controller.signal);

    controller.abort();
    jest.advanceTimersByTime(5000);

    await expect(promise).resolves.toBe(false);
  });
});
