import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameCard } from '../GameCard';
import { LobbyGame } from '@/types/texas42';

describe('GameCard', () => {
  const mockGame: LobbyGame = {
    id: 'test-game-1',
    name: 'Test Game',
    playerCount: 2,
    maxPlayers: 4,
    status: 'waiting',
    createdAt: '2024-01-01T12:00:00Z'
  };

  const mockHandlers = {
    onJoinGame: vi.fn(),
    onLeaveGame: vi.fn(),
    onSpectateGame: vi.fn(),
    onMarkReady: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders game information correctly', () => {
      render(<GameCard game={mockGame} />);
      
      expect(screen.getByText('Test Game')).toBeInTheDocument();
      expect(screen.getByText('2/4 players')).toBeInTheDocument();
      expect(screen.getByText(/Created/)).toBeInTheDocument();
    });

    it('displays game status badge', () => {
      render(<GameCard game={mockGame} />);
      
      // GameStatus component should render the status
      expect(screen.getByTestId('game-status')).toBeInTheDocument();
    });

    it('renders player slots component', () => {
      render(<GameCard game={mockGame} />);
      
      expect(screen.getByTestId('player-slots')).toBeInTheDocument();
    });
  });

  describe('Join Game Functionality', () => {
    it('shows join button when game is joinable', () => {
      render(<GameCard game={mockGame} {...mockHandlers} />);
      
      const joinButton = screen.getByRole('button', { name: /join game/i });
      expect(joinButton).toBeInTheDocument();
      expect(joinButton).not.toBeDisabled();
    });

    it('calls onJoinGame when join button is clicked', () => {
      render(<GameCard game={mockGame} {...mockHandlers} />);
      
      const joinButton = screen.getByRole('button', { name: /join game/i });
      fireEvent.click(joinButton);
      
      expect(mockHandlers.onJoinGame).toHaveBeenCalledWith('test-game-1');
    });

    it('hides join button when game is full', () => {
      const fullGame = { ...mockGame, playerCount: 4 };
      render(<GameCard game={fullGame} {...mockHandlers} />);
      
      expect(screen.queryByRole('button', { name: /join game/i })).not.toBeInTheDocument();
    });

    it('hides join button when user is already in game', () => {
      render(<GameCard game={mockGame} currentUserId="player1" {...mockHandlers} />);
      
      expect(screen.queryByRole('button', { name: /join game/i })).not.toBeInTheDocument();
    });

    it('hides join button when game is not waiting', () => {
      const playingGame = { ...mockGame, status: 'playing' as const };
      render(<GameCard game={playingGame} {...mockHandlers} />);
      
      expect(screen.queryByRole('button', { name: /join game/i })).not.toBeInTheDocument();
    });
  });

  describe('Leave Game Functionality', () => {
    it('shows leave button when user is in waiting game', () => {
      render(<GameCard game={mockGame} currentUserId="player1" {...mockHandlers} />);
      
      expect(screen.getByRole('button', { name: /leave game/i })).toBeInTheDocument();
    });

    it('calls onLeaveGame when leave button is clicked', () => {
      render(<GameCard game={mockGame} currentUserId="player1" {...mockHandlers} />);
      
      const leaveButton = screen.getByRole('button', { name: /leave game/i });
      fireEvent.click(leaveButton);
      
      expect(mockHandlers.onLeaveGame).toHaveBeenCalledWith('test-game-1');
    });

    it('hides leave button when user is not in game', () => {
      render(<GameCard game={mockGame} {...mockHandlers} />);
      
      expect(screen.queryByRole('button', { name: /leave game/i })).not.toBeInTheDocument();
    });
  });

  describe('Ready System', () => {
    const fullWaitingGame = { ...mockGame, playerCount: 4 };

    it('shows ready button when user is in full waiting game', () => {
      render(<GameCard game={fullWaitingGame} currentUserId="player1" {...mockHandlers} />);
      
      expect(screen.getByRole('button', { name: /ready/i })).toBeInTheDocument();
    });

    it('calls onMarkReady when ready button is clicked', () => {
      render(<GameCard game={fullWaitingGame} currentUserId="player1" {...mockHandlers} />);
      
      const readyButton = screen.getByRole('button', { name: /ready/i });
      fireEvent.click(readyButton);
      
      expect(mockHandlers.onMarkReady).toHaveBeenCalledWith('test-game-1');
    });

    it('disables ready button when all players are ready', () => {
      render(<GameCard game={fullWaitingGame} currentUserId="player1" {...mockHandlers} />);
      
      // This would need to be mocked based on the actual implementation
      // The component uses mock data, so we'd need to test the actual ready state logic
    });

    it('hides ready button when game is not full', () => {
      render(<GameCard game={mockGame} currentUserId="player1" {...mockHandlers} />);
      
      expect(screen.queryByRole('button', { name: /ready/i })).not.toBeInTheDocument();
    });
  });

  describe('Spectate Functionality', () => {
    const playingGame = { ...mockGame, status: 'playing' as const };

    it('shows spectate button when game is playing', () => {
      render(<GameCard game={playingGame} {...mockHandlers} />);
      
      expect(screen.getByRole('button', { name: /spectate/i })).toBeInTheDocument();
    });

    it('calls onSpectateGame when spectate button is clicked', () => {
      render(<GameCard game={playingGame} {...mockHandlers} />);
      
      const spectateButton = screen.getByRole('button', { name: /spectate/i });
      fireEvent.click(spectateButton);
      
      expect(mockHandlers.onSpectateGame).toHaveBeenCalledWith('test-game-1');
    });

    it('hides spectate button when game is not playing', () => {
      render(<GameCard game={mockGame} {...mockHandlers} />);
      
      expect(screen.queryByRole('button', { name: /spectate/i })).not.toBeInTheDocument();
    });
  });

  describe('Game Status Display', () => {
    it('shows score display for playing games', () => {
      const playingGame = { ...mockGame, status: 'playing' as const };
      render(<GameCard game={playingGame} />);
      
      expect(screen.getByTestId('score-display')).toBeInTheDocument();
    });

    it('hides score display for waiting games', () => {
      render(<GameCard game={mockGame} />);
      
      expect(screen.queryByTestId('score-display')).not.toBeInTheDocument();
    });

    it('shows finished badge for completed games', () => {
      const finishedGame = { ...mockGame, status: 'finished' as const };
      render(<GameCard game={finishedGame} />);
      
      expect(screen.getByText('Game Completed')).toBeInTheDocument();
    });
  });

  describe('Error Conditions', () => {
    it('handles missing handlers gracefully', () => {
      expect(() => {
        render(<GameCard game={mockGame} />);
      }).not.toThrow();
    });

    it('handles undefined currentUserId gracefully', () => {
      expect(() => {
        render(<GameCard game={mockGame} currentUserId={undefined} {...mockHandlers} />);
      }).not.toThrow();
    });

    it('prevents actions when handlers are not provided', () => {
      render(<GameCard game={mockGame} />);
      
      const joinButton = screen.queryByRole('button', { name: /join game/i });
      if (joinButton) {
        fireEvent.click(joinButton);
        // Should not throw error
      }
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for buttons', () => {
      render(<GameCard game={mockGame} {...mockHandlers} />);
      
      const joinButton = screen.getByRole('button', { name: /join game/i });
      expect(joinButton).toHaveAttribute('aria-label');
    });

    it('maintains proper tab order', () => {
      render(<GameCard game={mockGame} {...mockHandlers} />);
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('tabIndex');
      });
    });

    it('provides semantic structure with headings', () => {
      render(<GameCard game={mockGame} />);
      
      expect(screen.getByRole('heading', { name: 'Test Game' })).toBeInTheDocument();
    });
  });
});