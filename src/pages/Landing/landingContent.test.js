import en from '../../i18n/locales/en.json';
import es from '../../i18n/locales/es.json';
import { FEATURES, NAV_LINKS, SOCIAL_LINKS, STEPS } from './landingContent';

/** Collects every leaf key path of an object, e.g. "hero.title". */
function leafPaths(value, prefix = '') {
  if (typeof value !== 'object' || value === null) return [prefix];
  return Object.entries(value).flatMap(([key, child]) =>
    leafPaths(child, prefix ? `${prefix}.${key}` : key)
  );
}

describe('landing translations', () => {
  it('defines the same keys in both locales', () => {
    expect(leafPaths(es.landing).sort()).toEqual(leafPaths(en.landing).sort());
  });

  it('has copy for every structural entry', () => {
    [en.landing, es.landing].forEach((landing) => {
      NAV_LINKS.forEach(({ key }) => expect(landing.nav[key]).toBeTruthy());
      FEATURES.forEach(({ id }) => {
        expect(landing.features[id].title).toBeTruthy();
        expect(landing.features[id].description).toBeTruthy();
      });
      STEPS.forEach(({ id }) => {
        expect(landing.steps[id].title).toBeTruthy();
        expect(landing.steps[id].description).toBeTruthy();
      });
      expect(landing.about.title).toBeTruthy();
      expect(landing.about.description).toBeTruthy();
      SOCIAL_LINKS.forEach(({ id }) => expect(landing.social[id]).toBeTruthy());
    });
  });

  it('keeps the <hl> markup balanced in every highlighted headline', () => {
    const headlines = [en.landing, es.landing].flatMap((landing) => [
      landing.hero.title,
      landing.features.title,
      landing.about.title,
    ]);

    headlines.forEach((headline) => {
      const open = headline.match(/<hl>/g) || [];
      const close = headline.match(/<\/hl>/g) || [];
      expect(open.length).toBe(close.length);
      expect(open.length).toBeGreaterThan(0);
    });
  });
});
