import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Tooltip from './Tooltip';

// Mock timer for delays
jest.useFakeTimers();

describe('Tooltip Component', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it('renders children', () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    );
    expect(screen.getByRole('button', { name: /hover me/i })).toBeInTheDocument();
  });

  it('does not show tooltip initially', () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    );
    expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();
  });

  it('shows tooltip on mouse enter after delay', async () => {
    render(
      <Tooltip content="Tooltip text" delay={200}>
        <button>Hover me</button>
      </Tooltip>
    );
    
    const button = screen.getByRole('button');
    fireEvent.mouseEnter(button);
    
    jest.advanceTimersByTime(200);
    
    await waitFor(() => {
      expect(screen.getByText('Tooltip text')).toBeInTheDocument();
    });
  });

  it('hides tooltip on mouse leave', async () => {
    render(
      <Tooltip content="Tooltip text" delay={0}>
        <button>Hover me</button>
      </Tooltip>
    );
    
    const button = screen.getByRole('button');
    fireEvent.mouseEnter(button);
    jest.runAllTimers();
    
    await waitFor(() => {
      expect(screen.getByText('Tooltip text')).toBeInTheDocument();
    });
    
    fireEvent.mouseLeave(button);
    
    expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();
  });

  it('shows tooltip on focus', async () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Focus me</button>
      </Tooltip>
    );
    
    const button = screen.getByRole('button');
    fireEvent.focus(button);
    
    await waitFor(() => {
      expect(screen.getByText('Tooltip text')).toBeInTheDocument();
    });
  });

  it('hides tooltip on blur', async () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Focus me</button>
      </Tooltip>
    );
    
    const button = screen.getByRole('button');
    fireEvent.focus(button);
    
    await waitFor(() => {
      expect(screen.getByText('Tooltip text')).toBeInTheDocument();
    });
    
    fireEvent.blur(button);
    
    expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();
  });

  it('respects custom delay', async () => {
    render(
      <Tooltip content="Tooltip text" delay={500}>
        <button>Hover me</button>
      </Tooltip>
    );
    
    const button = screen.getByRole('button');
    fireEvent.mouseEnter(button);
    
    // Advance by less than delay - should not show
    jest.advanceTimersByTime(300);
    expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();
    
    // Advance remaining time - should now show
    jest.advanceTimersByTime(200);
    await waitFor(() => {
      expect(screen.getByText('Tooltip text')).toBeInTheDocument();
    });
  });

  it('cancels tooltip if mouse leaves before delay', async () => {
    render(
      <Tooltip content="Tooltip text" delay={500}>
        <button>Hover me</button>
      </Tooltip>
    );
    
    const button = screen.getByRole('button');
    fireEvent.mouseEnter(button);
    
    jest.advanceTimersByTime(300);
    fireEvent.mouseLeave(button);
    
    jest.advanceTimersByTime(300);
    expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();
  });

  it('supports different positions', () => {
    const positions = ['top', 'bottom', 'left', 'right'];
    
    positions.forEach(position => {
      const { unmount } = render(
        <Tooltip content="Tooltip text" position={position}>
          <button>{position}</button>
        </Tooltip>
      );
      unmount();
    });
  });

  it('cleans up timeout on unmount', () => {
    const { unmount } = render(
      <Tooltip content="Tooltip text" delay={500}>
        <button>Hover me</button>
      </Tooltip>
    );
    
    const button = screen.getByRole('button');
    fireEvent.mouseEnter(button);
    
    unmount();
    
    jest.runAllTimers();
    // Should not throw any errors
  });

  it('renders tooltip component structure', () => {
    render(
      <Tooltip content="Helpful information">
        <button>Help</button>
      </Tooltip>
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
});
