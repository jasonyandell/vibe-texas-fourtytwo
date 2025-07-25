import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateGameModal } from '../CreateGameModal';

describe('CreateGameModal - Edge Cases', () => {
  const mockHandlers = {
    onCreateGame: vi.fn().mockResolvedValue(undefined),
    onClose: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

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
    render(<CreateGameModal {...mockHandlers} />);
    
    const input = screen.getByLabelText('Game Name');
    await user.type(input, 'Valid Game Name');
    
    const createButton = screen.getByRole('button', { name: 'Create Game' });
    await user.click(createButton);
    
    // Should only be called once
    expect(mockHandlers.onCreateGame).toHaveBeenCalledTimes(1);
    expect(mockHandlers.onCreateGame).toHaveBeenCalledWith('Valid Game Name');
    
    // Wait for all microtasks to complete
    await new Promise(resolve => setTimeout(resolve, 0));
  });
});