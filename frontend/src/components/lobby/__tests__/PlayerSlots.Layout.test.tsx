import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PlayerSlots } from '../PlayerSlots';
import { mockPlayers } from './PlayerSlots.test.setup';

describe('PlayerSlots - Position Layout', () => {
  it('applies correct position data attributes', () => {
    render(<PlayerSlots players={mockPlayers} gameStatus="waiting" />);
    
    expect(screen.getByText('North').closest('[data-position]')).toHaveAttribute('data-position', 'north');
    expect(screen.getByText('East').closest('[data-position]')).toHaveAttribute('data-position', 'east');
    expect(screen.getByText('South').closest('[data-position]')).toHaveAttribute('data-position', 'south');
    expect(screen.getByText('West').closest('[data-position]')).toHaveAttribute('data-position', 'west');
  });

  it('marks current user slot with data attribute', () => {
    render(<PlayerSlots players={mockPlayers} currentUserId="player1" gameStatus="waiting" />);
    
    const aliceSlot = screen.getAllByText('Alice')[1].closest('[data-current-user]'); // Use the slot Alice, not partnership Alice
    expect(aliceSlot).toHaveAttribute('data-current-user', 'true');
  });

  it('applies correct CSS classes for slot states', () => {
    render(<PlayerSlots players={mockPlayers} gameStatus="waiting" />);
    
    const occupiedSlot = screen.getAllByText('Alice')[1].closest('[data-position]');
    const emptySlot = screen.getByText('Empty slot').closest('[data-position]');
    
    // CSS modules generate hashed class names, so we check for the presence of classes
    expect(occupiedSlot?.className).toContain('occupiedSlot');
    expect(emptySlot?.className).toContain('emptySlot');
  });
});