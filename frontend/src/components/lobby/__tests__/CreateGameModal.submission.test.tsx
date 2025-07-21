import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateGameModal } from '../CreateGameModal';

describe('CreateGameModal - Form Submission', () => {
  const mockHandlers = {
    onCreateGame: vi.fn().mockResolvedValue(undefined),
    onClose: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  it('submits form on Enter key in input', async () => {
    const user = userEvent.setup();
    render(<CreateGameModal {...mockHandlers} />);
    
    const input = screen.getByLabelText('Game Name');
    await user.type(input, 'Valid Game Name');
    await user.keyboard('{Enter}');
    
    expect(mockHandlers.onCreateGame).toHaveBeenCalledWith('Valid Game Name');
  });
});