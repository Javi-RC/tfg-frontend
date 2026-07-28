import React from 'react';
import { render, screen } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import RiskSeverityBadge from './RiskSeverityBadge';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
}));

describe('RiskSeverityBadge', () => {
  let mockT;

  beforeEach(() => {
    mockT = jest.fn((key) => key);
    useTranslation.mockReturnValue({ t: mockT });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders badge with translated severity label', () => {
    mockT.mockReturnValue('High');

    render(<RiskSeverityBadge severity="high" />);

    expect(mockT).toHaveBeenCalledWith('riskSeverity.high');
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('applies high severity styles', () => {
    mockT.mockReturnValue('High');

    const { container } = render(<RiskSeverityBadge severity="high" />);
    const badge = container.firstChild;

    expect(badge).toHaveStyle({
      background: 'var(--color-danger-bg)',
      color: 'var(--color-danger)',
    });
  });

  it('applies medium-high severity styles', () => {
    mockT.mockReturnValue('Medium-High');

    const { container } = render(<RiskSeverityBadge severity="medium-high" />);
    const badge = container.firstChild;

    expect(badge).toHaveStyle({
      background: '#FED7AA',
      color: '#EA580C',
    });
  });

  it('applies medium severity styles', () => {
    mockT.mockReturnValue('Medium');

    const { container } = render(<RiskSeverityBadge severity="medium" />);
    const badge = container.firstChild;

    expect(badge).toHaveStyle({
      background: 'var(--color-warning-bg)',
      color: '#D97706',
    });
  });

  it('applies low severity styles', () => {
    mockT.mockReturnValue('Low');

    const { container } = render(<RiskSeverityBadge severity="low" />);
    const badge = container.firstChild;

    expect(badge).toHaveStyle({
      background: 'var(--color-success-bg)',
      color: '#059669',
    });
  });

  it('applies default styles for unknown severity', () => {
    mockT.mockReturnValue('Unknown');

    const { container } = render(<RiskSeverityBadge severity="unknown" />);
    const badge = container.firstChild;

    expect(badge).toHaveStyle({
      background: 'var(--color-bg-subtle)',
      color: 'var(--color-text-muted)',
    });
  });

  it('displays uppercase text', () => {
    mockT.mockReturnValue('HIGH');

    const { container } = render(<RiskSeverityBadge severity="high" />);
    const badge = container.firstChild;

    expect(badge).toHaveStyle({
      textTransform: 'uppercase',
    });
  });

  it('applies common badge styles', () => {
    mockT.mockReturnValue('High');

    const { container } = render(<RiskSeverityBadge severity="high" />);
    const badge = container.firstChild;

    expect(badge).toHaveStyle({
      padding: '4px 12px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '700',
      letterSpacing: '0.5px',
    });
  });

  it('displays severity as fallback when translation missing', () => {
    mockT.mockReturnValue(null);

    render(<RiskSeverityBadge severity="high" />);

    expect(screen.getByText('high')).toBeInTheDocument();
  });

  it('renders as span element', () => {
    mockT.mockReturnValue('High');

    const { container } = render(<RiskSeverityBadge severity="high" />);

    expect(container.firstChild.tagName).toBe('SPAN');
  });

  it('handles null severity with default style', () => {
    mockT.mockReturnValue(null);

    const { container } = render(<RiskSeverityBadge severity={null} />);
    const badge = container.firstChild;

    expect(badge).toHaveStyle({
      background: 'var(--color-bg-subtle)',
      color: 'var(--color-text-muted)',
    });
  });

  it('handles undefined severity with default style', () => {
    mockT.mockReturnValue(undefined);

    const { container } = render(<RiskSeverityBadge severity={undefined} />);
    const badge = container.firstChild;

    expect(badge).toHaveStyle({
      background: 'var(--color-bg-subtle)',
      color: 'var(--color-text-muted)',
    });
  });

  it('handles empty string severity', () => {
    mockT.mockReturnValue('');

    const { container } = render(<RiskSeverityBadge severity="" />);
    const badge = container.firstChild;

    expect(badge).toHaveStyle({
      background: 'var(--color-bg-subtle)',
      color: 'var(--color-text-muted)',
    });
  });

  it('distinguishes between severity levels visually', () => {
    mockT.mockImplementation((key) => key);

    const { rerender, container } = render(<RiskSeverityBadge severity="high" />);
    const highBadge = container.firstChild;
    const highBg = highBadge.style.background;

    rerender(<RiskSeverityBadge severity="low" />);
    const lowBadge = container.firstChild;
    const lowBg = lowBadge.style.background;

    expect(highBg).not.toBe(lowBg);
  });

  it('updates when severity prop changes', () => {
    mockT.mockImplementation((key) => {
      if (key === 'riskSeverity.high') return 'High';
      if (key === 'riskSeverity.low') return 'Low';
      return key;
    });

    const { rerender } = render(<RiskSeverityBadge severity="high" />);
    expect(screen.getByText('High')).toBeInTheDocument();

    rerender(<RiskSeverityBadge severity="low" />);
    expect(screen.getByText('Low')).toBeInTheDocument();
    expect(screen.queryByText('High')).not.toBeInTheDocument();
  });

  it('renders all severity levels with unique styles', () => {
    const severities = ['high', 'medium-high', 'medium', 'low'];
    const backgrounds = [];

    severities.forEach((severity) => {
      const { container, unmount } = render(<RiskSeverityBadge severity={severity} />);
      const badge = container.firstChild;
      backgrounds.push(badge.style.background);
      unmount();
    });

    // All backgrounds should be unique
    const uniqueBackgrounds = new Set(backgrounds);
    expect(uniqueBackgrounds.size).toBe(severities.length);
  });
});
