import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SecondaryButton from './SecondaryButton';

describe('SecondaryButton Component', () => {
  it('renders with text content', () => {
    render(<SecondaryButton>Click Me</SecondaryButton>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<SecondaryButton onClick={handleClick}>Click Me</SecondaryButton>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(
      <SecondaryButton onClick={handleClick} disabled>
        Click Me
      </SecondaryButton>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders with left icon', () => {
    const LeftIcon = <span data-testid="left-icon">←</span>;
    render(<SecondaryButton leftIcon={LeftIcon}>Click Me</SecondaryButton>);
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
  });

  it('renders with right icon', () => {
    const RightIcon = <span data-testid="right-icon">→</span>;
    render(<SecondaryButton rightIcon={RightIcon}>Click Me</SecondaryButton>);
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  it('accepts custom type attribute', () => {
    render(<SecondaryButton type="submit">Submit</SecondaryButton>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('applies custom styles', () => {
    const customStyle = { fontSize: '20px' };
    render(<SecondaryButton style={customStyle}>Click Me</SecondaryButton>);
    const button = screen.getByRole('button');
    expect(button.style.fontSize).toBe('20px');
  });
});
