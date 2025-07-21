import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GameStartManager } from '../GameStartManager';
import { mockFullReadyPlayers, mockGameState, mockHandlers } from './fixtures/gameStartManagerFixtures';
import { GameState } from '@/types/texas42';

describe('GameStartManager - Start Progress Display', () => {
  it('shows progress steps when starting', async () => {
    const user = userEvent.setup();
    let resolveStartGame: (value: GameState) => void = () => {};
    const startGamePromise = new Promise<GameState>(resolve => {
      resolveStartGame = resolve;
    });
    const slowStartGame = vi.fn(() => startGamePromise);
    
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
    
    // Resolve the promise and wait for state updates
    resolveStartGame(mockGameState);
    await waitFor(() => {
      expect(slowStartGame).toHaveBeenCalled();
    });
    
    // Ensure all state updates have completed
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Start Game' })).toBeInTheDocument();
    });
  });

  it('shows progress icons', async () => {
    const user = userEvent.setup();
    let resolveStartGame: (value: GameState) => void = () => {};
    const startGamePromise = new Promise<GameState>(resolve => {
      resolveStartGame = resolve;
    });
    const slowStartGame = vi.fn(() => startGamePromise);
    
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
    
    // Resolve the promise and wait for state updates
    resolveStartGame(mockGameState);
    await waitFor(() => {
      expect(slowStartGame).toHaveBeenCalled();
    });
    
    // Ensure all state updates have completed
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Start Game' })).toBeInTheDocument();
    });
  });

  it('hides progress when not starting', () => {
    render(<GameStartManager gameId="test-game" players={mockFullReadyPlayers} {...mockHandlers} />);
    
    expect(screen.queryByText('Initializing game...')).not.toBeInTheDocument();
  });
});