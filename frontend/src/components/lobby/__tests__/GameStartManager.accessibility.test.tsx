import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameStartManager } from '../GameStartManager';
import { Player } from '@/types/texas42';

describe('GameStartManager - Accessibility', () => {
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

  const mockHandlers = {
    onStartGame: vi.fn(),
    onGameStarted: vi.fn(),
    onError: vi.fn()
  };

  it('provides proper heading structure', () => {
    render(<GameStartManager gameId="test-game" players={mockPlayers} />);
    
    const heading = screen.getByRole('heading', { name: 'Game Status' });
    expect(heading).toBeInTheDocument();
  });

  it('provides accessible button with proper attributes', () => {
    render(<GameStartManager gameId="test-game" players={mockFullReadyPlayers} {...mockHandlers} />);
    
    const startButton = screen.getByRole('button', { name: 'Start Game' });
    expect(startButton).toBeInTheDocument();
    expect(startButton).toHaveAccessibleName('Start Game');
  });

  it('provides meaningful button text for different states', () => {
    const { rerender } = render(<GameStartManager gameId="test-game" players={mockPlayers} />);
    expect(screen.getByRole('button', { name: 'Need 1 More Players' })).toBeInTheDocument();
    
    rerender(<GameStartManager gameId="test-game" players={mockFullReadyPlayers} />);
    expect(screen.getByRole('button', { name: 'Start Game' })).toBeInTheDocument();
  });
});