import { Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { UserPlus } from 'lucide-react';
// Background-stripped by scripts/remove-hero-background.mjs.
import aboutIllustration from '../../../assets/about-illustration.png';
import { useScrollReveal } from '../hooks/useScrollReveal';

/**
 * Closing pitch: value proposition on the left, illustration on the right.
 */
export default function AboutSection() {
  const sectionRef = useScrollReveal();
  const { t } = useTranslation();

  return (
    <section
      className="landing-section landing-about"
      id="about"
      ref={sectionRef}
      aria-labelledby="about-title"
    >
      <div className="landing-about__inner">
        <div className="landing-about__copy">
          <h2 className="landing-about__title" id="about-title" data-reveal>
            <Trans
              i18nKey="landing.about.title"
              components={{ hl: <span className="landing-text-gradient" /> }}
            />
          </h2>
          <p className="landing-about__text" data-reveal>
            {t('landing.about.description')}
          </p>
          <div data-reveal>
            <Link className="landing-btn landing-btn--primary" to="/register">
              <UserPlus size={18} aria-hidden="true" />
              {t('landing.actions.start')}
            </Link>
          </div>
        </div>

        {/* Decorative: the heading and paragraph carry the message. */}
        <img
          className="landing-about__illustration"
          src={aboutIllustration}
          alt=""
          width="1064"
          height="1008"
          loading="lazy"
          data-reveal
        />
      </div>
    </section>
  );
}
