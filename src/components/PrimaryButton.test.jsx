import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PrimaryButton from './PrimaryButton';

describe('PrimaryButton Component', () => {
  it('renders with text content', () => {
    render(<PrimaryButton>Click Me</PrimaryButton>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<PrimaryButton onClick={handleClick}>Click Me</PrimaryButton>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(<PrimaryButton onClick={handleClick} disabled>Click Me</PrimaryButton>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies disabled styles when disabled', () => {
    render(<PrimaryButton disabled>Click Me</PrimaryButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveStyle({ cursor: 'not-allowed' });
  });

  it('renders with left icon', () => {
    const LeftIcon = <span data-testid="left-icon">←</span>;
    render(<PrimaryButton leftIcon={LeftIcon}>Click Me</PrimaryButton>);
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
  });

  it('renders with right icon', () => {
    const RightIcon = <span data-testid="right-icon">→</span>;
    render(<PrimaryButton rightIcon={RightIcon}>Click Me</PrimaryButton>);
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  it('accepts custom type attribute', () => {
    render(<PrimaryButton type="submit">Submit</PrimaryButton>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('defaults to button type', () => {
    render(<PrimaryButton>Click Me</PrimaryButton>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('applies custom styles', () => {
    const customStyle = { backgroundColor: 'red', fontSize: '20px' };
    render(<PrimaryButton style={customStyle}>Click Me</PrimaryButton>);
    const button = screen.getByRole('button');
    // Check that the custom style is applied by checking the style attribute contains our values
    expect(button.style.fontSize).toBe('20px');
  });

  it('has proper accessible cursor styles', () => {
    render(<PrimaryButton>Click Me</PrimaryButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveStyle({ cursor: 'pointer' });
  });
});
