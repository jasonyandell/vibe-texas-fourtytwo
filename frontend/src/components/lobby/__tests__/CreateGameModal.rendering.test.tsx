import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CreateGameModal } from '../CreateGameModal';

describe('CreateGameModal - Basic Rendering', () => {
  const mockHandlers = {
    onCreateGame: vi.fn().mockResolvedValue(undefined),
    onClose: vi.fn()
  };

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