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

  it('renders centered by default', () => {
    const { container } = render(<LoadingState />);
    const loadingDiv = container.firstChild;
    expect(loadingDiv).toHaveStyle({ textAlign: 'center' });
  });

  it('renders not centered when specified', () => {
    const { container } = render(<LoadingState centered={false} />);
    const loadingDiv = container.firstChild;
    expect(loadingDiv).not.toHaveStyle({ textAlign: 'center' });
  });

  it('applies small size styles', () => {
    const { container } = render(<LoadingState size="small" />);
    const loadingDiv = container.firstChild;
    expect(loadingDiv).toHaveStyle({ 
      padding: '20px',
      fontSize: '14px'
    });
  });

  it('applies medium size styles (default)', () => {
    const { container } = render(<LoadingState size="medium" />);
    const loadingDiv = container.firstChild;
    expect(loadingDiv).toHaveStyle({ 
      padding: '60px',
      fontSize: '16px'
    });
  });

  it('applies large size styles', () => {
    const { container } = render(<LoadingState size="large" />);
    const loadingDiv = container.firstChild;
    expect(loadingDiv).toHaveStyle({ 
      padding: '100px',
      fontSize: '18px'
    });
  });

  it('uses medium size as default', () => {
    const { container } = render(<LoadingState />);
    const loadingDiv = container.firstChild;
    expect(loadingDiv).toHaveStyle({ fontSize: '16px' });
  });

  it('text has correct color', () => {
    render(<LoadingState />);
    const text = screen.getByText('Loading...');
    expect(text).toHaveStyle({ color: '#6B7280' });
  });

  it('renders complete LoadingState with all props', () => {
    render(
      <LoadingState
        message="Please wait..."
        size="large"
        centered={true}
      />
    );
    
    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });

  it('handles empty message', () => {
    const { container } = render(<LoadingState message="" />);
    const paragraph = container.querySelector('p');
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveTextContent('');
  });

  it('handles long message', () => {
    const longMessage = 'Loading a very large dataset that may take several moments to complete...';
    render(<LoadingState message={longMessage} />);
    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });
});
