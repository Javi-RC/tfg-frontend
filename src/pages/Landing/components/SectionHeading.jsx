import { Trans } from 'react-i18next';

/**
 * Eyebrow pill + title used at the top of every landing section.
 *
 * The title goes through <Trans> so translators can place the highlighted
 * words wherever the sentence needs them, instead of us splicing fragments.
 */
export default function SectionHeading({ eyebrow, titleKey, titleId }) {
  return (
    <header className="landing-section__heading">
      <p className="landing-eyebrow" data-reveal>
        {eyebrow}
      </p>
      <h2 className="landing-section__title" id={titleId} data-reveal>
        <Trans i18nKey={titleKey} components={{ hl: <span className="landing-text-gradient" /> }} />
      </h2>
    </header>
  );
}
