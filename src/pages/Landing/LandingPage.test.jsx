import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import i18n from '../../i18n';
import LandingPage from './LandingPage';
import { FEATURES, NAV_LINKS, STEPS } from './landingContent';

// Switching language re-renders every subscribed component, so it has to run
// inside act() for React to flush the update before we assert.
async function switchLanguage(language) {
  await act(async () => {
    await i18n.changeLanguage(language);
  });
}

function renderLandingPage() {
  return render(
    <MemoryRouter>
      <LandingPage />
    </MemoryRouter>
  );
}

describe('LandingPage', () => {
  afterEach(async () => {
    await switchLanguage('en');
  });

  it('renders the hero headline, highlights included', () => {
    renderLandingPage();

    // <Trans> splits the sentence across nodes, so assert on the whole heading.
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'The smart tool for building high-performing teams'
    );
  });

  it('renders an anchor target for every nav link', () => {
    renderLandingPage();

    NAV_LINKS.forEach(({ id }) => {
      expect(document.getElementById(id)).toBeInTheDocument();
    });
  });

  it('renders every feature and workflow step from the locale file', () => {
    renderLandingPage();

    [...FEATURES, ...STEPS].forEach(({ id }) => {
      const namespace = FEATURES.some((feature) => feature.id === id) ? 'features' : 'steps';
      const title = i18n.t(`landing.${namespace}.${id}.title`);

      expect(title).not.toMatch(/^landing\./); // key resolved to real copy
      expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
    });
  });

  it('translates the whole page when the language changes', async () => {
    renderLandingPage();

    expect(screen.getByRole('link', { name: 'Try SARA' })).toBeInTheDocument();

    await switchLanguage('es');

    expect(screen.getByRole('link', { name: 'Probar SARA' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'La herramienta inteligente para formar equipos de alto rendimiento'
    );
  });

  it('sends both primary calls to action to the register page', () => {
    renderLandingPage();

    const ctas = screen.getAllByRole('link', { name: /Get started|Try SARA/ });
    expect(ctas.length).toBeGreaterThan(0);
    ctas.forEach((cta) => expect(cta).toHaveAttribute('href', '/register'));
  });
});
