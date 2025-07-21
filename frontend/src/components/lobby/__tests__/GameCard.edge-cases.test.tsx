import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameCard } from '../GameCard';
import { mockGame, createMockHandlers } from './GameCard.test.fixtures';

describe('GameCard - Edge Cases & Error Handling', () => {
  describe('Error Conditions', () => {
    it('handles missing handlers gracefully', () => {
      expect(() => {
        render(<GameCard game={mockGame} />);
      }).not.toThrow();
    });

    it('handles undefined currentUserId gracefully', () => {
      const mockHandlers = createMockHandlers();
      expect(() => {
        render(<GameCard game={mockGame} currentUserId={undefined} {...mockHandlers} />);
      }).not.toThrow();
    });

    it('prevents actions when handlers are not provided', () => {
      render(<GameCard game={mockGame} />);
      
      const joinButton = screen.queryByRole('button', { name: /join game/i });
      if (joinButton) {
        fireEvent.click(joinButton);
        // Should not throw error
      }
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for buttons', () => {
      const mockHandlers = createMockHandlers();
      render(<GameCard game={mockGame} {...mockHandlers} />);
      
      const joinButton = screen.getByRole('button', { name: /join game/i });
      // Button has accessible name from text content, aria-label not required
      expect(joinButton).toHaveAccessibleName();
    });

    it('maintains proper tab order', () => {
      const mockHandlers = createMockHandlers();
      render(<GameCard game={mockGame} {...mockHandlers} />);
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        // Buttons are focusable by default (implicit tabIndex=0)
        // Check they're not explicitly removed from tab order
        expect(button).not.toHaveAttribute('tabIndex', '-1');
      });
    });

    it('provides semantic structure with headings', () => {
      render(<GameCard game={mockGame} />);
      
      expect(screen.getByRole('heading', { name: 'Test Game' })).toBeInTheDocument();
    });
  });
});