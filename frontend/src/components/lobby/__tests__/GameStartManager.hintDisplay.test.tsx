import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GameStartManager } from '../GameStartManager';
import { GameState } from '@/types/texas42';
import { mockPlayers, mockFullReadyPlayers, mockGameState, mockHandlers } from './fixtures/gameStartManagerMocks';

describe('GameStartManager - Start Hint Display', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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