import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GameStartManager } from '../GameStartManager';
import { Player, GameState } from '@/types/texas42';

describe('GameStartManager - Error Handling', () => {
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

  beforeEach(() => {
    vi.clearAllMocks();
  });

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