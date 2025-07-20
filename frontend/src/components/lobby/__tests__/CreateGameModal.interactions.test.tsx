import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateGameModal } from '../CreateGameModal';

describe('CreateGameModal - Modal Interactions', () => {
  const mockHandlers = {
    onCreateGame: vi.fn().mockResolvedValue(undefined),
    onClose: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

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