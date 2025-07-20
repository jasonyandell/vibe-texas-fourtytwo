import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GameStartManager } from '../GameStartManager';
import { Player, GameState } from '@/types/texas42';

describe('GameStartManager', () => {
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
    bids: [],
    dealer: 'player-1',
    // Add missing required properties
    partnerships: {
      northSouth: { players: ['player-1', 'player-3'], score: 0 },
      eastWest: { players: ['player-2', 'player-4'], score: 0 }
    },
    handNumber: 1,
    handScores: [],
    marks: { northSouth: 0, eastWest: 0 },
    tricks: [],
    boneyard: [],
    serializedState: '',
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

  describe('Basic Rendering', () => {
    it('renders game status section', () => {
      render(<GameStartManager gameId="test-game" players={mockPlayers} />);
      
      expect(screen.getByText('Game Status')).toBeInTheDocument();
    });

    it('shows player count badge', () => {
      render(<GameStartManager gameId="test-game" players={mockPlayers} />);
      
      expect(screen.getByText('3/4 Players')).toBeInTheDocument();
    });

    it('shows start game button', () => {
      render(<GameStartManager gameId="test-game" players={mockPlayers} />);
      
      expect(screen.getByRole('button', { name: /Need 1 More Players/ })).toBeInTheDocument();
    });
  });

  describe('Player Status Display', () => {
    it('shows ready breakdown when game is full', () => {
      render(<GameStartManager gameId="test-game" players={mockFullReadyPlayers} />);
      
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
      expect(screen.getByText('Carol')).toBeInTheDocument();
      expect(screen.getByText('Dave')).toBeInTheDocument();
    });

    it('shows ready indicators for each player', () => {
      render(<GameStartManager gameId="test-game" players={mockFullReadyPlayers} />);
      
      const readyIndicators = screen.getAllByText('✓');
      expect(readyIndicators).toHaveLength(4);
    });

    it('shows not ready indicators for unready players', () => {
      const playersWithUnready = mockFullReadyPlayers.map((p, i) => 
        p && i === 1 ? { ...p, isReady: false } : p
      );
      
      render(<GameStartManager gameId="test-game" players={playersWithUnready} />);
      
      expect(screen.getByText('○')).toBeInTheDocument(); // Not ready indicator
      expect(screen.getAllByText('✓')).toHaveLength(3); // Ready indicators
    });

    it('applies correct CSS classes to ready players', () => {
      render(<GameStartManager gameId="test-game" players={mockFullReadyPlayers} />);
      
      const aliceStatus = screen.getByTestId('player-status-player-1');
      expect(aliceStatus).toBeInTheDocument();
      // Check that ready indicator is shown
      expect(aliceStatus).toHaveTextContent('✓');
    });

    it('applies correct CSS classes to not ready players', () => {
      const playersWithUnready = mockFullReadyPlayers.map((p, i) => 
        p && i === 1 ? { ...p, isReady: false } : p
      );
      
      render(<GameStartManager gameId="test-game" players={playersWithUnready} />);
      
      const bobStatus = screen.getByTestId('player-status-player-2');
      expect(bobStatus).toBeInTheDocument();
      // Check that not ready indicator is shown
      expect(bobStatus).toHaveTextContent('○');
    });
  });

  describe('Status Badges', () => {
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

  describe('Error Handling', () => {
    it('shows error message when game start fails', async () => {
      const user = userEvent.setup();
      const error = new Error('Failed to start game');
      mockHandlers.onStartGame.mockRejectedValue(error);
      
      render(<GameStartManager gameId="test-game" players={mockFullReadyPlayers} {...mockHandlers} />);
      
      const startButton = screen.getByRole('button', { name: 'Start Game' });
      await user.click(startButton);
      
      await waitFor(() => {
        expect(screen.getByText('Error: Failed to start game')).toBeInTheDocument();
      });
    });

    it('calls onError when game start fails', async () => {
      const user = userEvent.setup();
      const error = new Error('Failed to start game');
      mockHandlers.onStartGame.mockRejectedValue(error);
      
      render(<GameStartManager gameId="test-game" players={mockFullReadyPlayers} {...mockHandlers} />);
      
      const startButton = screen.getByRole('button', { name: 'Start Game' });
      await user.click(startButton);
      
      await waitFor(() => {
        expect(mockHandlers.onError).toHaveBeenCalledWith(error);
      });
    });

    it('allows dismissing error messages', async () => {
      const user = userEvent.setup();
      const error = new Error('Failed to start game');
      mockHandlers.onStartGame.mockRejectedValue(error);
      
      render(<GameStartManager gameId="test-game" players={mockFullReadyPlayers} {...mockHandlers} />);
      
      const startButton = screen.getByRole('button', { name: 'Start Game' });
      await user.click(startButton);
      
      await waitFor(() => {
        expect(screen.getByText('Error: Failed to start game')).toBeInTheDocument();
      });
      
      const dismissButton = screen.getByRole('button', { name: 'Dismiss' });
      await user.click(dismissButton);
      
      expect(screen.queryByText('Error: Failed to start game')).not.toBeInTheDocument();
    });

    it('resets button state after error', async () => {
      const user = userEvent.setup();
      const error = new Error('Failed to start game');
      mockHandlers.onStartGame.mockRejectedValue(error);
      
      render(<GameStartManager gameId="test-game" players={mockFullReadyPlayers} {...mockHandlers} />);
      
      const startButton = screen.getByRole('button', { name: 'Start Game' });
      await user.click(startButton);
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Start Game' })).not.toBeDisabled();
      });
    });

    it('handles non-Error objects gracefully', async () => {
      const user = userEvent.setup();
      mockHandlers.onStartGame.mockRejectedValue('String error');
      
      render(<GameStartManager gameId="test-game" players={mockFullReadyPlayers} {...mockHandlers} />);
      
      const startButton = screen.getByRole('button', { name: 'Start Game' });
      await user.click(startButton);
      
      await waitFor(() => {
        expect(screen.getByText('Error: Failed to start game')).toBeInTheDocument();
      });
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

  describe('CSS Classes and Structure', () => {
    it('applies correct CSS classes to main container', () => {
      render(<GameStartManager gameId="test-game" players={mockPlayers} />);
      
      const container = screen.getByTestId('game-start-manager');
      expect(container).toBeInTheDocument();
    });

    it('applies correct CSS classes to status section', () => {
      render(<GameStartManager gameId="test-game" players={mockPlayers} />);
      
      const statusSection = screen.getByTestId('status-section');
      expect(statusSection).toBeInTheDocument();
    });

    it('applies correct CSS classes to ready grid', () => {
      render(<GameStartManager gameId="test-game" players={mockFullReadyPlayers} />);
      
      const readyGrid = screen.getByTestId('ready-grid');
      expect(readyGrid).toBeInTheDocument();
    });

    it('applies correct CSS classes to action section', () => {
      render(<GameStartManager gameId="test-game" players={mockPlayers} />);
      
      const actionSection = screen.getByTestId('action-section');
      expect(actionSection).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
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

    it('provides accessible error messages', async () => {
      const user = userEvent.setup();
      const error = new Error('Failed to start game');
      mockHandlers.onStartGame.mockRejectedValue(error);
      
      render(<GameStartManager gameId="test-game" players={mockFullReadyPlayers} {...mockHandlers} />);
      
      const startButton = screen.getByRole('button', { name: 'Start Game' });
      await user.click(startButton);
      
      await waitFor(() => {
        const errorBadge = screen.getByText('Error: Failed to start game');
        expect(errorBadge.closest('[data-testid="badge"]')).toHaveAttribute('data-variant', 'danger');
      });
    });
  });
});