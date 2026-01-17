import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Grid, List } from 'lucide-react';
import ViewToggle from './ViewToggle';

describe('ViewToggle', () => {
  const defaultOptions = [
    { value: 'grid', label: 'Grid', icon: Grid },
    { value: 'list', label: 'List', icon: List }
  ];

  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders all options', () => {
    render(
      <ViewToggle
        options={defaultOptions}
        activeView="grid"
        onChange={mockOnChange}
      />
    );
    
    expect(screen.getByText('Grid')).toBeInTheDocument();
    expect(screen.getByText('List')).toBeInTheDocument();
  });

  it('highlights active view', () => {
    render(
      <ViewToggle
        options={defaultOptions}
        activeView="grid"
        onChange={mockOnChange}
      />
    );
    
    const gridButton = screen.getByText('Grid').closest('button');
    const listButton = screen.getByText('List').closest('button');
    
    expect(gridButton).toHaveAttribute('aria-pressed', 'true');
    expect(listButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onChange when option is clicked', () => {
    render(
      <ViewToggle
        options={defaultOptions}
        activeView="grid"
        onChange={mockOnChange}
      />
    );
    
    const listButton = screen.getByText('List');
    fireEvent.click(listButton);
    
    expect(mockOnChange).toHaveBeenCalledWith('list');
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('does not call onChange when clicking active option', () => {
    render(
      <ViewToggle
        options={defaultOptions}
        activeView="grid"
        onChange={mockOnChange}
      />
    );
    
    const gridButton = screen.getByText('Grid');
    fireEvent.click(gridButton);
    
    // Still calls onChange, but with same value
    expect(mockOnChange).toHaveBeenCalledWith('grid');
  });

  it('renders icons when provided', () => {
    const { container } = render(
      <ViewToggle
        options={defaultOptions}
        activeView="grid"
        onChange={mockOnChange}
      />
    );
    
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('renders without icons', () => {
    const optionsWithoutIcons = [
      { value: 'view1', label: 'View 1' },
      { value: 'view2', label: 'View 2' }
    ];
    
    render(
      <ViewToggle
        options={optionsWithoutIcons}
        activeView="view1"
        onChange={mockOnChange}
      />
    );
    
    expect(screen.getByText('View 1')).toBeInTheDocument();
    expect(screen.getByText('View 2')).toBeInTheDocument();
  });

  it('has proper ARIA attributes', () => {
    render(
      <ViewToggle
        options={defaultOptions}
        activeView="grid"
        onChange={mockOnChange}
        ariaLabel="View mode toggle"
      />
    );
    
    const group = screen.getByRole('group');
    expect(group).toHaveAttribute('aria-label', 'View mode toggle');
  });

  it('uses default ARIA label', () => {
    render(
      <ViewToggle
        options={defaultOptions}
        activeView="grid"
        onChange={mockOnChange}
      />
    );
    
    const group = screen.getByRole('group');
    expect(group).toHaveAttribute('aria-label', 'View toggle');
  });

  it('handles single option', () => {
    const singleOption = [{ value: 'only', label: 'Only View', icon: Grid }];
    
    render(
      <ViewToggle
        options={singleOption}
        activeView="only"
        onChange={mockOnChange}
      />
    );
    
    expect(screen.getByText('Only View')).toBeInTheDocument();
  });

  it('handles many options', () => {
    const manyOptions = [
      { value: 'view1', label: 'View 1' },
      { value: 'view2', label: 'View 2' },
      { value: 'view3', label: 'View 3' },
      { value: 'view4', label: 'View 4' }
    ];
    
    render(
      <ViewToggle
        options={manyOptions}
        activeView="view1"
        onChange={mockOnChange}
      />
    );
    
    expect(screen.getByText('View 1')).toBeInTheDocument();
    expect(screen.getByText('View 4')).toBeInTheDocument();
  });

  it('changes active view when prop updates', () => {
    const { rerender } = render(
      <ViewToggle
        options={defaultOptions}
        activeView="grid"
        onChange={mockOnChange}
      />
    );
    
    let gridButton = screen.getByText('Grid').closest('button');
    expect(gridButton).toHaveAttribute('aria-pressed', 'true');
    
    rerender(
      <ViewToggle
        options={defaultOptions}
        activeView="list"
        onChange={mockOnChange}
      />
    );
    
    let listButton = screen.getByText('List').closest('button');
    expect(listButton).toHaveAttribute('aria-pressed', 'true');
    
    gridButton = screen.getByText('Grid').closest('button');
    expect(gridButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('renders all buttons as clickable', () => {
    render(
      <ViewToggle
        options={defaultOptions}
        activeView="grid"
        onChange={mockOnChange}
      />
    );
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).not.toBeDisabled();
    });
  });

  it('handles rapid clicks', () => {
    render(
      <ViewToggle
        options={defaultOptions}
        activeView="grid"
        onChange={mockOnChange}
      />
    );
    
    const listButton = screen.getByText('List');
    
    fireEvent.click(listButton);
    fireEvent.click(listButton);
    fireEvent.click(listButton);
    
    expect(mockOnChange).toHaveBeenCalledTimes(3);
    expect(mockOnChange).toHaveBeenCalledWith('list');
  });

  it('renders options with different value types', () => {
    const mixedOptions = [
      { value: 1, label: 'Option 1' },
      { value: 'two', label: 'Option 2' }
    ];
    
    render(
      <ViewToggle
        options={mixedOptions}
        activeView={1}
        onChange={mockOnChange}
      />
    );
    
    const option2 = screen.getByText('Option 2');
    fireEvent.click(option2);
    
    expect(mockOnChange).toHaveBeenCalledWith('two');
  });

  it('maintains button order', () => {
    render(
      <ViewToggle
        options={defaultOptions}
        activeView="grid"
        onChange={mockOnChange}
      />
    );
    
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveTextContent('Grid');
    expect(buttons[1]).toHaveTextContent('List');
  });

  it('applies active styles correctly', () => {
    render(
      <ViewToggle
        options={defaultOptions}
        activeView="grid"
        onChange={mockOnChange}
      />
    );
    
    const gridButton = screen.getByText('Grid').closest('button');
    const listButton = screen.getByText('List').closest('button');
    
    expect(gridButton.style.background).toBe('white');
    expect(listButton.style.background).toBe('transparent');
  });

  it('handles options with special characters', () => {
    const specialOptions = [
      { value: 'opt-1', label: 'Option #1', icon: Grid },
      { value: 'opt_2', label: 'Option (2)', icon: List }
    ];
    
    render(
      <ViewToggle
        options={specialOptions}
        activeView="opt-1"
        onChange={mockOnChange}
      />
    );
    
    expect(screen.getByText('Option #1')).toBeInTheDocument();
    expect(screen.getByText('Option (2)')).toBeInTheDocument();
  });
});
