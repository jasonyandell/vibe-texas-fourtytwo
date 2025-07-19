import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReadySystem } from '../ReadySystem';
import { Player } from '@/types/texas42';

describe('ReadySystem', () => {
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

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Waiting for Players', () => {
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
  });

  describe('Ready Status Display', () => {
    it('shows ready status header with count', () => {
      render(<ReadySystem players={mockPlayers} gameId="test-game" />);
      
      expect(screen.getByText('Ready Status')).toBeInTheDocument();
      expect(screen.getByText('0/4 Ready')).toBeInTheDocument();
    });

    it('updates ready count when players are ready', () => {
      const readyPlayers = mockPlayers.map((p, i) => 
        p ? { ...p, isReady: i < 2 } : null
      );
      render(<ReadySystem players={readyPlayers} gameId="test-game" />);
      
      expect(screen.getByText('2/4 Ready')).toBeInTheDocument();
    });

    it('displays all player ready states', () => {
      render(<ReadySystem players={mockPlayers} gameId="test-game" />);
      
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
      expect(screen.getByText('Carol')).toBeInTheDocument();
      expect(screen.getByText('Dave')).toBeInTheDocument();
      
      const notReadyBadges = screen.getAllByText('Not Ready');
      expect(notReadyBadges).toHaveLength(4);
    });

    it('highlights current user with "You" badge', () => {
      render(<ReadySystem players={mockPlayers} currentUserId="p1" gameId="test-game" />);
      
      expect(screen.getByText('You')).toBeInTheDocument();
    });
  });

  describe('Ready Toggle Functionality', () => {
    it('shows ready button for current user', () => {
      render(<ReadySystem players={mockPlayers} currentUserId="p1" gameId="test-game" {...mockHandlers} />);
      
      expect(screen.getByRole('button', { name: 'Mark yourself as ready to start the game' })).toBeInTheDocument();
    });

    it('calls onMarkReady when ready button is clicked', () => {
      render(<ReadySystem players={mockPlayers} currentUserId="p1" gameId="test-game" {...mockHandlers} />);
      
      const readyButton = screen.getByRole('button', { name: 'Mark yourself as ready to start the game' });
      fireEvent.click(readyButton);
      
      expect(mockHandlers.onMarkReady).toHaveBeenCalledWith('test-game', 'p1');
    });

    it('shows "Not Ready" button when user is ready', () => {
      const readyPlayers = mockPlayers.map(p => 
        p?.id === 'p1' ? { ...p, isReady: true } : p
      );
      render(<ReadySystem players={readyPlayers} currentUserId="p1" gameId="test-game" {...mockHandlers} />);
      
      expect(screen.getByRole('button', { name: 'Mark yourself as not ready' })).toBeInTheDocument();
    });

    it('calls onUnmarkReady when not ready button is clicked', () => {
      const readyPlayers = mockPlayers.map(p => 
        p?.id === 'p1' ? { ...p, isReady: true } : p
      );
      render(<ReadySystem players={readyPlayers} currentUserId="p1" gameId="test-game" {...mockHandlers} />);
      
      const notReadyButton = screen.getByRole('button', { name: 'Mark yourself as not ready' });
      fireEvent.click(notReadyButton);
      
      expect(mockHandlers.onUnmarkReady).toHaveBeenCalledWith('test-game', 'p1');
    });

    it('hides ready button when no current user', () => {
      render(<ReadySystem players={mockPlayers} gameId="test-game" {...mockHandlers} />);
      
      expect(screen.queryByRole('button', { name: /ready/i })).not.toBeInTheDocument();
    });
  });

  describe('Auto-Start Countdown', () => {
    const allReadyPlayers = mockPlayers.map(p => p ? { ...p, isReady: true } : null);

    it('starts countdown when all players are ready', () => {
      render(<ReadySystem players={allReadyPlayers} gameId="test-game" {...mockHandlers} />);
      
      expect(screen.getByText('Starting in 10s')).toBeInTheDocument();
    });

    it('shows start game button when all players are ready', () => {
      render(<ReadySystem players={allReadyPlayers} gameId="test-game" {...mockHandlers} />);
      
      expect(screen.getByRole('button', { name: 'Start Game Now' })).toBeInTheDocument();
    });

    it('counts down correctly', async () => {
      render(<ReadySystem players={allReadyPlayers} gameId="test-game" {...mockHandlers} />);
      
      expect(screen.getByText('Starting in 10s')).toBeInTheDocument();
      
      vi.advanceTimersByTime(1000);
      await waitFor(() => {
        expect(screen.getByText('Starting in 9s')).toBeInTheDocument();
      });
      
      vi.advanceTimersByTime(1000);
      await waitFor(() => {
        expect(screen.getByText('Starting in 8s')).toBeInTheDocument();
      });
    });

    it('calls onStartGame when countdown reaches zero', async () => {
      render(<ReadySystem players={allReadyPlayers} gameId="test-game" {...mockHandlers} />);
      
      vi.advanceTimersByTime(10000);
      
      await waitFor(() => {
        expect(mockHandlers.onStartGame).toHaveBeenCalledWith('test-game');
      });
    });

    it('allows manual start before countdown', () => {
      render(<ReadySystem players={allReadyPlayers} gameId="test-game" {...mockHandlers} />);
      
      const startButton = screen.getByRole('button', { name: 'Start Game Now' });
      fireEvent.click(startButton);
      
      expect(mockHandlers.onStartGame).toHaveBeenCalledWith('test-game');
    });

    it('shows cancel countdown button', () => {
      render(<ReadySystem players={allReadyPlayers} gameId="test-game" {...mockHandlers} />);
      
      expect(screen.getByRole('button', { name: 'Cancel Auto-Start' })).toBeInTheDocument();
    });

    it('cancels countdown when cancel button is clicked', () => {
      render(<ReadySystem players={allReadyPlayers} gameId="test-game" {...mockHandlers} />);
      
      const cancelButton = screen.getByRole('button', { name: 'Cancel Auto-Start' });
      fireEvent.click(cancelButton);
      
      expect(screen.queryByText(/Starting in/)).not.toBeInTheDocument();
    });

    it('uses custom timeout when provided', () => {
      render(
        <ReadySystem 
          players={allReadyPlayers} 
          gameId="test-game" 
          autoStartTimeout={5}
          {...mockHandlers} 
        />
      );
      
      expect(screen.getByText('Starting in 5s')).toBeInTheDocument();
    });
  });

  describe('Game Starting State', () => {
    const allReadyPlayers = mockPlayers.map(p => p ? { ...p, isReady: true } : null);

    it('disables buttons when game is starting', () => {
      render(<ReadySystem players={allReadyPlayers} gameId="test-game" {...mockHandlers} />);
      
      const startButton = screen.getByRole('button', { name: 'Start Game Now' });
      fireEvent.click(startButton);
      
      expect(screen.getByRole('button', { name: 'Starting Game...' })).toBeDisabled();
    });

    it('shows loading state on start button', () => {
      render(<ReadySystem players={allReadyPlayers} gameId="test-game" {...mockHandlers} />);
      
      const startButton = screen.getByRole('button', { name: 'Start Game Now' });
      fireEvent.click(startButton);
      
      expect(screen.getByRole('button', { name: 'Starting Game...' })).toBeInTheDocument();
    });

    it('disables ready toggle when starting', () => {
      render(<ReadySystem players={allReadyPlayers} currentUserId="p1" gameId="test-game" {...mockHandlers} />);
      
      const startButton = screen.getByRole('button', { name: 'Start Game Now' });
      fireEvent.click(startButton);
      
      const readyButton = screen.getByRole('button', { name: 'Mark yourself as not ready' });
      expect(readyButton).toBeDisabled();
    });
  });

  describe('Badge Variants', () => {
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

  describe('Error Handling', () => {
    it('handles missing handlers gracefully', () => {
      expect(() => {
        render(<ReadySystem players={mockPlayers} gameId="test-game" />);
      }).not.toThrow();
    });

    it('handles start game errors gracefully', async () => {
      const failingHandler = vi.fn().mockRejectedValue(new Error('Start failed'));
      const allReadyPlayers = mockPlayers.map(p => p ? { ...p, isReady: true } : null);
      
      render(
        <ReadySystem 
          players={allReadyPlayers} 
          gameId="test-game" 
          onStartGame={failingHandler}
        />
      );
      
      const startButton = screen.getByRole('button', { name: 'Start Game Now' });
      fireEvent.click(startButton);
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Start Game Now' })).not.toBeDisabled();
      });
    });

    it('handles null players in array', () => {
      const playersWithNulls = [mockPlayers[0], null, mockPlayers[2], null];
      
      expect(() => {
        render(<ReadySystem players={playersWithNulls} gameId="test-game" />);
      }).not.toThrow();
      
      expect(screen.getByText('Waiting for 2 more players')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('provides proper ARIA labels for buttons', () => {
      render(<ReadySystem players={mockPlayers} currentUserId="p1" gameId="test-game" {...mockHandlers} />);
      
      const readyButton = screen.getByRole('button', { name: 'Mark yourself as ready to start the game' });
      expect(readyButton).toHaveAttribute('aria-label');
    });

    it('announces ready state changes', () => {
      const readyPlayers = mockPlayers.map(p => 
        p?.id === 'p1' ? { ...p, isReady: true } : p
      );
      render(<ReadySystem players={readyPlayers} currentUserId="p1" gameId="test-game" />);
      
      const playerItem = screen.getByText('Alice').closest('div');
      expect(playerItem?.className).toContain('ready');
    });

    it('provides semantic structure with headings', () => {
      render(<ReadySystem players={mockPlayers} gameId="test-game" />);
      
      expect(screen.getByRole('heading', { name: 'Ready Status' })).toBeInTheDocument();
    });

    it('groups related controls semantically', () => {
      const allReadyPlayers = mockPlayers.map(p => p ? { ...p, isReady: true } : null);
      render(<ReadySystem players={allReadyPlayers} gameId="test-game" {...mockHandlers} />);
      
      const startSection = screen.getByText('Start Game Now').closest('div');
      expect(startSection).toBeInTheDocument();
      expect(startSection?.className).toContain('startSection');
    });
  });
});