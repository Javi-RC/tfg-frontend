import { useEffect, useState } from 'react';

/**
 * Tracks which of the given section ids is currently in view, so the header can
 * highlight the matching nav link.
 *
 * @param {ReadonlyArray<string>} sectionIds ids rendered on the page, in order
 * @returns {string} id of the section closest to the top of the viewport
 */
export function useActiveSection(sectionIds) {
  const [activeSectionId, setActiveSectionId] = useState(sectionIds[0] ?? '');

  useEffect(() => {
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

    if (sections.length === 0 || typeof IntersectionObserver === 'undefined') {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) setActiveSectionId(visible.target.id);
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [sectionIds]);

  return activeSectionId;
}
