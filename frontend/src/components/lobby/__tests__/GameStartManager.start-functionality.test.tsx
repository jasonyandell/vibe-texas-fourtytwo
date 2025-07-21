import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GameStartManager } from '../GameStartManager';
import { mockPlayers, mockFullReadyPlayers, mockGameState, mockHandlers } from './fixtures/gameStartManagerFixtures';

describe('GameStartManager - Game Start Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
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
    
    expect(mockHandlers.onGameStarted).toHaveBeenCalledWith(mockGameState);
  });

  it('does not start game when not ready', async () => {
    render(<GameStartManager gameId="test-game" players={mockPlayers} {...mockHandlers} />);
    
    const startButton = screen.getByRole('button', { name: 'Need 1 More Players' });
    
    // Button should be disabled when game is not ready
    expect(startButton).toBeDisabled();
    
    // Handler should not be called since button is disabled
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