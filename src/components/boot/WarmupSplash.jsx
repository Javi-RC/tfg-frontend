import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { STAGE_TICK_MS, WARMUP_STATUS } from '../../constants/warmup';
import { getStage } from '../../utils/warmup';
import './WarmupSplash.css';

/**
 * The boot screen shown while the backend wakes up, and the retry screen once
 * the warm-up gives up.
 *
 * Progress is indeterminate on purpose. There is no honest estimate for how
 * long a cold start takes, and a progress bar that invents one is a lie — the
 * staged copy is what actually tells the user where they are.
 *
 * @param {{ status: string, startedAt: number, onRetry: () => void }} props
 */
export default function WarmupSplash({ status, startedAt, onRetry }) {
  const { t } = useTranslation();
  const failed = status === WARMUP_STATUS.FAILED;
  const retryRef = useRef(null);
  const [elapsedMs, setElapsedMs] = useState(() => Date.now() - startedAt);

  useEffect(() => {
    if (failed) return undefined;

    const id = setInterval(() => setElapsedMs(Date.now() - startedAt), STAGE_TICK_MS);
    return () => clearInterval(id);
  }, [failed, startedAt]);

  useEffect(() => {
    setElapsedMs(Date.now() - startedAt);
  }, [startedAt]);

  // The splash is a full-viewport takeover with exactly one action, so moving
  // focus there is the whole point rather than a steal.
  useEffect(() => {
    if (failed) retryRef.current?.focus();
  }, [failed]);

  const stage = getStage(elapsedMs);

  return (
    <div className="warmup-splash">
      <div className="warmup-splash__panel">
        {/* Outside the live region below, so a screen reader does not re-announce
            the brand every time the stage copy changes. */}
        <p className="warmup-splash__brand">Sara</p>

        {!failed && <div className="warmup-splash__spinner" aria-hidden="true" />}

        <div role="status" aria-live="polite" aria-busy={!failed}>
          <p className="warmup-splash__title">
            {failed ? t('warmup.failedTitle') : t(`warmup.stage.${stage}`)}
          </p>
          <p className="warmup-splash__hint">{failed ? t('warmup.failedHint') : t('warmup.hint')}</p>
        </div>

        {failed && (
          <button
            ref={retryRef}
            type="button"
            className="warmup-splash__retry"
            onClick={onRetry}
          >
            {t('warmup.retry')}
          </button>
        )}
      </div>
    </div>
  );
}
