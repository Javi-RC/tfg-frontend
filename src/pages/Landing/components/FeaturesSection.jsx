import { useTranslation } from 'react-i18next';
import SectionHeading from './SectionHeading';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { FEATURES } from '../landingContent';

/**
 * Four-card grid describing what SARA offers.
 */
export default function FeaturesSection() {
  // Fade only. A staggered rise would leave cards in the same row at visibly
  // different heights for the length of the animation.
  const sectionRef = useScrollReveal({ y: 0 });
  const { t } = useTranslation();

  return (
    <section
      className="landing-section landing-features"
      id="features"
      ref={sectionRef}
      aria-labelledby="features-title"
    >
      <SectionHeading
        eyebrow={t('landing.features.eyebrow')}
        titleKey="landing.features.title"
        titleId="features-title"
      />

      <ul className="landing-features__grid">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <li
              className={`landing-card landing-card--${feature.accent}`}
              key={feature.id}
              data-reveal
            >
              <span className="landing-card__icon" aria-hidden="true">
                <Icon size={28} strokeWidth={1.75} />
              </span>
              <h3 className="landing-card__title">{t(`landing.features.${feature.id}.title`)}</h3>
              <p className="landing-card__text">
                {t(`landing.features.${feature.id}.description`)}
              </p>
              <span className="landing-card__underline" aria-hidden="true" />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
