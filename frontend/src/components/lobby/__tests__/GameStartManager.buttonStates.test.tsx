import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GameStartManager } from '../GameStartManager';
import { GameState } from '@/types/texas42';
import { mockPlayers, mockFullReadyPlayers, mockGameState, mockHandlers } from './fixtures/gameStartManagerMocks';

describe('GameStartManager - Start Button States', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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