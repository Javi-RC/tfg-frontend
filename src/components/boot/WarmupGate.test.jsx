import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { pingHealth } from '../../api/health';
import { USER_STORAGE_KEY } from '../../api/tokenStore';
import WarmupGate from './WarmupGate';

jest.mock('../../api/health');

const CONNECTING = 'Connecting to Sara…';

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

/** Lets queued microtasks and the timers between them run to completion. */
async function flush(ms = 0) {
  await act(async () => {
    if (ms > 0) jest.advanceTimersByTime(ms);
    await Promise.resolve();
    await Promise.resolve();
  });
}

const renderGate = (options = {}) =>
  render(
    <WarmupGate>
      <div>application</div>
    </WarmupGate>,
    options
  );

describe('WarmupGate', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    pingHealth.mockReset();
    localStorage.clear();
    window.history.pushState({}, '', '/projects');
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('never shows the splash when the backend is already warm', async () => {
    pingHealth.mockResolvedValue({ status: 200 });

    renderGate();
    await flush();

    expect(screen.getByText('application')).toBeInTheDocument();

    await flush(1000);

    expect(screen.queryByText(CONNECTING)).not.toBeInTheDocument();
    expect(screen.getByText('application')).toBeInTheDocument();
  });

  it('renders nothing during the reveal window, rather than flashing a spinner', async () => {
    pingHealth.mockReturnValue(deferred().promise);

    const { container } = renderGate();
    await flush(300);

    expect(container).toBeEmptyDOMElement();
  });

  it('shows the splash once the probe outlasts the reveal window', async () => {
    pingHealth.mockReturnValue(deferred().promise);

    renderGate();
    await flush(400);

    expect(screen.getByText(CONNECTING)).toBeInTheDocument();
    expect(screen.queryByText('application')).not.toBeInTheDocument();
  });

  it('hands over to the application when a slow probe finally answers', async () => {
    const probe = deferred();
    pingHealth.mockReturnValue(probe.promise);

    renderGate();
    await flush(400);
    expect(screen.getByText(CONNECTING)).toBeInTheDocument();

    await act(async () => {
      probe.resolve({ status: 200 });
      await Promise.resolve();
    });

    expect(screen.getByText('application')).toBeInTheDocument();
    expect(screen.queryByText(CONNECTING)).not.toBeInTheDocument();
  });

  it('offers a retry once the warm-up gives up', async () => {
    pingHealth.mockRejectedValue(coldStart());

    renderGate();
    for (let i = 0; i < 25; i += 1) {
      await flush(5000);
    }

    expect(screen.getByText('Could not reach Sara')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('keeps the splash on screen through a retry instead of blanking it again', async () => {
    pingHealth.mockRejectedValue(coldStart());

    renderGate();
    for (let i = 0; i < 25; i += 1) {
      await flush(5000);
    }

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const probe = deferred();
    pingHealth.mockReturnValue(probe.promise);

    await user.click(screen.getByRole('button', { name: /try again/i }));

    // Straight back to the waiting copy — no blank frame in between.
    expect(screen.getByText(CONNECTING)).toBeInTheDocument();
  });

  describe('routes that do not need the backend', () => {
    it('paints /landing at once and still warms the backend in the background', async () => {
      window.history.pushState({}, '', '/landing');
      pingHealth.mockReturnValue(deferred().promise);

      renderGate();

      expect(screen.getByText('application')).toBeInTheDocument();

      await flush();
      expect(pingHealth).toHaveBeenCalled();
    });

    it('paints /terms at once', async () => {
      window.history.pushState({}, '', '/terms');
      pingHealth.mockReturnValue(deferred().promise);

      renderGate();

      expect(screen.getByText('application')).toBeInTheDocument();
      await flush(1000);
      expect(screen.queryByText(CONNECTING)).not.toBeInTheDocument();
    });

    it('paints the root path at once for a visitor with no cached session', async () => {
      window.history.pushState({}, '', '/');
      pingHealth.mockReturnValue(deferred().promise);

      renderGate();

      expect(screen.getByText('application')).toBeInTheDocument();
      await flush(1000);
      expect(screen.queryByText(CONNECTING)).not.toBeInTheDocument();
    });

    it('waits at the root path when a session was cached, since that renders the profile', async () => {
      window.history.pushState({}, '', '/');
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify({ name: 'Ada' }));
      pingHealth.mockReturnValue(deferred().promise);

      renderGate();
      await flush(400);

      expect(screen.getByText(CONNECTING)).toBeInTheDocument();
      expect(screen.queryByText('application')).not.toBeInTheDocument();
    });
  });

  describe('the OAuth return hop', () => {
    // The provider redirects back through the backend, so it has just proved
    // itself warm — the probe answers inside the reveal window and no splash is
    // ever seen. Gating anyway is what protects the other way in: a stale
    // bookmark on a cold backend, where OAuthSuccess would otherwise time out
    // on getProfile() and bounce the user to /login.
    it('waits on the callback route, then hands over without a splash', async () => {
      window.history.pushState({}, '', '/oauth-success');
      const probe = deferred();
      pingHealth.mockReturnValue(probe.promise);

      renderGate();
      await flush(200);

      expect(screen.queryByText('application')).not.toBeInTheDocument();

      await act(async () => {
        probe.resolve({ status: 200 });
        await Promise.resolve();
      });

      expect(screen.getByText('application')).toBeInTheDocument();
      expect(screen.queryByText(CONNECTING)).not.toBeInTheDocument();
    });

    it('leaves the token fragment untouched while it waits', async () => {
      window.history.pushState({}, '', '/oauth-success#token=jwt-from-provider');
      const probe = deferred();
      pingHealth.mockReturnValue(probe.promise);

      renderGate();
      await flush(400);

      // The fragment carries the only copy of the JWT. Nothing in the boot path
      // may consume or rewrite it before OAuthSuccess gets to read it.
      expect(window.location.hash).toBe('#token=jwt-from-provider');

      await act(async () => {
        probe.resolve({ status: 200 });
        await Promise.resolve();
      });

      expect(window.location.hash).toBe('#token=jwt-from-provider');
      expect(screen.getByText('application')).toBeInTheDocument();
    });

    it('reads the route correctly despite the fragment', async () => {
      window.history.pushState({}, '', '/oauth-success#token=jwt-from-provider');
      pingHealth.mockReturnValue(deferred().promise);

      renderGate();
      await flush(400);

      // A hash is not part of pathname, so requiresWarmBackend still classifies
      // this as an application route rather than falling through to a default.
      expect(screen.getByText(CONNECTING)).toBeInTheDocument();
    });
  });

  it('lets the application through under StrictMode', async () => {
    pingHealth.mockResolvedValue({ status: 200 });

    renderGate({ wrapper: ({ children }) => <React.StrictMode>{children}</React.StrictMode> });
    await flush();

    expect(screen.getByText('application')).toBeInTheDocument();
  });
});
