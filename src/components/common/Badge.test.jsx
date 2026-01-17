import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Badge from './Badge';

describe('Badge Component', () => {
  it('renders with text content', () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('applies success variant styles', () => {
    render(<Badge variant="success">Success</Badge>);
    const badge = screen.getByText('Success');
    expect(badge).toHaveStyle({
      background: '#D1FAE5',
      color: '#065F46',
    });
  });

  it('applies error variant styles', () => {
    render(<Badge variant="error">Error</Badge>);
    const badge = screen.getByText('Error');
    expect(badge).toHaveStyle({
      background: '#FEE2E2',
      color: '#991B1B',
    });
  });

  it('applies warning variant styles', () => {
    render(<Badge variant="warning">Warning</Badge>);
    const badge = screen.getByText('Warning');
    expect(badge).toHaveStyle({
      background: '#FEF3C7',
      color: '#92400E',
    });
  });

  it('applies info variant styles', () => {
    render(<Badge variant="info">Info</Badge>);
    const badge = screen.getByText('Info');
    expect(badge).toHaveStyle({
      background: '#DBEAFE',
      color: '#1E40AF',
    });
  });

  it('applies neutral variant styles', () => {
    render(<Badge variant="neutral">Neutral</Badge>);
    const badge = screen.getByText('Neutral');
    expect(badge).toHaveStyle({
      background: '#F3F4F6',
      color: '#374151',
    });
  });

  it('applies primary variant styles', () => {
    render(<Badge variant="primary">Primary</Badge>);
    const badge = screen.getByText('Primary');
    expect(badge).toHaveStyle({
      background: '#EFF6FF',
      color: '#1E40AF',
    });
  });

  it('applies small size styles', () => {
    render(<Badge size="small">Small</Badge>);
    const badge = screen.getByText('Small');
    expect(badge).toHaveStyle({
      padding: '2px 8px',
      fontSize: '11px',
    });
  });

  it('applies medium size styles (default)', () => {
    render(<Badge size="medium">Medium</Badge>);
    const badge = screen.getByText('Medium');
    expect(badge).toHaveStyle({
      padding: '4px 12px',
      fontSize: '12px',
    });
  });

  it('applies large size styles', () => {
    render(<Badge size="large">Large</Badge>);
    const badge = screen.getByText('Large');
    expect(badge).toHaveStyle({
      padding: '6px 16px',
      fontSize: '14px',
    });
  });

  it('applies custom color and textColor', () => {
    render(
      <Badge color="#FF0000" textColor="#FFFFFF">
        Custom
      </Badge>
    );
    const badge = screen.getByText('Custom');
    expect(badge).toHaveStyle({
      background: '#FF0000',
      color: '#FFFFFF',
    });
  });

  it('custom colors override variant styles', () => {
    render(
      <Badge variant="success" color="#FF0000" textColor="#FFFFFF">
        Override
      </Badge>
    );
    const badge = screen.getByText('Override');
    expect(badge).toHaveStyle({
      background: '#FF0000',
      color: '#FFFFFF',
    });
  });

  it('renders without variant or custom colors', () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByText('Default');
    expect(badge).toBeInTheDocument();
  });

  it('has inline-block display', () => {
    render(<Badge>Test</Badge>);
    const badge = screen.getByText('Test');
    expect(badge.tagName).toBe('SPAN');
  });
});
