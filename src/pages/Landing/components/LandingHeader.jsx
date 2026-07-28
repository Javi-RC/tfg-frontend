import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X } from 'lucide-react';
import LanguageSwitcher from '../../../components/LanguageSwitcher';
import BrandMark from './BrandMark';
import { NAV_LINKS } from '../landingContent';

const SCROLLED_OFFSET_PX = 12;

/**
 * Sticky top navigation with anchor links, active-section highlight and a
 * mobile drawer.
 *
 * @param {{ activeSectionId: string }} props
 */
export default function LandingHeader({ activeSectionId }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > SCROLLED_OFFSET_PX);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`landing-header${isScrolled ? ' is-scrolled' : ''}`}>
      <div className="landing-header__inner">
        <a className="landing-header__brand" href="#hero" aria-label={t('landing.aria.home')}>
          <BrandMark />
        </a>

        <nav
          className={`landing-nav${isMenuOpen ? ' is-open' : ''}`}
          aria-label={t('landing.aria.mainNav')}
        >
          {NAV_LINKS.map(({ id, key }) => (
            <a
              key={id}
              className={`landing-nav__link${activeSectionId === id ? ' is-active' : ''}`}
              href={`#${id}`}
              aria-current={activeSectionId === id ? 'true' : undefined}
              onClick={() => setIsMenuOpen(false)}
            >
              {t(`landing.nav.${key}`)}
            </a>
          ))}
          <LanguageSwitcher />
          <Link className="landing-nav__login" to="/login">
            {t('landing.actions.login')}
          </Link>
          <Link className="landing-btn landing-btn--primary landing-nav__cta" to="/register">
            {t('landing.actions.try')}
          </Link>
        </nav>

        <button
          type="button"
          className="landing-header__toggle"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? t('landing.aria.closeMenu') : t('landing.aria.openMenu')}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}
