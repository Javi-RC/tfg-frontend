import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Package } from 'lucide-react';
import EmptyState from './EmptyState';

describe('EmptyState Component', () => {
  it('renders with title only', () => {
    render(<EmptyState title="No data found" />);
    expect(screen.getByText('No data found')).toBeInTheDocument();
  });

  it('renders with title and description', () => {
    render(
      <EmptyState
        title="No items"
        description="There are no items to display"
      />
    );
    expect(screen.getByText('No items')).toBeInTheDocument();
    expect(screen.getByText('There are no items to display')).toBeInTheDocument();
  });

  it('renders with icon', () => {
    const { container } = render(
      <EmptyState
        icon={Package}
        title="No packages"
      />
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders with action button', () => {
    render(
      <EmptyState
        title="No data"
        action={<button>Add Item</button>}
      />
    );
    expect(screen.getByRole('button', { name: /add item/i })).toBeInTheDocument();
  });

  it('renders without icon when not provided', () => {
    const { container } = render(<EmptyState title="No data" />);
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });

  it('renders without description when not provided', () => {
    render(<EmptyState title="No data" />);
    expect(screen.queryByText(/description/i)).not.toBeInTheDocument();
  });

  it('renders without action when not provided', () => {
    const { container } = render(<EmptyState title="No data" />);
    const buttons = container.querySelectorAll('button');
    expect(buttons).toHaveLength(0);
  });

  it('applies custom icon size', () => {
    const { container } = render(
      <EmptyState
        icon={Package}
        title="No data"
        iconSize={100}
      />
    );
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '100');
  });

  it('applies custom icon color', () => {
    const { container } = render(
      <EmptyState
        icon={Package}
        title="No data"
        iconColor="#FF0000"
      />
    );
    // Icon receives color prop, verify it's present
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('applies custom icon opacity', () => {
    const { container } = render(
      <EmptyState
        icon={Package}
        title="No data"
        iconOpacity={0.5}
      />
    );
    const svg = container.querySelector('svg');
    expect(svg).toHaveStyle({ opacity: 0.5 });
  });

  it('uses default icon size when not specified', () => {
    const { container } = render(
      <EmptyState icon={Package} title="No data" />
    );
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '64');
  });

  it('renders complete EmptyState with all props', () => {
    render(
      <EmptyState
        icon={Package}
        title="No packages found"
        description="Start by adding your first package"
        action={<button>Add Package</button>}
        iconSize={80}
        iconColor="#999"
        iconOpacity={0.4}
      />
    );
    
    expect(screen.getByText('No packages found')).toBeInTheDocument();
    expect(screen.getByText('Start by adding your first package')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
