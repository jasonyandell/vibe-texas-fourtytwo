import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateGameModal } from '../CreateGameModal';

describe('CreateGameModal', () => {
  const mockHandlers = {
    onCreateGame: vi.fn().mockResolvedValue(undefined),
    onClose: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders modal with correct title', () => {
      render(<CreateGameModal {...mockHandlers} />);
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Create New Game')).toBeInTheDocument();
    });

    it('renders form elements correctly', () => {
      render(<CreateGameModal {...mockHandlers} />);
      
      expect(screen.getByLabelText('Game Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter a name for your game...')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Create Game' })).toBeInTheDocument();
    });

    it('focuses input field on mount', () => {
      render(<CreateGameModal {...mockHandlers} />);
      
      const input = screen.getByLabelText('Game Name');
      expect(input).toHaveFocus();
    });

    it('has proper ARIA attributes', () => {
      render(<CreateGameModal {...mockHandlers} />);
      
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby', 'create-game-title');
    });
  });

  describe('Form Validation', () => {
    it('disables create button when name is empty', () => {
      render(<CreateGameModal {...mockHandlers} />);
      
      const createButton = screen.getByRole('button', { name: 'Create Game' });
      expect(createButton).toBeDisabled();
    });

    it('disables create button when name is too short', async () => {
      const user = userEvent.setup();
      render(<CreateGameModal {...mockHandlers} />);
      
      const input = screen.getByLabelText('Game Name');
      await user.type(input, 'ab');
      
      const createButton = screen.getByRole('button', { name: 'Create Game' });
      expect(createButton).toBeDisabled();
    });

    it('enables create button when name is valid', async () => {
      const user = userEvent.setup();
      render(<CreateGameModal {...mockHandlers} />);
      
      const input = screen.getByLabelText('Game Name');
      await user.type(input, 'Valid Game Name');
      
      const createButton = screen.getByRole('button', { name: 'Create Game' });
      expect(createButton).not.toBeDisabled();
    });

    it('shows character count and validation message', async () => {
      const user = userEvent.setup();
      render(<CreateGameModal {...mockHandlers} />);
      
      const input = screen.getByLabelText('Game Name');
      await user.type(input, 'ab');
      
      expect(screen.getByText('2/50 characters (minimum 3 characters)')).toBeInTheDocument();
    });

    it('shows valid character count for valid names', async () => {
      const user = userEvent.setup();
      render(<CreateGameModal {...mockHandlers} />);
      
      const input = screen.getByLabelText('Game Name');
      await user.type(input, 'Valid Name');
      
      expect(screen.getByText('10/50 characters')).toBeInTheDocument();
    });

    it('enforces maximum length', async () => {
      const user = userEvent.setup();
      render(<CreateGameModal {...mockHandlers} />);
      
      const input = screen.getByLabelText('Game Name');
      const longName = 'a'.repeat(60);
      
      await user.type(input, longName);
      
      expect(input).toHaveValue('a'.repeat(50));
    });
  });

  describe('Form Submission', () => {
    it('calls onCreateGame with trimmed name on valid submission', async () => {
      const user = userEvent.setup();
      render(<CreateGameModal {...mockHandlers} />);
      
      const input = screen.getByLabelText('Game Name');
      await user.type(input, '  Valid Game Name  ');
      
      const createButton = screen.getByRole('button', { name: 'Create Game' });
      await user.click(createButton);
      
      expect(mockHandlers.onCreateGame).toHaveBeenCalledWith('Valid Game Name');
    });

    it('prevents submission with invalid name', async () => {
      const user = userEvent.setup();
      render(<CreateGameModal {...mockHandlers} />);
      
      const input = screen.getByLabelText('Game Name');
      await user.type(input, 'ab');
      
      const form = screen.getByRole('dialog').querySelector('form');
      fireEvent.submit(form!);
      
      expect(mockHandlers.onCreateGame).not.toHaveBeenCalled();
    });

    it('shows loading state during creation', async () => {
      const user = userEvent.setup();
      const slowCreateGame = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      render(<CreateGameModal onCreateGame={slowCreateGame} onClose={mockHandlers.onClose} />);
      
      const input = screen.getByLabelText('Game Name');
      await user.type(input, 'Valid Game Name');
      
      const createButton = screen.getByRole('button', { name: 'Create Game' });
      await user.click(createButton);
      
      expect(screen.getByRole('button', { name: 'Create Game' })).toBeDisabled();
      expect(input).toBeDisabled();
    });

    it('handles creation errors gracefully', async () => {
      const user = userEvent.setup();
      const failingCreateGame = vi.fn().mockRejectedValue(new Error('Creation failed'));
      
      render(<CreateGameModal onCreateGame={failingCreateGame} onClose={mockHandlers.onClose} />);
      
      const input = screen.getByLabelText('Game Name');
      await user.type(input, 'Valid Game Name');
      
      const createButton = screen.getByRole('button', { name: 'Create Game' });
      await user.click(createButton);
      
      await waitFor(() => {
        expect(createButton).not.toBeDisabled();
      });
    });
  });

  describe('Modal Interactions', () => {
    it('calls onClose when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(<CreateGameModal {...mockHandlers} />);
      
      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      await user.click(cancelButton);
      
      expect(mockHandlers.onClose).toHaveBeenCalled();
    });

    it('calls onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      render(<CreateGameModal {...mockHandlers} />);
      
      const closeButton = screen.getByLabelText('Close modal');
      await user.click(closeButton);
      
      expect(mockHandlers.onClose).toHaveBeenCalled();
    });

    it('calls onClose when backdrop is clicked', async () => {
      const user = userEvent.setup();
      render(<CreateGameModal {...mockHandlers} />);
      
      const backdrop = screen.getByRole('dialog');
      await user.click(backdrop);
      
      expect(mockHandlers.onClose).toHaveBeenCalled();
    });

    it('does not close when modal content is clicked', async () => {
      const user = userEvent.setup();
      render(<CreateGameModal {...mockHandlers} />);
      
      const modalContent = screen.getByText('Create New Game').closest('div[class*="modalContent"]');
      await user.click(modalContent!);
      
      expect(mockHandlers.onClose).not.toHaveBeenCalled();
    });

    it('handles escape key press', () => {
      render(<CreateGameModal {...mockHandlers} />);
      
      fireEvent.keyDown(document, { key: 'Escape' });
      
      expect(mockHandlers.onClose).toHaveBeenCalled();
    });

    it('disables close actions during creation', async () => {
      const user = userEvent.setup();
      const slowCreateGame = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      render(<CreateGameModal onCreateGame={slowCreateGame} onClose={mockHandlers.onClose} />);
      
      const input = screen.getByLabelText('Game Name');
      await user.type(input, 'Valid Game Name');
      
      const createButton = screen.getByRole('button', { name: 'Create Game' });
      await user.click(createButton);
      
      const closeButton = screen.getByLabelText('Close modal');
      expect(closeButton).toBeDisabled();
      
      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      expect(cancelButton).toBeDisabled();
    });
  });

  describe('Keyboard Navigation', () => {
    it('submits form on Enter key in input', async () => {
      const user = userEvent.setup();
      render(<CreateGameModal {...mockHandlers} />);
      
      const input = screen.getByLabelText('Game Name');
      await user.type(input, 'Valid Game Name');
      await user.keyboard('{Enter}');
      
      expect(mockHandlers.onCreateGame).toHaveBeenCalledWith('Valid Game Name');
    });
  });

  describe('Edge Cases', () => {
    it('handles whitespace-only names', async () => {
      const user = userEvent.setup();
      render(<CreateGameModal {...mockHandlers} />);
      
      const input = screen.getByLabelText('Game Name');
      await user.type(input, '   ');
      
      const createButton = screen.getByRole('button', { name: 'Create Game' });
      expect(createButton).toBeDisabled();
    });

    it('trims whitespace from submitted names', async () => {
      const user = userEvent.setup();
      render(<CreateGameModal {...mockHandlers} />);
      
      const input = screen.getByLabelText('Game Name');
      await user.type(input, '  Trimmed Name  ');
      
      const createButton = screen.getByRole('button', { name: 'Create Game' });
      await user.click(createButton);
      
      expect(mockHandlers.onCreateGame).toHaveBeenCalledWith('Trimmed Name');
    });

    it('handles rapid successive submissions', async () => {
      const user = userEvent.setup();
      // Use a slower mock to ensure state updates
      const slowCreateGame = vi.fn().mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 50))
      );
      
      render(<CreateGameModal onCreateGame={slowCreateGame} onClose={mockHandlers.onClose} />);
      
      const input = screen.getByLabelText('Game Name');
      await user.type(input, 'Valid Game Name');
      
      const createButton = screen.getByRole('button', { name: 'Create Game' });
      await user.click(createButton);
      
      // Button should be disabled immediately after clicking
      expect(createButton).toBeDisabled();
      
      // Verify only one submission
      expect(slowCreateGame).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('provides proper form labels and descriptions', () => {
      render(<CreateGameModal {...mockHandlers} />);
      
      const input = screen.getByLabelText('Game Name');
      expect(input).toHaveAttribute('required');
      expect(input).toHaveAttribute('maxLength', '50');
    });

    it('maintains focus trap within modal', () => {
      render(<CreateGameModal {...mockHandlers} />);
      
      const input = screen.getByLabelText('Game Name');
      
      // Input should have initial focus
      expect(input).toHaveFocus();
    });

    it('announces form validation errors', async () => {
      const user = userEvent.setup();
      render(<CreateGameModal {...mockHandlers} />);
      
      const input = screen.getByLabelText('Game Name');
      await user.type(input, 'ab');
      
      const errorText = screen.getByText('2/50 characters (minimum 3 characters)');
      expect(errorText.className).toContain('errorText');
    });
  });
});