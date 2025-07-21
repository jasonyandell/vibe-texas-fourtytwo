import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SpectatorView, SpectatorInfo } from '../SpectatorView';
import { GameState } from '@texas42/shared-types';
import { createMockGameState } from './SpectatorView.test-utils';

// Mock the child components
vi.mock('@/components/DominoHand', () => ({
  DominoHand: ({ dominoes, faceDown, playable }: { dominoes: { length: number }; faceDown?: boolean; playable?: boolean }) => (
    <div data-testid="domino-hand" data-face-up={!faceDown} data-playable={playable}>
      {dominoes.length} dominoes
    </div>
  )
}));

vi.mock('@/components/GameBoard', () => ({
  GameBoard: ({ gameState, isSpectatorMode }: { gameState: { id: string }; isSpectatorMode?: boolean }) => (
    <div data-testid="game-board" data-spectator-mode={isSpectatorMode}>
      Game Board for {gameState.id}
    </div>
  )
}));

describe('SpectatorView - Game Board Display', () => {
  const mockGameState: GameState = createMockGameState({
    id: 'test-game-1',
    phase: 'playing',
    currentPlayer: 'player-1',
    players: [
      {
        id: 'player-1',
        name: 'Alice',
        position: 'north',
        hand: [
          { high: 6, low: 6, id: 'dom-66', pointValue: 10, isCountDomino: true },
          { high: 5, low: 4, id: 'dom-54', pointValue: 0, isCountDomino: false }
        ],
        isConnected: true,
        isReady: true
      },
      {
        id: 'player-2',
        name: 'Bob',
        position: 'east',
        hand: [
          { high: 3, low: 2, id: 'dom-32', pointValue: 5, isCountDomino: true },
          { high: 1, low: 0, id: 'dom-10', pointValue: 0, isCountDomino: false }
        ],
        isConnected: true,
        isReady: true
      }
    ]
  });

  const mockSpectators: SpectatorInfo[] = [
    {
      id: 'spectator-1',
      name: 'Spectator One',
      joinedAt: '2024-01-01T12:00:00Z'
    }
  ];

  it('shows game board when game is playing', () => {
    render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
    
    const gameBoards = screen.getAllByTestId('game-board');
    expect(gameBoards).toHaveLength(2); // One wrapper div and one GameBoard component
    
    // There may be multiple instances of this text
    const gameBoardTexts = screen.getAllByText('Game Board for test-game-1');
    expect(gameBoardTexts.length).toBeGreaterThanOrEqual(1);
  });

  it('passes spectator mode to game board', () => {
    render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
    
    const gameBoards = screen.getAllByTestId('game-board');
    // Check the wrapper div has the spectator mode attribute
    expect(gameBoards[0]).toHaveAttribute('data-spectator-mode', 'true');
  });

  it('does not show game board for non-playing phases', () => {
    const waitingGameState = createMockGameState({ ...mockGameState, phase: 'bidding' });
    render(<SpectatorView gameState={waitingGameState} spectators={mockSpectators} />);
    
    expect(screen.queryByTestId('game-board')).not.toBeInTheDocument();
  });
});