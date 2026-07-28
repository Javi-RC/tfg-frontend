import { render, screen } from '@testing-library/react';
import SaraWordmark from './SaraWordmark';
import { BRAND } from '../landingContent';

describe('SaraWordmark', () => {
  it('renders the brand name as one run of text', () => {
    render(<SaraWordmark />);

    expect(screen.getByText(BRAND.name)).toHaveClass('sara-wordmark__word');
  });

  it('matches the casing of the wordmark used elsewhere in the app', () => {
    expect(BRAND.name).toBe('Sara');
  });

  it('keeps the decorative dot out of the accessibility tree', () => {
    const { container } = render(<SaraWordmark />);

    expect(container.querySelector('.sara-wordmark__dot')).toHaveAttribute('aria-hidden', 'true');
  });

  it('takes the type of the class it is given', () => {
    const { container } = render(<SaraWordmark className="landing-brand__name" />);

    expect(container.querySelector('.sara-wordmark')).toHaveClass('landing-brand__name');
  });
});
