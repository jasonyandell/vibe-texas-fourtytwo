import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GameStartManager } from '../GameStartManager';
import { Player, GameState } from '@/types/texas42';

describe('GameStartManager - Functionality', () => {
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

  describe('Game Start Functionality', () => {
    it('calls onStartGame when start button is clicked', async () => {
      const user = userEvent.setup();
      mockHandlers.onStartGame.mockResolvedValue(mockGameState);
      
      render(<GameStartManager gameId="test-game" players={mockFullReadyPlayers} {...mockHandlers} />);
      
      const startButton = screen.getByRole('button', { name: 'Start Game' });
      await user.click(startButton);
      
      expect(mockHandlers.onStartGame).toHaveBeenCalledWith('test-game');
    });

    it('calls onGameStarted when game starts successfully', async () => {
      const user = userEvent.setup();
      mockHandlers.onStartGame.mockResolvedValue(mockGameState);
      
      render(<GameStartManager gameId="test-game" players={mockFullReadyPlayers} {...mockHandlers} />);
      
      const startButton = screen.getByRole('button', { name: 'Start Game' });
      await user.click(startButton);
      
      await waitFor(() => {
        expect(mockHandlers.onGameStarted).toHaveBeenCalledWith(mockGameState);
      });
    });

    it('does not start game when not ready', async () => {
      const user = userEvent.setup();
      render(<GameStartManager gameId="test-game" players={mockPlayers} {...mockHandlers} />);
      
      const startButton = screen.getByRole('button', { name: 'Need 1 More Players' });
      await user.click(startButton);
      
      expect(mockHandlers.onStartGame).not.toHaveBeenCalled();
    });

    it('does not start game when no handler provided', async () => {
      const user = userEvent.setup();
      render(<GameStartManager gameId="test-game" players={mockFullReadyPlayers} />);
      
      const startButton = screen.getByRole('button', { name: 'Start Game' });
      await user.click(startButton);
      
      // Should not crash
      expect(startButton).toBeInTheDocument();
    });
  });

  describe('Start Progress Display', () => {
    it('shows progress steps when starting', async () => {
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
      
      expect(screen.getByText('Initializing game...')).toBeInTheDocument();
      expect(screen.getByText('Shuffling dominoes...')).toBeInTheDocument();
      expect(screen.getByText('Dealing hands...')).toBeInTheDocument();
      expect(screen.getByText('Starting bidding...')).toBeInTheDocument();
    });

    it('shows progress icons', async () => {
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
      
      expect(screen.getByText('⚙️')).toBeInTheDocument();
      expect(screen.getByText('🎲')).toBeInTheDocument();
      expect(screen.getByText('🃏')).toBeInTheDocument();
      expect(screen.getByText('🎯')).toBeInTheDocument();
    });

    it('hides progress when not starting', () => {
      render(<GameStartManager gameId="test-game" players={mockFullReadyPlayers} {...mockHandlers} />);
      
      expect(screen.queryByText('Initializing game...')).not.toBeInTheDocument();
    });
  });
});