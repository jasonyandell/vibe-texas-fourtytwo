import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmptyState } from '../EmptyState';

describe('EmptyState - Create Game Button', () => {
  describe('Create Game Button', () => {
    it('shows create game button when handler is provided', () => {
      const mockOnCreateGame = vi.fn();
      render(<EmptyState onCreateGame={mockOnCreateGame} />);
      
      expect(screen.getByRole('button', { name: 'Create New Game' })).toBeInTheDocument();
    });

    it('hides create game button when handler is not provided', () => {
      render(<EmptyState />);
      
      expect(screen.queryByRole('button', { name: 'Create New Game' })).not.toBeInTheDocument();
    });

    it('calls onCreateGame when button is clicked', async () => {
      const mockOnCreateGame = vi.fn();
      const user = userEvent.setup();
      
      render(<EmptyState onCreateGame={mockOnCreateGame} />);
      
      const createButton = screen.getByRole('button', { name: 'Create New Game' });
      await user.click(createButton);
      
      expect(mockOnCreateGame).toHaveBeenCalledTimes(1);
    });

    it('handles multiple clicks correctly', async () => {
      const mockOnCreateGame = vi.fn();
      const user = userEvent.setup();
      
      render(<EmptyState onCreateGame={mockOnCreateGame} />);
      
      const createButton = screen.getByRole('button', { name: 'Create New Game' });
      await user.click(createButton);
      await user.click(createButton);
      
      expect(mockOnCreateGame).toHaveBeenCalledTimes(2);
    });

    it('supports keyboard interaction', async () => {
      const mockOnCreateGame = vi.fn();
      const user = userEvent.setup();
      
      render(<EmptyState onCreateGame={mockOnCreateGame} />);
      
      const createButton = screen.getByRole('button', { name: 'Create New Game' });
      createButton.focus();
      
      await user.keyboard('{Enter}');
      expect(mockOnCreateGame).toHaveBeenCalledTimes(1);
      
      await user.keyboard(' ');
      expect(mockOnCreateGame).toHaveBeenCalledTimes(2);
    });
  });

  describe('Button Variants and Props', () => {
    it('renders button with primary variant', () => {
      const mockOnCreateGame = vi.fn();
      render(<EmptyState onCreateGame={mockOnCreateGame} />);
      
      const createButton = screen.getByRole('button', { name: 'Create New Game' });
      expect(createButton).toHaveClass('button', 'primary');
    });

    it('handles button focus states', async () => {
      const mockOnCreateGame = vi.fn();
      const user = userEvent.setup();
      
      render(<EmptyState onCreateGame={mockOnCreateGame} />);
      
      const createButton = screen.getByRole('button', { name: 'Create New Game' });
      
      await user.tab();
      expect(createButton).toHaveFocus();
    });
  });

  describe('Error Handling', () => {
    it('handles missing onCreateGame gracefully', () => {
      expect(() => {
        render(<EmptyState />);
      }).not.toThrow();
    });

    it('handles onCreateGame errors gracefully', () => {
      const mockOnCreateGame = vi.fn().mockImplementation(() => {
        throw new Error('Create game failed');
      });
      
      render(<EmptyState onCreateGame={mockOnCreateGame} />);
      
      const createButton = screen.getByRole('button', { name: 'Create New Game' });
      
      // Should not throw error when clicked
      expect(() => {
        createButton.click();
      }).not.toThrow();
    });

    it('handles async onCreateGame errors gracefully', async () => {
      const mockOnCreateGame = vi.fn().mockRejectedValue(new Error('Async error'));
      const user = userEvent.setup();
      
      render(<EmptyState onCreateGame={mockOnCreateGame} />);
      
      const createButton = screen.getByRole('button', { name: 'Create New Game' });
      
      // Should not throw error when clicked
      await user.click(createButton);
      expect(mockOnCreateGame).toHaveBeenCalled();
    });
  });
});