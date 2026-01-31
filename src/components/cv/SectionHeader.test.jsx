import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SectionHeader from './SectionHeader';
import { Plus } from 'lucide-react';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, params) => {
      if (key === 'cv.editor.sectionHeader.addEntryAria') {
        return `Add entry to ${params.section}`;
      }
      if (key === 'common.add') return 'Add';
      return key;
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: () => {}
  }
}));

// Mock lucide-react
jest.mock('lucide-react', () => ({
  Plus: jest.fn(() => <svg data-testid="plus-icon" />)
}));

// Mock SecondaryButton
jest.mock('../SecondaryButton', () => {
  return jest.fn(({ onClick, children, style, 'aria-label': ariaLabel, leftIcon }) => (
    <button 
      onClick={onClick} 
      style={style} 
      aria-label={ariaLabel}
      data-testid="secondary-button"
    >
      {leftIcon}
      {children}
    </button>
  ));
});

describe('SectionHeader Component', () => {
  // Basic Rendering Tests
  describe('Basic Rendering', () => {
    test('renders section title correctly', () => {
      render(<SectionHeader title="Personal Information" />);
      expect(screen.getByText('Personal Information')).toBeInTheDocument();
    });

    test('renders with id attribute', () => {
      render(<SectionHeader id="personal-info" title="Personal Information" />);
      const heading = screen.getByText('Personal Information');
      expect(heading).toHaveAttribute('id', 'personal-info');
    });

    test('renders as h2 heading', () => {
      render(<SectionHeader title="Experience" />);
      const heading = screen.getByText('Experience');
      expect(heading.tagName).toBe('H2');
    });

    test('applies correct heading styles', () => {
      render(<SectionHeader title="Education" />);
      const heading = screen.getByText('Education');
      expect(heading).toHaveStyle({
        fontSize: '18px',
        fontWeight: '700',
        color: '#2d3748',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      });
    });
  });

  // Edit Mode Tests
  describe('Edit Mode Rendering', () => {
    test('does not show add button when editMode is false', () => {
      render(<SectionHeader title="Skills" editMode={false} onAdd={jest.fn()} />);
      expect(screen.queryByTestId('secondary-button')).not.toBeInTheDocument();
    });

    test('shows add button when editMode is true and onAdd is provided', () => {
      render(<SectionHeader title="Skills" editMode={true} onAdd={jest.fn()} />);
      expect(screen.getByTestId('secondary-button')).toBeInTheDocument();
    });

    test('does not show add button when editMode is true but onAdd is missing', () => {
      render(<SectionHeader title="Skills" editMode={true} />);
      expect(screen.queryByTestId('secondary-button')).not.toBeInTheDocument();
    });

    test('add button displays "Add" text', () => {
      render(<SectionHeader title="Skills" editMode={true} onAdd={jest.fn()} />);
      expect(screen.getByText('Add')).toBeInTheDocument();
    });

    test('add button includes Plus icon', () => {
      render(<SectionHeader title="Skills" editMode={true} onAdd={jest.fn()} />);
      expect(screen.getByTestId('plus-icon')).toBeInTheDocument();
    });
  });

  // Add Button Interaction Tests
  describe('Add Button Interactions', () => {
    test('calls onAdd when add button is clicked', () => {
      const handleAdd = jest.fn();
      render(<SectionHeader title="Experience" editMode={true} onAdd={handleAdd} />);
      const button = screen.getByTestId('secondary-button');
      fireEvent.click(button);
      expect(handleAdd).toHaveBeenCalledTimes(1);
    });

    test('handles multiple clicks on add button', () => {
      const handleAdd = jest.fn();
      render(<SectionHeader title="Education" editMode={true} onAdd={handleAdd} />);
      const button = screen.getByTestId('secondary-button');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      expect(handleAdd).toHaveBeenCalledTimes(3);
    });

    test('does not crash when onAdd is undefined', () => {
      render(<SectionHeader title="Skills" editMode={true} />);
      expect(screen.queryByTestId('secondary-button')).not.toBeInTheDocument();
    });
  });

  // Custom addLabel Tests
  describe('Custom Add Label', () => {
    test('uses custom addLabel when provided', () => {
      render(
        <SectionHeader 
          title="Projects" 
          editMode={true} 
          onAdd={jest.fn()} 
          addLabel="Add New Project" 
        />
      );
      const button = screen.getByTestId('secondary-button');
      expect(button).toHaveAttribute('aria-label', 'Add New Project');
    });

    test('uses default aria-label when addLabel is not provided', () => {
      render(<SectionHeader title="Experience" editMode={true} onAdd={jest.fn()} />);
      const button = screen.getByTestId('secondary-button');
      expect(button).toHaveAttribute('aria-label', 'Add entry to Experience');
    });

    test('generates aria-label from section title', () => {
      render(<SectionHeader title="Education" editMode={true} onAdd={jest.fn()} />);
      const button = screen.getByTestId('secondary-button');
      expect(button).toHaveAttribute('aria-label', 'Add entry to Education');
    });
  });

  // Layout Tests
  describe('Layout and Spacing', () => {
    test('applies flexbox layout to container', () => {
      const { container } = render(<SectionHeader title="Skills" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveStyle({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      });
    });

    test('applies correct margin to container', () => {
      const { container } = render(<SectionHeader title="Skills" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveStyle({ marginBottom: '28px' });
    });

    test('applies gap between title and button', () => {
      const { container } = render(<SectionHeader title="Skills" editMode={true} onAdd={jest.fn()} />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveStyle({ gap: '20px' });
    });
  });

  // Button Styling Tests
  describe('Button Styling', () => {
    test('applies custom styles to add button', () => {
      render(<SectionHeader title="Skills" editMode={true} onAdd={jest.fn()} />);
      const button = screen.getByTestId('secondary-button');
      expect(button).toHaveStyle({
        padding: '10px 20px',
        fontSize: '14px',
        fontWeight: '600',
        minWidth: '100px'
      });
    });
  });

  // Edge Cases
  describe('Edge Cases', () => {
    test('handles empty title gracefully', () => {
      render(<SectionHeader title="" editMode={false} />);
      expect(screen.queryByRole('heading')).toBeInTheDocument();
    });

    test('handles very long title', () => {
      const longTitle = 'A'.repeat(100);
      render(<SectionHeader title={longTitle} />);
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    test('handles title with special characters', () => {
      const specialTitle = '<script>alert("XSS")</script>';
      render(<SectionHeader title={specialTitle} />);
      expect(screen.getByText(specialTitle)).toBeInTheDocument();
    });

    test('renders correctly without id prop', () => {
      render(<SectionHeader title="Test" />);
      const heading = screen.getByText('Test');
      expect(heading).not.toHaveAttribute('id');
    });

    test('renders correctly with null id', () => {
      render(<SectionHeader id={null} title="Test" />);
      const heading = screen.getByText('Test');
      expect(heading).toBeInTheDocument();
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    test('heading is properly structured for screen readers', () => {
      render(<SectionHeader id="skills-section" title="Skills" />);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Skills');
      expect(heading).toHaveAttribute('id', 'skills-section');
    });

    test('add button has descriptive aria-label', () => {
      render(<SectionHeader title="Projects" editMode={true} onAdd={jest.fn()} />);
      const button = screen.getByTestId('secondary-button');
      expect(button).toHaveAttribute('aria-label', 'Add entry to Projects');
    });

    test('custom aria-label is properly applied', () => {
      render(
        <SectionHeader 
          title="Skills" 
          editMode={true} 
          onAdd={jest.fn()} 
          addLabel="Add New Skill Entry" 
        />
      );
      const button = screen.getByTestId('secondary-button');
      expect(button).toHaveAttribute('aria-label', 'Add New Skill Entry');
    });
  });

  // Integration Tests
  describe('Integration Scenarios', () => {
    test('works correctly in read-only CV view', () => {
      render(<SectionHeader title="Experience" editMode={false} />);
      expect(screen.getByText('Experience')).toBeInTheDocument();
      expect(screen.queryByTestId('secondary-button')).not.toBeInTheDocument();
    });

    test('works correctly in edit CV mode', () => {
      const handleAdd = jest.fn();
      render(<SectionHeader title="Experience" editMode={true} onAdd={handleAdd} />);
      expect(screen.getByText('Experience')).toBeInTheDocument();
      expect(screen.getByTestId('secondary-button')).toBeInTheDocument();
    });

    test('transitions between edit and read modes', () => {
      const { rerender } = render(<SectionHeader title="Skills" editMode={false} />);
      expect(screen.queryByTestId('secondary-button')).not.toBeInTheDocument();
      
      rerender(<SectionHeader title="Skills" editMode={true} onAdd={jest.fn()} />);
      expect(screen.getByTestId('secondary-button')).toBeInTheDocument();
      
      rerender(<SectionHeader title="Skills" editMode={false} />);
      expect(screen.queryByTestId('secondary-button')).not.toBeInTheDocument();
    });
  });
});
