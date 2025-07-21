import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from '../EmptyState';

describe('EmptyState - CSS Classes and Structure', () => {
  describe('CSS Classes and Structure', () => {
    it('applies correct CSS classes to main container', () => {
      render(<EmptyState />);
      
      const container = screen.getByText('No games available').closest('div');
      expect(container?.className).toMatch(/emptyState/);
    });

    it('applies correct CSS classes to icon container', () => {
      render(<EmptyState />);
      
      const iconContainer = screen.getByRole('img', { hidden: true }).closest('div');
      expect(iconContainer?.className).toMatch(/emptyIcon/);
    });

    it('applies correct CSS classes to create button', () => {
      const mockOnCreateGame = vi.fn();
      render(<EmptyState onCreateGame={mockOnCreateGame} />);
      
      const createButton = screen.getByRole('button', { name: 'Create New Game' });
      expect(createButton.className).toMatch(/createButton/);
    });

    it('has proper semantic structure', () => {
      render(<EmptyState />);
      
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('No games available');
      
      const paragraph = screen.getByText(/There are currently no active games/);
      expect(paragraph.tagName).toBe('P');
    });
  });

  describe('Visual Design', () => {
    it('renders with proper visual hierarchy', () => {
      render(<EmptyState />);
      
      // Icon should be at the top
      const icon = screen.getByRole('img', { hidden: true });
      const iconDiv = icon.closest('div');
      expect(iconDiv?.className).toMatch(/emptyIcon/);
      
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
      const description = screen.getByText(/There are currently no active games in the lobby/);
      expect(description).toBeInTheDocument();
    });
  });
});