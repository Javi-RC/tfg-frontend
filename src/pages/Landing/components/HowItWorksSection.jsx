import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import SectionHeading from './SectionHeading';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { STEPS } from '../landingContent';

/**
 * Horizontal four-step walkthrough of the SARA workflow.
 */
export default function HowItWorksSection() {
  // Fade only, for the same reason as the feature cards: the steps sit in one
  // row and a staggered rise makes them look misaligned while it plays.
  const sectionRef = useScrollReveal({ stagger: 0.15, y: 0 });
  const { t } = useTranslation();

  return (
    <section
      className="landing-section landing-steps"
      id="how-it-works"
      ref={sectionRef}
      aria-labelledby="how-it-works-title"
    >
      <SectionHeading
        eyebrow={t('landing.steps.eyebrow')}
        titleKey="landing.steps.title"
        titleId="how-it-works-title"
      />

      <ol className="landing-steps__list">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          return (
            <Fragment key={step.id}>
              {index > 0 && <li className="landing-steps__arrow" aria-hidden="true" />}
              <li className={`landing-step landing-step--${step.accent}`} data-reveal>
                <span className="landing-step__icon" aria-hidden="true">
                  <Icon size={30} strokeWidth={1.75} />
                </span>
                <h3 className="landing-step__title">{t(`landing.steps.${step.id}.title`)}</h3>
                <p className="landing-step__text">{t(`landing.steps.${step.id}.description`)}</p>
              </li>
            </Fragment>
          );
        })}
      </ol>
    </section>
  );
}
