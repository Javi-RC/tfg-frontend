import React from 'react';
import { render, screen } from '@testing-library/react';
import SynergyBadge from './SynergyBadge';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, params) => {
      const translations = {
        'team.synergy.badge.notAvailable': 'N/A',
        'team.synergy.badge.label': `Synergy: ${params?.score ?? ''}`,
      };
      return translations[key] || key;
    },
  }),
}));

describe('SynergyBadge', () => {
  it('renders with score and label', () => {
    render(<SynergyBadge score={85} />);
    
    expect(screen.getByText('Synergy: 85')).toBeInTheDocument();
  });

  it('renders with score without label', () => {
    render(<SynergyBadge score={75} showLabel={false} />);
    
    expect(screen.getByText('75')).toBeInTheDocument();
    expect(screen.queryByText('Synergy:')).not.toBeInTheDocument();
  });

  it('renders N/A for null score', () => {
    render(<SynergyBadge score={null} />);
    
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('renders N/A for undefined score', () => {
    render(<SynergyBadge score={undefined} />);
    
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('hides label for N/A when showLabel is false', () => {
    render(<SynergyBadge score={null} showLabel={false} />);
    
    expect(screen.queryByText('N/A')).not.toBeInTheDocument();
  });

  it('applies excellent variant for scores >= 80', () => {
    const { container } = render(<SynergyBadge score={85} />);
    const badge = container.firstChild;
    
    expect(badge).toHaveStyle({
      backgroundColor: '#dafbe1',
      color: '#116329'
    });
  });

  it('applies good variant for scores between 60-79', () => {
    const { container } = render(<SynergyBadge score={70} />);
    const badge = container.firstChild;
    
    expect(badge).toHaveStyle({
      backgroundColor: '#ddf4ff',
      color: '#0550ae'
    });
  });

  it('applies fair variant for scores between 40-59', () => {
    const { container } = render(<SynergyBadge score={50} />);
    const badge = container.firstChild;
    
    expect(badge).toHaveStyle({
      backgroundColor: '#fff8c5',
      color: '#7d4e00'
    });
  });

  it('applies poor variant for scores < 40', () => {
    const { container } = render(<SynergyBadge score={30} />);
    const badge = container.firstChild;
    
    expect(badge).toHaveStyle({
      backgroundColor: '#ffebe9',
      color: '#82071e'
    });
  });

  it('applies N/A styles for null score', () => {
    const { container } = render(<SynergyBadge score={null} />);
    const badge = container.firstChild;
    
    expect(badge).toHaveStyle({
      backgroundColor: '#f6f8fa',
      color: '#57606a'
    });
  });

  it('renders Star icon', () => {
    const { container } = render(<SynergyBadge score={75} />);
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('applies base badge styles', () => {
    const { container } = render(<SynergyBadge score={75} />);
    const badge = container.firstChild;
    
    expect(badge).toHaveStyle({
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 10px',
      borderRadius: '999px',
      fontSize: '12px',
      fontWeight: '600'
    });
  });

  it('handles score of 80 (boundary for excellent)', () => {
    const { container } = render(<SynergyBadge score={80} />);
    const badge = container.firstChild;
    
    expect(badge).toHaveStyle({
      backgroundColor: '#dafbe1'
    });
  });

  it('handles score of 60 (boundary for good)', () => {
    const { container } = render(<SynergyBadge score={60} />);
    const badge = container.firstChild;
    
    expect(badge).toHaveStyle({
      backgroundColor: '#ddf4ff'
    });
  });

  it('handles score of 40 (boundary for fair)', () => {
    const { container } = render(<SynergyBadge score={40} />);
    const badge = container.firstChild;
    
    expect(badge).toHaveStyle({
      backgroundColor: '#fff8c5'
    });
  });

  it('handles score of 0', () => {
    render(<SynergyBadge score={0} />);
    
    expect(screen.getByText('Synergy: 0')).toBeInTheDocument();
  });

  it('handles score of 100', () => {
    render(<SynergyBadge score={100} />);
    
    expect(screen.getByText('Synergy: 100')).toBeInTheDocument();
  });

  it('applies poor variant to score of 1', () => {
    const { container } = render(<SynergyBadge score={1} />);
    const badge = container.firstChild;
    
    expect(badge).toHaveStyle({
      backgroundColor: '#ffebe9'
    });
  });

  it('applies fair variant to score of 59', () => {
    const { container } = render(<SynergyBadge score={59} />);
    const badge = container.firstChild;
    
    expect(badge).toHaveStyle({
      backgroundColor: '#fff8c5'
    });
  });

  it('applies good variant to score of 79', () => {
    const { container } = render(<SynergyBadge score={79} />);
    const badge = container.firstChild;
    
    expect(badge).toHaveStyle({
      backgroundColor: '#ddf4ff'
    });
  });

  it('applies excellent variant to score of 99', () => {
    const { container } = render(<SynergyBadge score={99} />);
    const badge = container.firstChild;
    
    expect(badge).toHaveStyle({
      backgroundColor: '#dafbe1'
    });
  });

  it('renders as span element', () => {
    const { container } = render(<SynergyBadge score={75} />);
    
    expect(container.firstChild.tagName).toBe('SPAN');
  });

  it('updates when score changes', () => {
    const { rerender } = render(<SynergyBadge score={30} />);
    expect(screen.getByText('Synergy: 30')).toBeInTheDocument();
    
    rerender(<SynergyBadge score={85} />);
    expect(screen.getByText('Synergy: 85')).toBeInTheDocument();
    expect(screen.queryByText('Synergy: 30')).not.toBeInTheDocument();
  });

  it('updates when showLabel changes', () => {
    const { rerender } = render(<SynergyBadge score={75} showLabel={true} />);
    expect(screen.getByText('Synergy: 75')).toBeInTheDocument();
    
    rerender(<SynergyBadge score={75} showLabel={false} />);
    expect(screen.getByText('75')).toBeInTheDocument();
    expect(screen.queryByText('Synergy:')).not.toBeInTheDocument();
  });

  it('handles transition from valid score to null', () => {
    const { rerender } = render(<SynergyBadge score={75} />);
    expect(screen.getByText('Synergy: 75')).toBeInTheDocument();
    
    rerender(<SynergyBadge score={null} />);
    expect(screen.getByText('N/A')).toBeInTheDocument();
    expect(screen.queryByText('75')).not.toBeInTheDocument();
  });

  it('handles transition from null to valid score', () => {
    const { rerender } = render(<SynergyBadge score={null} />);
    expect(screen.getByText('N/A')).toBeInTheDocument();
    
    rerender(<SynergyBadge score={75} />);
    expect(screen.getByText('Synergy: 75')).toBeInTheDocument();
    expect(screen.queryByText('N/A')).not.toBeInTheDocument();
  });

  it('distinguishes between variant colors', () => {
    const scores = [20, 50, 70, 90];
    const colors = [];
    
    scores.forEach(score => {
      const { container, unmount } = render(<SynergyBadge score={score} />);
      const badge = container.firstChild;
      colors.push(badge.style.backgroundColor);
      unmount();
    });
    
    // All colors should be unique
    const uniqueColors = new Set(colors);
    expect(uniqueColors.size).toBe(4);
  });

  it('renders Star icon with correct size', () => {
    const { container } = render(<SynergyBadge score={75} />);
    
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '12');
    expect(svg).toHaveAttribute('height', '12');
  });

  it('handles negative scores as poor', () => {
    const { container } = render(<SynergyBadge score={-10} />);
    const badge = container.firstChild;
    
    expect(badge).toHaveStyle({
      backgroundColor: '#ffebe9'
    });
  });

  it('handles scores above 100 as excellent', () => {
    const { container } = render(<SynergyBadge score={150} />);
    const badge = container.firstChild;
    
    expect(badge).toHaveStyle({
      backgroundColor: '#dafbe1'
    });
  });
});
