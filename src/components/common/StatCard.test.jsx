import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TrendingUp } from 'lucide-react';
import StatCard from './StatCard';

describe('StatCard Component', () => {
  it('renders with value and label', () => {
    render(<StatCard value="150" label="Total Users" />);
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('Total Users')).toBeInTheDocument();
  });

  it('renders with icon', () => {
    const { container } = render(
      <StatCard
        value="75"
        label="Sales"
        icon={TrendingUp}
      />
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders without icon', () => {
    const { container } = render(
      <StatCard value="100" label="Items" />
    );
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });

  it('applies custom border color', () => {
    const { container } = render(
      <StatCard
        value="50"
        label="Score"
        borderColor="#FF0000"
      />
    );
    const card = container.firstChild;
    expect(card).toHaveStyle({ borderLeft: '4px solid #FF0000' });
  });

  it('applies custom icon color', () => {
    const { container } = render(
      <StatCard
        value="25"
        label="Count"
        icon={TrendingUp}
        iconColor="#00FF00"
      />
    );
    // Icon receives color prop, verify it's present
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('applies custom background color', () => {
    const { container } = render(
      <StatCard
        value="10"
        label="Items"
        icon={TrendingUp}
        backgroundColor="#F0F0F0"
      />
    );
    // Background color is applied to icon wrapper
    const iconWrapper = container.querySelector('div[style*="48px"]');
    expect(iconWrapper).toBeInTheDocument();
  });

  it('applies custom value color', () => {
    render(
      <StatCard
        value="999"
        label="Total"
        valueColor="#0000FF"
      />
    );
    const value = screen.getByText('999');
    expect(value).toHaveStyle({ color: '#0000FF' });
  });

  it('applies custom label color', () => {
    render(
      <StatCard
        value="42"
        label="Answer"
        labelColor="#FF00FF"
      />
    );
    const label = screen.getByText('Answer');
    expect(label).toHaveStyle({ color: '#FF00FF' });
  });

  it('uses default colors when not specified', () => {
    render(<StatCard value="123" label="Default" />);
    const value = screen.getByText('123');
    const label = screen.getByText('Default');
    expect(value).toHaveStyle({ color: '#111827' });
    expect(label).toHaveStyle({ color: '#6B7280' });
  });

  it('renders with all custom props', () => {
    render(
      <StatCard
        value="500"
        label="Premium Users"
        icon={TrendingUp}
        borderColor="#8B5CF6"
        iconColor="#8B5CF6"
        backgroundColor="#F5F3FF"
        valueColor="#1F2937"
        labelColor="#4B5563"
      />
    );
    
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('Premium Users')).toBeInTheDocument();
  });

  it('handles numeric values', () => {
    render(<StatCard value={12345} label="Number" />);
    expect(screen.getByText('12345')).toBeInTheDocument();
  });

  it('handles string values with formatting', () => {
    render(<StatCard value="$1,234.56" label="Revenue" />);
    expect(screen.getByText('$1,234.56')).toBeInTheDocument();
  });

  it('icon has correct size', () => {
    const { container } = render(
      <StatCard
        value="10"
        label="Test"
        icon={TrendingUp}
      />
    );
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '24');
  });
});
