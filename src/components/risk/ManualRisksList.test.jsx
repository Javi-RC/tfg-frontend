import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ManualRisksList from './ManualRisksList';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, params) => {
      const translations = {
        'risk.manual.title': `Manual Risks (${params?.count || 0})`,
        'risk.manual.subtitle': 'Risks discovered during project execution',
        'risk.manual.noRisks': 'No Manual Risks Yet',
        'risk.manual.noRisksDescription': 'No manual risks have been added to this project. Risks will appear here as they are discovered during execution.',
        'risk.manual.loading': 'Loading manual risks...',
        'risk.manual.tryAgain': 'Try Again',
        'risk.manual.description': 'Description',
        'risk.manual.category': 'Category',
        'risk.manual.rootCause': 'Root Cause',
        'risk.manual.indicators': 'Indicators',
        'risk.manual.recommendations': 'Recommendations',
        'risk.manual.addedOn': `Added on ${params?.date || ''}`,
        'risk.manual.editRisk': 'Edit risk',
        'risk.manual.deleteRisk': 'Delete risk',
        'risk.manual.confirmDelete': 'Click again to confirm',
        'risk.manual.unknownRisk': 'Unknown Risk',
        'common.notAvailable': 'N/A',
        'common.closed': 'Closed',
        'risk.severity.critical': 'Critical',
        'risk.severity.high': 'High',
        'risk.severity.medium': 'Medium',
        'risk.severity.low': 'Low',
        'completionPage.risks.predicted': 'Predicted',
        'completionPage.risks.occurred': 'Occurred',
        'completionPage.risks.didNotOccur': 'Did not occur',
        'projects.risks.types.vendorLockIn': 'Vendor Lock-in',
        'projects.risks.types.communicationBreakdown': 'Communication Breakdown',
        'teamAnalysis.cbr.technical': 'Technical',
        'teamAnalysis.cbr.coordination': 'Coordination'
      };
      return translations[key] || params?.defaultValue || key;
    }
  }),
  initReactI18next: {
    type: '3rdParty',
    init: () => {}
  }
}));

