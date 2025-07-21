import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmptyState } from '../EmptyState';

describe('EmptyState - Accessibility', () => {
  describe('Accessibility', () => {
    it('provides proper heading hierarchy', () => {
      render(<EmptyState />);
      
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toBeInTheDocument();
    });

    it('provides descriptive text content', () => {
      render(<EmptyState />);
      
      expect(screen.getByText('No games available')).toBeInTheDocument();
      expect(screen.getByText('There are currently no active games in the lobby.')).toBeInTheDocument();
      expect(screen.getByText('Create a new game to get started!')).toBeInTheDocument();
    });

    it('has accessible button when provided', () => {
      const mockOnCreateGame = vi.fn();
      render(<EmptyState onCreateGame={mockOnCreateGame} />);
      
      const createButton = screen.getByRole('button', { name: 'Create New Game' });
      expect(createButton).toBeInTheDocument();
      expect(createButton).toHaveAttribute('type', 'button');
    });

    it('supports keyboard navigation', async () => {
      const mockOnCreateGame = vi.fn();
      const user = userEvent.setup();
      
      render(<EmptyState onCreateGame={mockOnCreateGame} />);
      
      // Tab should focus the button
      await user.tab();
      const createButton = screen.getByRole('button', { name: 'Create New Game' });
      expect(createButton).toHaveFocus();
    });

    it('provides proper focus management', () => {
      const mockOnCreateGame = vi.fn();
      
      render(<EmptyState onCreateGame={mockOnCreateGame} />);
      
      const createButton = screen.getByRole('button', { name: 'Create New Game' });
      
      // Button should be focusable
      createButton.focus();
      expect(createButton).toHaveFocus();
      
      // Should lose focus when blurred
      createButton.blur();
      expect(createButton).not.toHaveFocus();
    });
  });
});