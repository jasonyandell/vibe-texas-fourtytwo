import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ReadySystem } from '../ReadySystem';
import { Player } from '@/types/texas42';

describe('ReadySystem - Badge Variants', () => {
  const mockPlayers: (Player | null)[] = [
    { id: 'p1', name: 'Alice', position: 'north', hand: [], isConnected: true, isReady: false },
    { id: 'p2', name: 'Bob', position: 'east', hand: [], isConnected: true, isReady: false },
    { id: 'p3', name: 'Carol', position: 'south', hand: [], isConnected: true, isReady: false },
    { id: 'p4', name: 'Dave', position: 'west', hand: [], isConnected: true, isReady: false }
  ];

  it('shows success badge when all ready', () => {
    const allReadyPlayers = mockPlayers.map(p => p ? { ...p, isReady: true } : null);
    render(<ReadySystem players={allReadyPlayers} gameId="test-game" />);
    
    const readyBadge = screen.getByText('4/4 Ready');
    expect(readyBadge).toBeInTheDocument();
    expect(readyBadge.closest('span')?.className).toContain('success');
  });

  it('shows warning badge when not all ready', () => {
    render(<ReadySystem players={mockPlayers} gameId="test-game" />);
    
    const readyBadge = screen.getByText('0/4 Ready');
    expect(readyBadge).toBeInTheDocument();
    expect(readyBadge.closest('span')?.className).toContain('warning');
  });

  it('shows correct badge variants for individual players', () => {
    const mixedPlayers = mockPlayers.map((p, i) => 
      p ? { ...p, isReady: i < 2 } : null
    );
    render(<ReadySystem players={mixedPlayers} gameId="test-game" />);
    
    const readyBadges = screen.getAllByText('Ready');
    const notReadyBadges = screen.getAllByText('Not Ready');
    
    expect(readyBadges).toHaveLength(2);
    expect(notReadyBadges).toHaveLength(2);
    
    readyBadges.forEach(badge => {
      expect(badge.closest('span')?.className).toContain('success');
    });
    
    notReadyBadges.forEach(badge => {
      expect(badge.closest('span')?.className).toContain('secondary');
    });
  });
});