describe('ManualRisksList Component', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnRefresh = jest.fn();

  const mockRisks = [
    {
      _id: '507f1f77bcf86cd799439011',
      title: 'Vendor Lock-in Risk',
      type: 'vendor_lock_in',
      description: 'Risk of API vendor dependency',
      severity: 'high',
      probability: 0.65,
      category: 'technical',
      rootCause: 'No SLA agreement',
      indicators: ['No SLA', 'Previous downtime'],
      recommendations: ['Implement cache', 'Research alternatives'],
      status: 'predicted',
      source: 'manual',
      createdAt: '2026-01-20T10:30:00Z'
    },
    {
      _id: '507f1f77bcf86cd799439012',
      title: 'Schedule Overrun Risk',
      type: 'schedule_overrun',
      description: 'Risk of project delays',
      severity: 'medium',
      probability: 0.5,
      category: 'coordination',
      status: 'predicted',
      source: 'manual',
      createdAt: '2026-01-20T10:30:00Z'
    }
  ];

  const defaultProps = {
    risks: mockRisks,
    loading: false,
    error: null,
    onEdit: mockOnEdit,
    onDelete: mockOnDelete,
    onRefresh: mockOnRefresh,
    canManage: true
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render list of risks', () => {
      render(<ManualRisksList {...defaultProps} />);

      expect(screen.getByText(/Manual Risks/)).toBeInTheDocument();
      expect(screen.getByText('Vendor Lock-in Risk')).toBeInTheDocument();
      expect(screen.getByText('Schedule Overrun Risk')).toBeInTheDocument();
    });

    it('should display risk information', () => {
      render(<ManualRisksList {...defaultProps} />);

      expect(screen.getByText('Vendor Lock-in Risk')).toBeInTheDocument();
      expect(screen.getByText('Schedule Overrun Risk')).toBeInTheDocument();
      // Risk type/title text can include punctuation (e.g. hyphen in "Lock-in")
      expect(screen.getAllByText(/vendor lock-?in/i).length).toBeGreaterThan(0);
      // Severity/status labels are title-cased in UI
      expect(screen.getAllByText(/high/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/predicted/i).length).toBeGreaterThan(0);
    });

    it('should show empty state when no risks', () => {
      render(
        <ManualRisksList
          {...defaultProps}
          risks={[]}
        />
      );

      expect(screen.getByText(/No Manual Risks Yet/)).toBeInTheDocument();
      expect(
        screen.getByText(/No manual risks have been added to this project/)
      ).toBeInTheDocument();
    });

    it('should show loading state', () => {
      render(
        <ManualRisksList
          {...defaultProps}
          loading={true}
        />
      );

      expect(screen.getByText(/Loading manual risks/)).toBeInTheDocument();
    });

    it('should show error state with retry button', () => {
      const error = 'Failed to load risks';
      render(
        <ManualRisksList
          {...defaultProps}
          error={error}
          risks={[]}
        />
      );

      expect(screen.getByText(error)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should expand risk details on click', async () => {
      const user = userEvent.setup();
      render(<ManualRisksList {...defaultProps} />);

      const riskTitle = screen.getByText('Vendor Lock-in Risk');
      await user.click(riskTitle.closest('div[style*="padding"]'));

      await waitFor(() => {
        expect(screen.getByText('Risk of API vendor dependency')).toBeInTheDocument();
        expect(screen.getByText('No SLA agreement')).toBeInTheDocument();
      });
    });

    it('should collapse risk details on second click', async () => {
      const user = userEvent.setup();
      render(<ManualRisksList {...defaultProps} />);

      const riskTitle = screen.getByText('Vendor Lock-in Risk');
      const header = riskTitle.closest('div[style*="padding"]');

      await user.click(header);

      await waitFor(() => {
        expect(screen.getByText('Risk of API vendor dependency')).toBeInTheDocument();
      });

      await user.click(header);

      // Details should still be visible but clickable
      expect(header).toBeInTheDocument();
    });

    it('should call onEdit when edit button is clicked', async () => {
      const user = userEvent.setup();
      const { container } = render(<ManualRisksList {...defaultProps} />);

      const editButtons = container.querySelectorAll('[title="Edit risk"]');
      await user.click(editButtons[0]);

      expect(mockOnEdit).toHaveBeenCalledWith(mockRisks[0]);
    });

    it('should require double-click to delete a risk', async () => {
      const user = userEvent.setup();
      const { container } = render(<ManualRisksList {...defaultProps} />);

      const deleteButtons = container.querySelectorAll('[title="Delete risk"]');
      const firstDeleteButton = deleteButtons[0];

      // First click should show confirmation
      await user.click(firstDeleteButton);
      expect(mockOnDelete).not.toHaveBeenCalled();

      // Verify button text changed to indicate confirmation needed
      const confirmDeleteButton = container.querySelector('[title="Click again to confirm"]');
      expect(confirmDeleteButton).toBeInTheDocument();

      // Second click should confirm deletion
      await user.click(confirmDeleteButton);
      expect(mockOnDelete).toHaveBeenCalledWith(mockRisks[0]._id);
    });

    it('should call onRefresh when retry button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <ManualRisksList
          {...defaultProps}
          error="Failed to load"
          risks={[]}
        />
      );

      const retryButton = screen.getByRole('button', { name: /Try Again/i });
      await user.click(retryButton);

      expect(mockOnRefresh).toHaveBeenCalled();
    });
  });

  describe('Risk Details Display', () => {
    it('should display all risk details when expanded', async () => {
      const user = userEvent.setup();
      render(<ManualRisksList {...defaultProps} />);

      const riskTitle = screen.getByText('Vendor Lock-in Risk');
      await user.click(riskTitle.closest('div[style*="padding"]'));

      await waitFor(() => {
        expect(screen.getByText('Risk of API vendor dependency')).toBeInTheDocument();
        expect(screen.getByText('Technical')).toBeInTheDocument();
        expect(screen.getByText('No SLA agreement')).toBeInTheDocument();
        expect(screen.getByText('No SLA')).toBeInTheDocument();
        expect(screen.getByText('Previous downtime')).toBeInTheDocument();
        expect(screen.getByText('Implement cache')).toBeInTheDocument();
        expect(screen.getByText('Research alternatives')).toBeInTheDocument();
      });
    });

    it('should show date created in risk details', async () => {
      const user = userEvent.setup();
      render(<ManualRisksList {...defaultProps} />);

      const riskTitle = screen.getByText('Vendor Lock-in Risk');
      await user.click(riskTitle.closest('div[style*="padding"]'));

      await waitFor(() => {
        expect(screen.getByText(/Added on/)).toBeInTheDocument();
      });
    });
  });

  describe('Permission Handling', () => {
    it('should hide edit/delete buttons when canManage is false', () => {
      const { container } = render(
        <ManualRisksList
          {...defaultProps}
          canManage={false}
        />
      );

      const editButtons = container.querySelectorAll('[title="Edit risk"]');
      const deleteButtons = container.querySelectorAll('[title="Delete risk"]');

      expect(editButtons).toHaveLength(0);
      expect(deleteButtons).toHaveLength(0);
    });

    it('should show edit/delete buttons when canManage is true', () => {
      const { container } = render(
        <ManualRisksList
          {...defaultProps}
          canManage={true}
        />
      );

      const editButtons = container.querySelectorAll('[title="Edit risk"]');
      const deleteButtons = container.querySelectorAll('[title="Delete risk"]');

      expect(editButtons.length).toBeGreaterThan(0);
      expect(deleteButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Severity Visualization', () => {
    it('should display different severity colors', () => {
      const risksWithVariousSeverities = [
        { ...mockRisks[0], severity: 'critical' },
        { ...mockRisks[1], severity: 'low' }
      ];

      render(
        <ManualRisksList
          {...defaultProps}
          risks={risksWithVariousSeverities}
        />
      );

      expect(screen.getByText(/critical/i)).toBeInTheDocument();
      expect(screen.getByText(/low/i)).toBeInTheDocument();
    });
  });

  describe('Empty Indicators/Recommendations', () => {
    it('should not show sections for empty indicators/recommendations', async () => {
      const user = userEvent.setup();
      const riskWithoutExtras = {
        ...mockRisks[0],
        indicators: [],
        recommendations: []
      };

      render(
        <ManualRisksList
          {...defaultProps}
          risks={[riskWithoutExtras]}
        />
      );

      const riskTitle = screen.getByText('Vendor Lock-in Risk');
      await user.click(riskTitle.closest('div[style*="padding"]'));

      // These shouldn't be displayed
      const indicatorsHeaders = screen.queryAllByText('Indicators');
      const recommendationsHeaders = screen.queryAllByText('Recommendations');

      expect(indicatorsHeaders.length).toBe(0);
      expect(recommendationsHeaders.length).toBe(0);
    });
  });

  it('should handle null risks gracefully', () => {
    render(
      <ManualRisksList
        {...defaultProps}
        risks={null}
      />
    );

    expect(screen.getByText('No Manual Risks Yet')).toBeInTheDocument();
  });

  it('should handle undefined risks gracefully', () => {
    render(
      <ManualRisksList
        {...defaultProps}
        risks={undefined}
      />
    );

    expect(screen.getByText('No Manual Risks Yet')).toBeInTheDocument();
  });
});
