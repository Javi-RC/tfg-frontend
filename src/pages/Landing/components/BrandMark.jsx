import icon from '../../../assets/icon.png';
import SaraWordmark from './SaraWordmark';
import { BRAND } from '../landingContent';

/**
 * SARA logo + tagline lockup.
 *
 * The header gets the animated wordmark; the footer gets plain text. Only one
 * animated copy may exist per page — it owns the clipPath ids the drawing
 * depends on, and ids have to stay unique.
 */
export default function BrandMark({ variant = 'header' }) {
  return (
    <div className={`landing-brand landing-brand--${variant}`}>
      <img className="landing-brand__logo" src={icon} alt="" width="44" height="44" />
      <div className="landing-brand__text">
        {/* Same class either way, so the animated mark and the static one are
            rendered in exactly the same type. */}
        {variant === 'header' ? (
          <SaraWordmark className="landing-brand__name" />
        ) : (
          <span className="landing-brand__name">{BRAND.name}</span>
        )}
        <span className="landing-brand__tagline">{BRAND.tagline}</span>
      </div>
    </div>
  );
}
