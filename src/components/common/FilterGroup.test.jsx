import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterGroup from './FilterGroup';

describe('FilterGroup', () => {
  const defaultOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ];

  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders select element with options', () => {
    render(
      <FilterGroup
        label="Test Filter"
        value=""
        onChange={mockOnChange}
        options={defaultOptions}
      />
    );
    
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('displays label when provided', () => {
    render(
      <FilterGroup
        label="Status"
        value=""
        onChange={mockOnChange}
        options={defaultOptions}
      />
    );
    
    expect(screen.getByText('Status:')).toBeInTheDocument();
  });

  it('does not display label when not provided', () => {
    const { container } = render(
      <FilterGroup
        value=""
        onChange={mockOnChange}
        options={defaultOptions}
      />
    );
    
    expect(container.querySelector('label')).not.toBeInTheDocument();
  });

  it('renders placeholder option when provided', () => {
    render(
      <FilterGroup
        value=""
        onChange={mockOnChange}
        options={defaultOptions}
        placeholder="Choose an option"
      />
    );
    
    expect(screen.getByText('Choose an option')).toBeInTheDocument();
  });

  it('uses default placeholder text', () => {
    render(
      <FilterGroup
        value=""
        onChange={mockOnChange}
        options={defaultOptions}
      />
    );
    
    expect(screen.getByText('Select...')).toBeInTheDocument();
  });

  it('sets correct selected value', () => {
    render(
      <FilterGroup
        value="option2"
        onChange={mockOnChange}
        options={defaultOptions}
      />
    );
    
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('option2');
  });

  it('calls onChange when selection changes', () => {
    render(
      <FilterGroup
        value=""
        onChange={mockOnChange}
        options={defaultOptions}
      />
    );
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'option2' } });
    
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('renders empty option list', () => {
    render(
      <FilterGroup
        value=""
        onChange={mockOnChange}
        options={[]}
      />
    );
    
    const select = screen.getByRole('combobox');
    expect(select.children).toHaveLength(1); // Only placeholder
  });

  it('handles options without placeholder', () => {
    render(
      <FilterGroup
        value="option1"
        onChange={mockOnChange}
        options={defaultOptions}
        placeholder={null}
      />
    );
    
    const select = screen.getByRole('combobox');
    const placeholderOption = Array.from(select.children).find(
      opt => opt.value === ''
    );
    expect(placeholderOption).toBeUndefined();
  });

  it('applies custom minWidth', () => {
    render(
      <FilterGroup
        value=""
        onChange={mockOnChange}
        options={defaultOptions}
        minWidth="300px"
      />
    );
    
    const select = screen.getByRole('combobox');
    expect(select.style.minWidth).toBe('300px');
  });

  it('uses default minWidth', () => {
    render(
      <FilterGroup
        value=""
        onChange={mockOnChange}
        options={defaultOptions}
      />
    );
    
    const select = screen.getByRole('combobox');
    expect(select.style.minWidth).toBe('180px');
  });

  it('renders all option values correctly', () => {
    render(
      <FilterGroup
        value=""
        onChange={mockOnChange}
        options={defaultOptions}
      />
    );
    
    const select = screen.getByRole('combobox');
    const option1 = Array.from(select.children).find(
      opt => opt.value === 'option1'
    );
    const option2 = Array.from(select.children).find(
      opt => opt.value === 'option2'
    );
    
    expect(option1).toBeDefined();
    expect(option2).toBeDefined();
    expect(option1.textContent).toBe('Option 1');
    expect(option2.textContent).toBe('Option 2');
  });

  it('handles single option', () => {
    render(
      <FilterGroup
        value=""
        onChange={mockOnChange}
        options={[{ value: 'only', label: 'Only Option' }]}
      />
    );
    
    expect(screen.getByText('Only Option')).toBeInTheDocument();
  });

  it('renders with numeric values', () => {
    const numericOptions = [
      { value: 1, label: 'One' },
      { value: 2, label: 'Two' }
    ];
    
    render(
      <FilterGroup
        value={1}
        onChange={mockOnChange}
        options={numericOptions}
      />
    );
    
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('1');
  });

  it('updates when value prop changes', () => {
    const { rerender } = render(
      <FilterGroup
        value="option1"
        onChange={mockOnChange}
        options={defaultOptions}
      />
    );
    
    expect(screen.getByRole('combobox')).toHaveValue('option1');
    
    rerender(
      <FilterGroup
        value="option2"
        onChange={mockOnChange}
        options={defaultOptions}
      />
    );
    
    expect(screen.getByRole('combobox')).toHaveValue('option2');
  });

  it('handles options with special characters', () => {
    const specialOptions = [
      { value: 'opt-1', label: 'Option #1' },
      { value: 'opt_2', label: 'Option (2)' }
    ];
    
    render(
      <FilterGroup
        value=""
        onChange={mockOnChange}
        options={specialOptions}
      />
    );
    
    expect(screen.getByText('Option #1')).toBeInTheDocument();
    expect(screen.getByText('Option (2)')).toBeInTheDocument();
  });

  it('maintains selection after re-render', () => {
    const { rerender } = render(
      <FilterGroup
        value="option2"
        onChange={mockOnChange}
        options={defaultOptions}
      />
    );
    
    rerender(
      <FilterGroup
        value="option2"
        onChange={mockOnChange}
        options={defaultOptions}
      />
    );
    
    expect(screen.getByRole('combobox')).toHaveValue('option2');
  });
});
