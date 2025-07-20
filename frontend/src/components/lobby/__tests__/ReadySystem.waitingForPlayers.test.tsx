import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ReadySystem } from '../ReadySystem';
import { Player } from '@/types/texas42';

describe('ReadySystem - Waiting for Players', () => {
  const mockPlayers: (Player | null)[] = [
    { id: 'p1', name: 'Alice', position: 'north', hand: [], isConnected: true, isReady: false },
    { id: 'p2', name: 'Bob', position: 'east', hand: [], isConnected: true, isReady: false },
    { id: 'p3', name: 'Carol', position: 'south', hand: [], isConnected: true, isReady: false },
    { id: 'p4', name: 'Dave', position: 'west', hand: [], isConnected: true, isReady: false }
  ];

  const mockHandlers = {
    onMarkReady: vi.fn(),
    onUnmarkReady: vi.fn(),
    onStartGame: vi.fn()
  };

  it('shows waiting message when less than 4 players', () => {
    const partialPlayers = mockPlayers.slice(0, 2);
    render(<ReadySystem players={partialPlayers} gameId="test-game" />);
    
    expect(screen.getByText('Waiting for 2 more players')).toBeInTheDocument();
  });

  it('shows correct singular message for 1 missing player', () => {
    const partialPlayers = mockPlayers.slice(0, 3);
    render(<ReadySystem players={partialPlayers} gameId="test-game" />);
    
    expect(screen.getByText('Waiting for 1 more player')).toBeInTheDocument();
  });

  it('hides ready controls when waiting for players', () => {
    const partialPlayers = mockPlayers.slice(0, 2);
    render(<ReadySystem players={partialPlayers} gameId="test-game" {...mockHandlers} />);
    
    expect(screen.queryByText('Ready Status')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /ready/i })).not.toBeInTheDocument();
  });

  it('handles null players in array', () => {
    const playersWithNulls = [mockPlayers[0], null, mockPlayers[2], null];
    
    render(<ReadySystem players={playersWithNulls} gameId="test-game" />);
    
    // Should show waiting message since we only have 2 players
    expect(screen.getByText('Waiting for 2 more players')).toBeInTheDocument();
  });
});