import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../reducedMotion';

let isScrollTriggerRegistered = false;

// Registered lazily: ScrollTrigger touches `window.matchMedia` on registration,
// which is not available in every environment that imports this module.
function registerScrollTriggerOnce() {
  if (isScrollTriggerRegistered) return;
  gsap.registerPlugin(ScrollTrigger);
  isScrollTriggerRegistered = true;
}

/**
 * Fades and lifts every `[data-reveal]` descendant of the returned ref as it
 * scrolls into view. Elements are left untouched when the user has asked for
 * reduced motion, so nothing ever stays invisible.
 *
 * @param {{ stagger?: number, y?: number, duration?: number }} [options]
 * @returns {import('react').RefObject<HTMLElement>} ref to attach to the container
 */
export function useScrollReveal({ stagger = 0.12, y = 28, duration = 0.7 } = {}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || prefersReducedMotion()) return undefined;

    const targets = container.querySelectorAll('[data-reveal]');
    if (targets.length === 0) return undefined;

    registerScrollTriggerOnce();

    const context = gsap.context(() => {
      gsap.from(targets, {
        opacity: 0,
        y,
        duration,
        stagger,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 82%',
          once: true,
        },
      });
    }, container);

    return () => context.revert();
  }, [stagger, y, duration]);

  return containerRef;
}
