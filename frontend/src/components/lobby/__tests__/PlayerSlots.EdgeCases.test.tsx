import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PlayerSlots, Player } from '../PlayerSlots';
import { mockHandlers } from './PlayerSlots.test.setup';

describe('PlayerSlots - Edge Cases', () => {
  it('handles all empty slots', () => {
    const emptyPlayers = [null, null, null, null];
    render(<PlayerSlots players={emptyPlayers} gameStatus="waiting" {...mockHandlers} />);
    
    const emptySlots = screen.getAllByText(/Empty slot|Click to join/);
    expect(emptySlots).toHaveLength(4);
  });

  it('handles all occupied slots', () => {
    const fullPlayers: Player[] = [
      { id: 'p1', name: 'Alice', position: 'north', isReady: true },
      { id: 'p2', name: 'Bob', position: 'east', isReady: false },
      { id: 'p3', name: 'Carol', position: 'south', isReady: true },
      { id: 'p4', name: 'Dave', position: 'west', isReady: false }
    ];
    render(<PlayerSlots players={fullPlayers} gameStatus="waiting" />);
    
    expect(screen.getAllByText('Alice')).toHaveLength(2); // Name appears in slot and partnership
    expect(screen.getAllByText('Bob')).toHaveLength(2);
    expect(screen.getAllByText('Carol')).toHaveLength(2);
    expect(screen.getAllByText('Dave')).toHaveLength(2);
    expect(screen.queryByText('Empty slot')).not.toBeInTheDocument();
  });

  it('handles missing player names gracefully', () => {
    const playersWithEmptyName: (Player | null)[] = [
      { id: 'p1', name: '', position: 'north', isReady: true },
      null, null, null
    ];
    
    expect(() => {
      render(<PlayerSlots players={playersWithEmptyName} gameStatus="waiting" />);
    }).not.toThrow();
  });
});