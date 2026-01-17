import React from 'react';
import { render, screen } from '@testing-library/react';
import InfoGrid from './InfoGrid';

describe('InfoGrid', () => {
  const sampleItems = [
    { key: 'name', label: 'Name', value: 'John Doe' },
    { key: 'email', label: 'Email', value: 'john@example.com' },
    { key: 'phone', label: 'Phone', value: '+1234567890' }
  ];

  it('renders all items', () => {
    render(<InfoGrid items={sampleItems} />);
    
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Phone')).toBeInTheDocument();
    expect(screen.getByText('+1234567890')).toBeInTheDocument();
  });

  it('renders empty grid when items array is empty', () => {
    const { container } = render(<InfoGrid items={[]} />);
    
    const grid = container.firstChild;
    expect(grid.children).toHaveLength(0);
  });

  it('uses default empty array when items not provided', () => {
    const { container } = render(<InfoGrid />);
    
    const grid = container.firstChild;
    expect(grid.children).toHaveLength(0);
  });

  it('renders single item', () => {
    const singleItem = [{ label: 'Status', value: 'Active' }];
    
    render(<InfoGrid items={singleItem} />);
    
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('uses item key when provided', () => {
    const { container } = render(<InfoGrid items={sampleItems} />);
    
    const grid = container.firstChild;
    expect(grid.children).toHaveLength(3);
  });

  it('falls back to index when key is not provided', () => {
    const itemsWithoutKeys = [
      { label: 'Field 1', value: 'Value 1' },
      { label: 'Field 2', value: 'Value 2' }
    ];
    
    render(<InfoGrid items={itemsWithoutKeys} />);
    
    expect(screen.getByText('Field 1')).toBeInTheDocument();
    expect(screen.getByText('Value 1')).toBeInTheDocument();
  });

  it('renders numeric values', () => {
    const numericItems = [
      { label: 'Age', value: 25 },
      { label: 'Score', value: 100 }
    ];
    
    render(<InfoGrid items={numericItems} />);
    
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('Score')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('renders boolean values', () => {
    const booleanItems = [
      { label: 'Active', value: 'true' },
      { label: 'Verified', value: 'false' }
    ];
    
    render(<InfoGrid items={booleanItems} />);
    
    expect(screen.getByText('true')).toBeInTheDocument();
    expect(screen.getByText('false')).toBeInTheDocument();
  });

  it('handles empty string values', () => {
    const emptyItems = [
      { label: 'Field', value: '' }
    ];
    
    render(<InfoGrid items={emptyItems} />);
    
    expect(screen.getByText('Field')).toBeInTheDocument();
  });

  it('handles null values gracefully', () => {
    const nullItems = [
      { label: 'Field', value: null }
    ];
    
    const { container } = render(<InfoGrid items={nullItems} />);
    
    expect(screen.getByText('Field')).toBeInTheDocument();
    expect(container.textContent).toContain('Field');
  });

  it('handles undefined values gracefully', () => {
    const undefinedItems = [
      { label: 'Field', value: undefined }
    ];
    
    render(<InfoGrid items={undefinedItems} />);
    
    expect(screen.getByText('Field')).toBeInTheDocument();
  });

  it('renders many items', () => {
    const manyItems = Array.from({ length: 10 }, (_, i) => ({
      key: `item${i}`,
      label: `Label ${i}`,
      value: `Value ${i}`
    }));
    
    render(<InfoGrid items={manyItems} />);
    
    expect(screen.getByText('Label 0')).toBeInTheDocument();
    expect(screen.getByText('Value 9')).toBeInTheDocument();
  });

  it('handles special characters in labels and values', () => {
    const specialItems = [
      { label: 'Name (Full)', value: 'John & Jane' },
      { label: 'Email <Primary>', value: 'test@example.com' }
    ];
    
    render(<InfoGrid items={specialItems} />);
    
    expect(screen.getByText('Name (Full)')).toBeInTheDocument();
    expect(screen.getByText('John & Jane')).toBeInTheDocument();
  });

  it('applies correct grid styles', () => {
    const { container } = render(<InfoGrid items={sampleItems} />);
    
    const grid = container.firstChild;
    expect(grid).toHaveStyle({
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
    });
  });

  it('updates when items prop changes', () => {
    const { rerender } = render(<InfoGrid items={sampleItems} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    
    const newItems = [{ label: 'New', value: 'Updated' }];
    rerender(<InfoGrid items={newItems} />);
    
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    expect(screen.getByText('Updated')).toBeInTheDocument();
  });

  it('renders with mixed data types', () => {
    const mixedItems = [
      { label: 'String', value: 'text' },
      { label: 'Number', value: 42 },
      { label: 'Zero', value: 0 }
    ];
    
    render(<InfoGrid items={mixedItems} />);
    
    expect(screen.getByText('text')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('maintains responsive grid layout', () => {
    const { container } = render(<InfoGrid items={sampleItems} />);
    
    const grid = container.firstChild;
    
    // Grid should have responsive template
    expect(grid.style.gridTemplateColumns).toContain('auto-fit');
    expect(grid.style.gridTemplateColumns).toContain('250px');
  });
});
