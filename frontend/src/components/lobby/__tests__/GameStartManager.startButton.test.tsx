import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GameStartManager } from '../GameStartManager';
import { Player, GameState } from '@/types/texas42';

describe('GameStartManager - Start Button', () => {
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

  const mockGameState: GameState = {
    id: 'test-game',
    phase: 'playing',
    players: mockFullReadyPlayers.filter(p => p !== null),
    currentPlayer: 'player-1',
    trump: 'doubles',
    currentTrick: undefined,
    scores: { northSouth: 0, eastWest: 0 },
    gameScore: { northSouth: 0, eastWest: 0 },
    dealer: 'player-1',
    tricks: [],
    boneyard: [],
    createdAt: '2024-01-01T12:00:00Z',
    updatedAt: '2024-01-01T12:00:00Z'
  };

  const mockHandlers = {
    onStartGame: vi.fn(),
    onGameStarted: vi.fn(),
    onError: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Start Button States', () => {
    it('shows "Need X More Players" when not enough players', () => {
      render(<GameStartManager gameId="test-game" players={mockPlayers} />);
      
      expect(screen.getByRole('button', { name: 'Need 1 More Players' })).toBeInTheDocument();
    });

    it('shows "Waiting for X Players" when players not ready', () => {
      const playersWithUnready = mockFullReadyPlayers.map((p, i) => 
        p && i < 2 ? { ...p, isReady: false } : p
      );
      
      render(<GameStartManager gameId="test-game" players={playersWithUnready} />);
      
      expect(screen.getByRole('button', { name: 'Waiting for 2 Players' })).toBeInTheDocument();
    });

    it('shows "Start Game" when all players ready', () => {
      render(<GameStartManager gameId="test-game" players={mockFullReadyPlayers} {...mockHandlers} />);
      
      expect(screen.getByRole('button', { name: 'Start Game' })).toBeInTheDocument();
    });

    it('shows "Starting Game..." during game start', async () => {
      const user = userEvent.setup();
      const slowStartGame = vi.fn(() => new Promise<GameState>(resolve => setTimeout(() => resolve(mockGameState), 100)));
      
      render(
        <GameStartManager 
          gameId="test-game" 
          players={mockFullReadyPlayers} 
          onStartGame={slowStartGame}
        />
      );
      
      const startButton = screen.getByRole('button', { name: 'Start Game' });
      await user.click(startButton);
      
      expect(screen.getByRole('button', { name: 'Starting Game...' })).toBeInTheDocument();
    });

    it('disables button when not ready to start', () => {
      render(<GameStartManager gameId="test-game" players={mockPlayers} {...mockHandlers} />);
      
      const startButton = screen.getByRole('button', { name: 'Need 1 More Players' });
      expect(startButton).toBeDisabled();
    });

    it('enables button when ready to start', () => {
      render(<GameStartManager gameId="test-game" players={mockFullReadyPlayers} {...mockHandlers} />);
      
      const startButton = screen.getByRole('button', { name: 'Start Game' });
      expect(startButton).not.toBeDisabled();
    });
  });

  describe('Start Hint Display', () => {
    it('shows start hint when all players are ready', () => {
      render(<GameStartManager gameId="test-game" players={mockFullReadyPlayers} {...mockHandlers} />);
      
      expect(screen.getByText('All players are ready! Click to begin the game.')).toBeInTheDocument();
    });

    it('hides start hint when not all players are ready', () => {
      render(<GameStartManager gameId="test-game" players={mockPlayers} {...mockHandlers} />);
      
      expect(screen.queryByText('All players are ready! Click to begin the game.')).not.toBeInTheDocument();
    });

    it('hides start hint when starting', async () => {
      const user = userEvent.setup();
      const slowStartGame = vi.fn(() => new Promise<GameState>(resolve => setTimeout(() => resolve(mockGameState), 100)));
      
      render(
        <GameStartManager 
          gameId="test-game" 
          players={mockFullReadyPlayers} 
          onStartGame={slowStartGame}
        />
      );
      
      const startButton = screen.getByRole('button', { name: 'Start Game' });
      await user.click(startButton);
      
      expect(screen.queryByText('All players are ready! Click to begin the game.')).not.toBeInTheDocument();
    });
  });
});