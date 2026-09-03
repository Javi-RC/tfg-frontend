import { useEffect, useState } from 'react';
import { hasStoredUser } from '../../api/tokenStore';
import { requiresWarmBackend } from '../../constants/routes';
import { SPLASH_REVEAL_DELAY_MS, WARMUP_STATUS } from '../../constants/warmup';
import { useBackendWarmup } from '../../hooks/useBackendWarmup';
import WarmupSplash from './WarmupSplash';

/**
 * Holds the application back until the backend has answered.
 *
 * The probe runs on every route, including the ones that render fine without
 * an API — a visitor reading the landing page warms the lambda for free, so
 * the backend is up by the time they press Login. Only the *rendering* is
 * gated, and only where waiting buys something.
 *
 * @param {{ children: React.ReactNode }} props
 */
export default function WarmupGate({ children }) {
  // Decided once, at boot. Like AuthProvider, this sits above BrowserRouter and
  // so reads the location directly rather than through a router hook.
  const [blocking] = useState(() =>
    requiresWarmBackend(window.location.pathname, { hasCachedUser: hasStoredUser() })
  );

  const { status, startedAt, retry } = useBackendWarmup();
  const [revealed, setRevealed] = useState(false);

  // The splash is never rendered-then-hidden; it simply never mounts on a warm
  // backend. Two clocks race — this timer and the probe — and when the probe
  // wins the cleanup clears the timer before it can fire.
  //
  // Runs once, and the reveal is never taken back: the delay exists to stop the
  // *first* paint flickering. Re-arming it on retry would blank a screen the
  // user is already looking at, which is the flicker it was meant to prevent.
  useEffect(() => {
    if (!blocking) return undefined;

    const id = setTimeout(() => setRevealed(true), SPLASH_REVEAL_DELAY_MS);
    return () => clearTimeout(id);
  }, [blocking]);

  if (!blocking) return children;
  if (status === WARMUP_STATUS.READY) return children;

  if (status !== WARMUP_STATUS.FAILED && !revealed) return null;

  return <WarmupSplash status={status} startedAt={startedAt} onRetry={retry} />;
}
