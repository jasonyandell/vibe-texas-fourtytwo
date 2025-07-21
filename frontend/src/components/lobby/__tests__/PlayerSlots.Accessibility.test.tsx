import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PlayerSlots } from '../PlayerSlots';
import { mockPlayers, mockHandlers } from './PlayerSlots.test.setup';

describe('PlayerSlots - Accessibility', () => {
  it('provides proper ARIA labels for empty slots', () => {
    render(<PlayerSlots players={mockPlayers} gameStatus="waiting" {...mockHandlers} />);
    
    const emptySlot = screen.getByLabelText('Join as South player');
    expect(emptySlot).toBeInTheDocument();
  });

  it('supports keyboard navigation for joinable slots', () => {
    render(<PlayerSlots players={mockPlayers} gameStatus="waiting" {...mockHandlers} />);
    
    const emptySlot = screen.getByText('Click to join').closest('[role="button"]');
    expect(emptySlot).toHaveAttribute('tabIndex', '0');
  });

  it('excludes non-interactive slots from tab order', () => {
    render(<PlayerSlots players={mockPlayers} gameStatus="playing" />);
    
    const occupiedSlots = screen.getAllByText(/Alice|Bob|Charlie/).filter(
      // Filter to only get the player slots, not partnership mentions
      el => el.closest('[data-position]')
    );
    
    occupiedSlots.forEach(slot => {
      const slotElement = slot.closest('[data-position]');
      expect(slotElement).not.toHaveAttribute('tabIndex');
    });
  });

  it('provides semantic structure with proper headings', () => {
    render(<PlayerSlots players={mockPlayers} gameStatus="waiting" />);
    
    expect(screen.getByRole('heading', { name: 'Players' })).toBeInTheDocument();
  });

  it('groups partnership information semantically', () => {
    render(<PlayerSlots players={mockPlayers} gameStatus="waiting" />);
    
    // Using a more reliable selector since CSS modules hash class names
    const partnerships = screen.getByText('North-South').closest('div[class*="partnerships"]');
    expect(partnerships).toBeInTheDocument();
  });
});