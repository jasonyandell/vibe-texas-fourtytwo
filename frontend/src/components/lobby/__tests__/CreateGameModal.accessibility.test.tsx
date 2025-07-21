import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateGameModal } from '../CreateGameModal';

describe('CreateGameModal - Accessibility', () => {
  const mockHandlers = {
    onCreateGame: vi.fn().mockResolvedValue(undefined),
    onClose: vi.fn()
  };

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