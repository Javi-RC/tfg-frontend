import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WARMUP_STATUS } from '../../constants/warmup';
import WarmupSplash from './WarmupSplash';

const renderSplash = (props = {}) =>
  render(
    <WarmupSplash
      status={WARMUP_STATUS.PROBING}
      startedAt={Date.now()}
      onRetry={jest.fn()}
      {...props}
    />
  );

/** Moves the splash's own clock forward past its stage ticks. */
const tick = (ms) => act(() => jest.advanceTimersByTime(ms));

describe('WarmupSplash', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('opens on the connecting copy', () => {
    renderSplash();

    expect(screen.getByText('Connecting to Sara…')).toBeInTheDocument();
  });

  it('moves to the starting copy after four seconds', () => {
    renderSplash();

    tick(4000);

    expect(screen.getByText('Starting up the services…')).toBeInTheDocument();
  });

  it('admits it is slow after twelve seconds', () => {
    renderSplash();

    tick(12000);

    expect(screen.getByText('This is taking longer than usual…')).toBeInTheDocument();
  });

  it('announces progress through a single polite live region', () => {
    renderSplash();

    const status = screen.getByRole('status');

    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status).toHaveAttribute('aria-busy', 'true');
    expect(status).toHaveTextContent('Connecting to Sara…');
  });

  it('keeps the brand out of the live region, so it is not re-announced each stage', () => {
    renderSplash();

    const brand = screen.getByText('Sara');

    expect(brand).toBeInTheDocument();
    expect(screen.getByRole('status')).not.toContainElement(brand);
  });

  it('offers a retry once the warm-up has given up', () => {
    renderSplash({ status: WARMUP_STATUS.FAILED });

    expect(screen.getByText('Could not reach Sara')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'false');
  });

  it('stops its clock once it has failed', () => {
    renderSplash({ status: WARMUP_STATUS.FAILED });

    expect(jest.getTimerCount()).toBe(0);
  });

  it('focuses the retry button, since the screen has exactly one action', () => {
    renderSplash({ status: WARMUP_STATUS.FAILED });

    expect(screen.getByRole('button', { name: /try again/i })).toHaveFocus();
  });

  it('calls back once when the retry is pressed', async () => {
    const onRetry = jest.fn();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    renderSplash({ status: WARMUP_STATUS.FAILED, onRetry });

    await user.click(screen.getByRole('button', { name: /try again/i }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
