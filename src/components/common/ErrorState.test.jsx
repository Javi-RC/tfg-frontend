import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorState from './ErrorState';

describe('ErrorState Component', () => {
  it('renders with default message', () => {
    render(<ErrorState />);
    expect(screen.getByText('An error occurred')).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    render(<ErrorState message="Custom error message" />);
    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('renders with action button', () => {
    render(
      <ErrorState
        message="Error occurred"
        action={<button>Retry</button>}
      />
    );
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('renders without action when not provided', () => {
    const { container } = render(<ErrorState message="Error" />);
    expect(container.querySelector('button')).not.toBeInTheDocument();
  });

  it('renders centered by default', () => {
    const { container } = render(<ErrorState message="Error" />);
    const errorDiv = container.firstChild;
    expect(errorDiv).toHaveStyle({ textAlign: 'center' });
  });

  it('renders not centered when specified', () => {
    const { container } = render(
      <ErrorState message="Error" centered={false} />
    );
    const errorDiv = container.firstChild;
    expect(errorDiv).not.toHaveStyle({ textAlign: 'center' });
  });

  it('renders default variant with icon', () => {
    const { container } = render(<ErrorState variant="default" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders inline variant without icon', () => {
    const { container } = render(<ErrorState variant="inline" />);
    // Inline variant doesn't show icon in default case
    const svg = container.querySelector('svg');
    expect(svg).not.toBeInTheDocument();
  });

  it('applies default variant styles', () => {
    const { container } = render(<ErrorState variant="default" />);
    const errorDiv = container.firstChild;
    expect(errorDiv).toHaveStyle({ background: 'white' });
  });

  it('applies inline variant styles', () => {
    const { container } = render(<ErrorState variant="inline" />);
    const errorDiv = container.firstChild;
    expect(errorDiv).toHaveStyle({ 
      background: 'rgba(192,57,43,0.08)'
    });
  });

  it('renders complete ErrorState with all props', () => {
    render(
      <ErrorState
        message="Failed to load data"
        action={<button>Try Again</button>}
        centered={true}
        variant="default"
      />
    );
    
    expect(screen.getByText('Failed to load data')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('message text has correct color', () => {
    render(<ErrorState message="Error" />);
    const message = screen.getByText('Error');
    expect(message).toHaveStyle({ color: '#c0392b' });
  });

  it('handles long error messages', () => {
    const longMessage = 'This is a very long error message that should still be displayed correctly without breaking the layout or causing any issues';
    render(<ErrorState message={longMessage} />);
    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });

  it('handles empty message prop', () => {
    const { container } = render(<ErrorState message="" />);
    const paragraph = container.querySelector('p[style*="color"]');
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveTextContent('');
  });
});
