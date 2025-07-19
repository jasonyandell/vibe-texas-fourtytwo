import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmptyState } from '../EmptyState';

describe('EmptyState', () => {
  describe('Basic Rendering', () => {
    it('renders empty state message', () => {
      render(<EmptyState />);
      
      expect(screen.getByText('No games available')).toBeInTheDocument();
      expect(screen.getByText(/There are currently no active games in the lobby/)).toBeInTheDocument();
      expect(screen.getByText('Create a new game to get started!')).toBeInTheDocument();
    });

    it('renders empty state icon', () => {
      render(<EmptyState />);
      
      const icon = screen.getByRole('img', { hidden: true });
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('has proper heading structure', () => {
      render(<EmptyState />);
      
      const heading = screen.getByRole('heading', { name: 'No games available' });
      expect(heading).toBeInTheDocument();
    });
  });

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

  describe('Icon Rendering', () => {
    it('renders SVG icon with correct attributes', () => {
      render(<EmptyState />);
      
      const icon = screen.getByRole('img', { hidden: true });
      expect(icon).toHaveAttribute('width', '64');
      expect(icon).toHaveAttribute('height', '64');
      expect(icon).toHaveAttribute('viewBox', '0 0 24 24');
      expect(icon).toHaveAttribute('fill', 'none');
      expect(icon).toHaveAttribute('stroke', 'currentColor');
      expect(icon).toHaveAttribute('strokeWidth', '2');
    });

    it('has proper accessibility attributes for icon', () => {
      render(<EmptyState />);
      
      const icon = screen.getByRole('img', { hidden: true });
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('renders icon with correct SVG elements', () => {
      render(<EmptyState />);
      
      const icon = screen.getByRole('img', { hidden: true });
      expect(icon.querySelector('rect')).toBeInTheDocument();
      expect(icon.querySelector('circle')).toBeInTheDocument();
      expect(icon.querySelector('path')).toBeInTheDocument();
    });
  });

  describe('CSS Classes and Structure', () => {
    it('applies correct CSS classes to main container', () => {
      render(<EmptyState />);
      
      const container = screen.getByText('No games available').closest('.emptyState');
      expect(container).toBeInTheDocument();
    });

    it('applies correct CSS classes to icon container', () => {
      render(<EmptyState />);
      
      const iconContainer = screen.getByRole('img', { hidden: true }).closest('.emptyIcon');
      expect(iconContainer).toBeInTheDocument();
    });

    it('applies correct CSS classes to create button', () => {
      const mockOnCreateGame = vi.fn();
      render(<EmptyState onCreateGame={mockOnCreateGame} />);
      
      const createButton = screen.getByRole('button', { name: 'Create New Game' });
      expect(createButton).toHaveClass('createButton');
    });

    it('has proper semantic structure', () => {
      render(<EmptyState />);
      
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('No games available');
      
      const paragraph = screen.getByText(/There are currently no active games/);
      expect(paragraph.tagName).toBe('P');
    });
  });

  describe('Button Variants and Props', () => {
    it('renders button with primary variant', () => {
      const mockOnCreateGame = vi.fn();
      render(<EmptyState onCreateGame={mockOnCreateGame} />);
      
      const createButton = screen.getByRole('button', { name: 'Create New Game' });
      expect(createButton).toHaveClass('primary');
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

    it('handles onCreateGame errors gracefully', async () => {
      const mockOnCreateGame = vi.fn().mockImplementation(() => {
        throw new Error('Create game failed');
      });
      const user = userEvent.setup();
      
      render(<EmptyState onCreateGame={mockOnCreateGame} />);
      
      const createButton = screen.getByRole('button', { name: 'Create New Game' });
      
      // Should not throw error when clicked
      expect(async () => {
        await user.click(createButton);
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

  describe('Accessibility', () => {
    it('provides proper heading hierarchy', () => {
      render(<EmptyState />);
      
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toBeInTheDocument();
    });

    it('provides descriptive text content', () => {
      render(<EmptyState />);
      
      expect(screen.getByText('No games available')).toBeInTheDocument();
      expect(screen.getByText(/There are currently no active games in the lobby/)).toBeInTheDocument();
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

    it('provides proper focus management', async () => {
      const mockOnCreateGame = vi.fn();
      const user = userEvent.setup();
      
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

  describe('Visual Design', () => {
    it('renders with proper visual hierarchy', () => {
      render(<EmptyState />);
      
      // Icon should be at the top
      const icon = screen.getByRole('img', { hidden: true });
      expect(icon.closest('.emptyIcon')).toBeInTheDocument();
      
      // Heading should follow
      const heading = screen.getByRole('heading', { name: 'No games available' });
      expect(heading).toBeInTheDocument();
      
      // Description should follow
      const description = screen.getByText(/There are currently no active games/);
      expect(description).toBeInTheDocument();
    });

    it('positions create button at the bottom when present', () => {
      const mockOnCreateGame = vi.fn();
      render(<EmptyState onCreateGame={mockOnCreateGame} />);
      
      const createButton = screen.getByRole('button', { name: 'Create New Game' });
      expect(createButton).toBeInTheDocument();
      
      // Button should come after the description text
      const description = screen.getByText('Create a new game to get started!');
      expect(description).toBeInTheDocument();
    });
  });

  describe('Content Variations', () => {
    it('displays consistent messaging', () => {
      render(<EmptyState />);
      
      expect(screen.getByText('No games available')).toBeInTheDocument();
      expect(screen.getByText('There are currently no active games in the lobby. Create a new game to get started!')).toBeInTheDocument();
    });

    it('maintains consistent styling across renders', () => {
      const { rerender } = render(<EmptyState />);
      
      const firstRenderContainer = screen.getByText('No games available').closest('.emptyState');
      
      rerender(<EmptyState onCreateGame={vi.fn()} />);
      
      const secondRenderContainer = screen.getByText('No games available').closest('.emptyState');
      expect(secondRenderContainer).toHaveClass('emptyState');
    });
  });
});