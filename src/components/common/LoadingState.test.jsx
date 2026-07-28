import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoadingState from './LoadingState';

describe('LoadingState Component', () => {
  it('renders with default message', () => {
    render(<LoadingState />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    render(<LoadingState message="Loading data..." />);
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('renders not centered when specified', () => {
    const { container } = render(<LoadingState centered={false} />);
    const loadingDiv = container.firstChild;
    expect(loadingDiv).not.toHaveStyle({ textAlign: 'center' });
  });

  it('renders complete LoadingState with all props', () => {
    render(<LoadingState message="Please wait..." size="large" centered={true} />);

    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });

  it('handles long message', () => {
    const longMessage = 'Loading a very large dataset that may take several moments to complete...';
    render(<LoadingState message={longMessage} />);
    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });
});
