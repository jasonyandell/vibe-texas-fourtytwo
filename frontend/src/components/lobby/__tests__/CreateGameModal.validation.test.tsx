import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateGameModal } from '../CreateGameModal';

describe('CreateGameModal - Form Validation', () => {
  const mockHandlers = {
    onCreateGame: vi.fn().mockResolvedValue(undefined),
    onClose: vi.fn()
  };

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