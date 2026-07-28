import { useTranslation } from 'react-i18next';
import BrandMark from './BrandMark';
import { NAV_LINKS, SOCIAL_LINKS } from '../landingContent';

/**
 * Footer with the brand lockup, the same anchors as the header and social links.
 */
export default function LandingFooter() {
  const { t } = useTranslation();

  return (
    <footer className="landing-footer" id="contact">
      <div className="landing-footer__inner">
        <BrandMark variant="footer" />

        <nav className="landing-footer__nav" aria-label={t('landing.aria.footerNav')}>
          {NAV_LINKS.map(({ id, key }) => (
            <a className="landing-footer__link" href={`#${id}`} key={id}>
              {t(`landing.nav.${key}`)}
            </a>
          ))}
        </nav>

        <ul className="landing-footer__social">
          {SOCIAL_LINKS.map((social) => {
            const Icon = social.icon;
            return (
              <li key={social.id}>
                <a
                  className="landing-footer__social-link"
                  href={social.href}
                  aria-label={t(`landing.social.${social.id}`)}
                >
                  <Icon size={18} aria-hidden="true" />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </footer>
  );
}
