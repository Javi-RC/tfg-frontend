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
    render(<ErrorState message="Error occurred" action={<button type="button">Retry</button>} />);
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('renders without action when not provided', () => {
    const { container } = render(<ErrorState message="Error" />);
    expect(container.querySelector('button')).not.toBeInTheDocument();
  });

  it('renders not centered when specified', () => {
    const { container } = render(<ErrorState message="Error" centered={false} />);
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

  it('renders complete ErrorState with all props', () => {
    render(
      <ErrorState
        message="Failed to load data"
        action={<button type="button">Try Again</button>}
        centered={true}
        variant="default"
      />
    );

    expect(screen.getByText('Failed to load data')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('handles long error messages', () => {
    const longMessage =
      'This is a very long error message that should still be displayed correctly without breaking the layout or causing any issues';
    render(<ErrorState message={longMessage} />);
    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });

});
