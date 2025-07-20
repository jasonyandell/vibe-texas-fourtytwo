import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameStartManager } from '../GameStartManager';
import { Player } from '@/types/texas42';

describe('GameStartManager - Status Badges', () => {
  const mockPlayers: (Player | null)[] = [
    {
      id: 'player-1',
      name: 'Alice',
      position: 'north',
      hand: [],
      isConnected: true,
      isReady: true
    },
    {
      id: 'player-2',
      name: 'Bob',
      position: 'east',
      hand: [],
      isConnected: true,
      isReady: false
    },
    {
      id: 'player-3',
      name: 'Carol',
      position: 'south',
      hand: [],
      isConnected: true,
      isReady: true
    },
    null // Empty slot
  ];

  const mockFullReadyPlayers: (Player | null)[] = [
    {
      id: 'player-1',
      name: 'Alice',
      position: 'north',
      hand: [],
      isConnected: true,
      isReady: true
    },
    {
      id: 'player-2',
      name: 'Bob',
      position: 'east',
      hand: [],
      isConnected: true,
      isReady: true
    },
    {
      id: 'player-3',
      name: 'Carol',
      position: 'south',
      hand: [],
      isConnected: true,
      isReady: true
    },
    {
      id: 'player-4',
      name: 'Dave',
      position: 'west',
      hand: [],
      isConnected: true,
      isReady: true
    }
  ];

  it('shows warning badge when not enough players', () => {
    render(<GameStartManager gameId="test-game" players={mockPlayers} />);
    
    const badge = screen.getByText('3/4 Players');
    expect(badge.closest('[data-testid="badge"]')).toHaveAttribute('data-variant', 'warning');
  });

  it('shows warning badge when not all players ready', () => {
    const playersWithUnready = mockFullReadyPlayers.map((p, i) => 
      p && i === 1 ? { ...p, isReady: false } : p
    );
    
    render(<GameStartManager gameId="test-game" players={playersWithUnready} />);
    
    const badge = screen.getByText('3/4 Ready');
    expect(badge.closest('[data-testid="badge"]')).toHaveAttribute('data-variant', 'warning');
  });

  it('shows success badge when all players ready', () => {
    render(<GameStartManager gameId="test-game" players={mockFullReadyPlayers} />);
    
    const badge = screen.getByText('All Players Ready!');
    expect(badge.closest('[data-testid="badge"]')).toHaveAttribute('data-variant', 'success');
  });
});