const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * True when the user asked the OS to reduce motion. Every landing animation is
 * decorative, so callers skip them entirely instead of shortening them.
 */
export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia(REDUCED_MOTION_QUERY).matches
  );
}
