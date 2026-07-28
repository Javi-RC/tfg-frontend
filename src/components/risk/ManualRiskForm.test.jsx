import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ManualRiskForm from './ManualRiskForm';

describe('ManualRiskForm Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  const defaultProps = {
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel,
    loading: false,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Add Mode', () => {
    it('should render form for adding a new risk', () => {
      render(<ManualRiskForm {...defaultProps} />);

      expect(screen.getByText('Add Manual Risk')).toBeInTheDocument();
      expect(screen.getByLabelText(/Risk Type/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText('e.g., Vendor API downtime risk')).toBeInTheDocument();
    });

    it('should submit form with valid data', async () => {
      const user = userEvent.setup();
      render(<ManualRiskForm {...defaultProps} />);

      const typeSelect = screen.getByLabelText(/Risk Type/i);
      const titleInput = screen.getByPlaceholderText('e.g., Vendor API downtime risk');
      const descriptionInput = screen.getByPlaceholderText('Detailed description of the risk');

      await user.selectOptions(typeSelect, 'vendor_lock_in');
      await user.type(titleInput, 'Vendor Lock-in Risk');
      await user.type(descriptionInput, 'Risk of vendor API dependency');

      const submitButton = screen.getByRole('button', { name: /Add Risk/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'vendor_lock_in',
            title: 'Vendor Lock-in Risk',
            description: 'Risk of vendor API dependency',
          })
        );
      });
    });

    it('should show validation errors for required fields', async () => {
      const user = userEvent.setup();
      render(<ManualRiskForm {...defaultProps} />);

      const submitButton = screen.getByRole('button', { name: /Add Risk/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Risk type is required')).toBeInTheDocument();
        expect(screen.getByText('Title is required')).toBeInTheDocument();
        expect(screen.getByText('Description is required')).toBeInTheDocument();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should allow adding indicators', async () => {
      const user = userEvent.setup();
      render(<ManualRiskForm {...defaultProps} />);

      const indicatorInput = screen.getByPlaceholderText('Add an indicator and press Add');
      const addButton = screen.getAllByText('Add')[0];

      await user.type(indicatorInput, 'No SLA contract');
      await user.click(addButton);

      expect(screen.getByText('No SLA contract')).toBeInTheDocument();
    });

    it('should remove indicators', async () => {
      const user = userEvent.setup();
      render(<ManualRiskForm {...defaultProps} />);

      const indicatorInput = screen.getByPlaceholderText('Add an indicator and press Add');
      const addButton = screen.getAllByText('Add')[0];

      await user.type(indicatorInput, 'Test Indicator');
      await user.click(addButton);

      const removeButton = screen.getByText('×');
      await user.click(removeButton);

      expect(screen.queryByText('Test Indicator')).not.toBeInTheDocument();
    });

    it('should allow adding recommendations', async () => {
      const user = userEvent.setup();
      render(<ManualRiskForm {...defaultProps} />);

      const recommendationInput = screen.getByPlaceholderText('Add a recommendation and press Add');
      const addButtons = screen.getAllByText('Add');
      const addRecommendationButton = addButtons[1];

      await user.type(recommendationInput, 'Implement caching');
      await user.click(addRecommendationButton);

      expect(screen.getByText('Implement caching')).toBeInTheDocument();
    });

    it('should handle cancel button', async () => {
      const user = userEvent.setup();
      render(<ManualRiskForm {...defaultProps} />);

      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      await user.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalled();
    });

    it('should allow adding indicators via Enter key', async () => {
      const user = userEvent.setup();
      render(<ManualRiskForm {...defaultProps} />);

      const indicatorInput = screen.getByPlaceholderText('Add an indicator and press Add');

      await user.type(indicatorInput, 'Test Indicator');
      await user.keyboard('{Enter}');

      expect(screen.getByText('Test Indicator')).toBeInTheDocument();
    });
  });

  describe('Edit Mode', () => {
    const mockRisk = {
      _id: '507f1f77bcf86cd799439011',
      type: 'vendor_lock_in',
      title: 'Existing Vendor Risk',
      description: 'Existing risk description',
      severity: 'high',
      rootCause: 'No alternatives',
      indicators: ['No SLA'],
      recommendations: ['Implement caching'],
      status: 'predicted',
    };

    it('should render form for editing an existing risk', () => {
      render(<ManualRiskForm {...defaultProps} initialRisk={mockRisk} />);

      expect(screen.getByText('Edit Manual Risk')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Existing Vendor Risk')).toBeInTheDocument();
      expect(screen.getByText('No SLA')).toBeInTheDocument();
    });

    it('should submit edited risk with updated data', async () => {
      const user = userEvent.setup();
      render(<ManualRiskForm {...defaultProps} initialRisk={mockRisk} />);

      const severitySelect = screen.getByLabelText(/Severity/i);
      await user.selectOptions(severitySelect, 'critical');

      const submitButton = screen.getByRole('button', { name: /Update Risk/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            severity: 'critical',
          })
        );
      });
    });
  });

  describe('Close Modal', () => {
    it('should close modal when clicking close button', async () => {
      const user = userEvent.setup();
      const { container } = render(<ManualRiskForm {...defaultProps} />);

      const closeButton = container.querySelector('button[aria-label="Close"]');
      await user.click(closeButton);

      expect(mockOnCancel).toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('should disable submit button when loading', () => {
      render(<ManualRiskForm {...defaultProps} loading={true} />);

      const submitButton = screen.getByRole('button', { name: /Saving.../i });
      expect(submitButton).toBeDisabled();
    });

    it('should disable cancel button when loading', () => {
      render(<ManualRiskForm {...defaultProps} loading={true} />);

      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      expect(cancelButton).toBeDisabled();
    });
  });
});
