import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameCard } from '../GameCard';
import { mockGame, createMockHandlers, gameVariants } from './GameCard.test.fixtures';

describe('GameCard - User Actions', () => {
  let mockHandlers: ReturnType<typeof createMockHandlers>;

  beforeEach(() => {
    mockHandlers = createMockHandlers();
    vi.clearAllMocks();
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
      render(<GameCard game={gameVariants.full} {...mockHandlers} />);
      
      expect(screen.queryByRole('button', { name: /join game/i })).not.toBeInTheDocument();
    });

    it('hides join button when user is already in game', () => {
      render(<GameCard game={mockGame} currentUserId="player1" {...mockHandlers} />);
      
      expect(screen.queryByRole('button', { name: /join game/i })).not.toBeInTheDocument();
    });

    it('hides join button when game is not waiting', () => {
      render(<GameCard game={gameVariants.playing} {...mockHandlers} />);
      
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
    it('shows ready button when user is in full waiting game', () => {
      render(<GameCard game={gameVariants.fullWaiting} currentUserId="player1" {...mockHandlers} />);
      
      expect(screen.getByRole('button', { name: /ready/i })).toBeInTheDocument();
    });

    it('calls onMarkReady when ready button is clicked', () => {
      render(<GameCard game={gameVariants.fullWaiting} currentUserId="player1" {...mockHandlers} />);
      
      const readyButton = screen.getByRole('button', { name: /ready/i });
      fireEvent.click(readyButton);
      
      expect(mockHandlers.onMarkReady).toHaveBeenCalledWith('test-game-1');
    });

    it('disables ready button when all players are ready', () => {
      render(<GameCard game={gameVariants.fullWaiting} currentUserId="player1" {...mockHandlers} />);
      
      // This would need to be mocked based on the actual implementation
      // The component uses mock data, so we'd need to test the actual ready state logic
    });

    it('hides ready button when game is not full', () => {
      render(<GameCard game={mockGame} currentUserId="player1" {...mockHandlers} />);
      
      expect(screen.queryByRole('button', { name: /ready/i })).not.toBeInTheDocument();
    });
  });

  describe('Spectate Functionality', () => {
    it('shows spectate button when game is playing', () => {
      render(<GameCard game={gameVariants.playing} {...mockHandlers} />);
      
      expect(screen.getByRole('button', { name: /spectate/i })).toBeInTheDocument();
    });

    it('calls onSpectateGame when spectate button is clicked', () => {
      render(<GameCard game={gameVariants.playing} {...mockHandlers} />);
      
      const spectateButton = screen.getByRole('button', { name: /spectate/i });
      fireEvent.click(spectateButton);
      
      expect(mockHandlers.onSpectateGame).toHaveBeenCalledWith('test-game-1');
    });

    it('hides spectate button when game is not playing', () => {
      render(<GameCard game={mockGame} {...mockHandlers} />);
      
      expect(screen.queryByRole('button', { name: /spectate/i })).not.toBeInTheDocument();
    });
  });
});