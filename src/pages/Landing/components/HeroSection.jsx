import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { PlayCircle, Sparkles, UserPlus } from 'lucide-react';
// Background-stripped by scripts/remove-hero-background.mjs, so the artwork
// sits on the hero gradient instead of on a white box of its own.
import heroIllustration from '../../../assets/hero-illustration.png';
import { prefersReducedMotion } from '../reducedMotion';

/**
 * Above-the-fold hero: headline, calls to action and the illustration.
 */
export default function HeroSection() {
  const sectionRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return undefined;

    const context = gsap.context(() => {
      // The idle drift only starts once the intro finished, so the two tweens
      // never animate `y` on the illustration at the same time.
      const startFloating = () =>
        gsap.to('[data-hero-art]', {
          y: -14,
          duration: 3.2,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });

      gsap
        .timeline({ defaults: { ease: 'power3.out' }, onComplete: startFloating })
        .from('[data-hero-copy] > *', { opacity: 0, y: 32, duration: 0.7, stagger: 0.1 })
        .from('[data-hero-art]', { opacity: 0, scale: 0.94, duration: 0.9 }, '-=0.5');
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section className="landing-hero" id="hero" ref={sectionRef} aria-labelledby="hero-title">
      <div className="landing-hero__inner">
        <div className="landing-hero__copy" data-hero-copy>
          <p className="landing-hero__badge">
            <Sparkles size={16} aria-hidden="true" />
            {t('landing.hero.badge')}
          </p>

          <h1 className="landing-hero__title" id="hero-title">
            <Trans
              i18nKey="landing.hero.title"
              components={{ hl: <span className="landing-text-gradient" /> }}
            />
          </h1>

          <p className="landing-hero__subtitle">{t('landing.hero.subtitle')}</p>

          <div className="landing-hero__actions">
            <Link className="landing-btn landing-btn--primary" to="/register">
              <UserPlus size={18} aria-hidden="true" />
              {t('landing.actions.start')}
            </Link>
            <a className="landing-btn landing-btn--ghost" href="#how-it-works">
              <PlayCircle size={18} aria-hidden="true" />
              {t('landing.actions.seeHow')}
            </a>
          </div>
        </div>

        {/* Decorative: the headline already carries the message, so the image is
            given an empty alt rather than a description to read out. */}
        <div className="landing-hero__art">
          <img
            className="landing-hero__illustration"
            src={heroIllustration}
            alt=""
            width="1152"
            height="923"
            fetchPriority="high"
            data-hero-art
          />
        </div>
      </div>
    </section>
  );
}
