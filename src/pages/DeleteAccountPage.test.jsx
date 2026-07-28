import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import DeleteAccountPage from './DeleteAccountPage';
import { AuthContext } from '../contexts/AuthContextObj';
import { getDeletionPrerequisites, deleteAccount } from '../api/account';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
}));

jest.mock('../api/account', () => ({
  getDeletionPrerequisites: jest.fn(),
  deleteAccount: jest.fn(),
}));

const renderWithProviders = (ui, { logout = jest.fn() } = {}) =>
  render(
    <AuthContext.Provider value={{ logout }}>
      <MemoryRouter>{ui}</MemoryRouter>
    </AuthContext.Provider>
  );

describe('DeleteAccountPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows blockers when prerequisites return blockers', async () => {
    getDeletionPrerequisites.mockResolvedValue({
      data: {
        requiresPassword: true,
        blockers: [{ title: 'Pending CV submission', description: 'Finish your CV.' }],
      },
    });

    renderWithProviders(<DeleteAccountPage />);

    expect(await screen.findByText(/pending cv submission/i)).toBeInTheDocument();
    expect(screen.getByText(/finish your cv/i)).toBeInTheDocument();
  });

  it('allows opening confirmation modal when there are no blockers', async () => {
    getDeletionPrerequisites.mockResolvedValue({ data: { blockers: [], requiresPassword: true } });

    renderWithProviders(<DeleteAccountPage />);

    const openButton = await screen.findByRole('button', {
      name: /accountDeletion\.actions\.openModal/i,
    });
    fireEvent.click(openButton);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('submits deletion when form is valid', async () => {
    getDeletionPrerequisites.mockResolvedValue({ data: { blockers: [], requiresPassword: true } });
    deleteAccount.mockResolvedValue({ data: { success: true } });

    renderWithProviders(<DeleteAccountPage />);

    fireEvent.click(
      await screen.findByRole('button', { name: /accountDeletion\.actions\.openModal/i })
    );

    fireEvent.change(
      screen.getByPlaceholderText(/accountDeletion\.confirmation\.passwordPlaceholder/i),
      {
        target: { value: 'secret123' },
      }
    );
    fireEvent.change(
      screen.getByPlaceholderText(/accountDeletion\.confirmation\.confirmationPlaceholder/i),
      {
        target: { value: 'DELETE' },
      }
    );

    fireEvent.click(
      screen.getByRole('button', { name: /accountDeletion\.actions\.confirmDelete/i })
    );

    await waitFor(() => {
      expect(deleteAccount).toHaveBeenCalledWith({
        password: 'secret123',
        confirmation: 'DELETE',
      });
    });
  });

  it('does not require password for oauth users', async () => {
    getDeletionPrerequisites.mockResolvedValue({ data: { blockers: [], requiresPassword: false } });
    deleteAccount.mockResolvedValue({ data: { success: true } });

    renderWithProviders(<DeleteAccountPage />);

    fireEvent.click(
      await screen.findByRole('button', { name: /accountDeletion\.actions\.openModal/i })
    );

    expect(
      screen.queryByPlaceholderText(/accountDeletion\.confirmation\.passwordPlaceholder/i)
    ).not.toBeInTheDocument();

    fireEvent.change(
      screen.getByPlaceholderText(/accountDeletion\.confirmation\.confirmationPlaceholder/i),
      {
        target: { value: 'ELIMINAR' },
      }
    );

    fireEvent.click(
      screen.getByRole('button', { name: /accountDeletion\.actions\.confirmDelete/i })
    );

    await waitFor(() => {
      expect(deleteAccount).toHaveBeenCalledWith({
        confirmation: 'ELIMINAR',
      });
    });
  });
});
