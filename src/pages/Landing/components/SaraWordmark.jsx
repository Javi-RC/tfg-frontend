import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { CustomBounce } from 'gsap/CustomBounce';
import { prefersReducedMotion } from '../reducedMotion';
import { BRAND } from '../landingContent';

const BOUNCE_EASE = 'saraBounce';

let arePluginsRegistered = false;

function registerPluginsOnce() {
  if (arePluginsRegistered) return;
  gsap.registerPlugin(CustomEase, CustomBounce);
  CustomBounce.create(BOUNCE_EASE, { strength: 0.6, squash: 2 });
  arePluginsRegistered = true;
}

/**
 * The Sara wordmark, written on left to right and closed by a full stop that
 * drops in and bounces to a halt.
 *
 * The name stays a single run of real text in the brand face (Pacifico, via the
 * class the caller passes). It is revealed by one continuous wipe rather than
 * letter by letter, because the face is a connected script: staggering the
 * letters would tear the strokes apart where they join.
 */
export default function SaraWordmark({ className = '' }) {
  const rootRef = useRef(null);

  // Layout effect, not a plain effect: the mark is visible by default so it
  // survives an environment without GSAP, and this hides it again before the
  // browser paints — otherwise the finished wordmark flashes first.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return undefined;

    registerPluginsOnce();

    const context = gsap.context(() => {
      gsap
        .timeline()
        .fromTo(
          '.sara-wordmark__word',
          { clipPath: 'inset(0 100% -20% 0)' },
          { clipPath: 'inset(0 0% -20% 0)', duration: 0.9, ease: 'power1.inOut' }
        )
        .fromTo(
          '.sara-wordmark__dot',
          { autoAlpha: 0, yPercent: -420 },
          { autoAlpha: 1, yPercent: 0, duration: 0.85, ease: BOUNCE_EASE },
          '-=0.15'
        )
        .to(
          '.sara-wordmark__dot',
          {
            scaleY: 0.6,
            scaleX: 1.3,
            duration: 0.85,
            ease: `${BOUNCE_EASE}-squash`,
            transformOrigin: 'bottom center',
          },
          '<'
        );
    }, root);

    return () => context.revert();
  }, []);

  return (
    <span className={`sara-wordmark ${className}`.trim()} ref={rootRef}>
      <span className="sara-wordmark__word">{BRAND.name}</span>
      <span className="sara-wordmark__dot" aria-hidden="true" />
    </span>
  );
}
