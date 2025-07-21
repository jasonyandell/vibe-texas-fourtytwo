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

describe('SpectatorView - Error Handling', () => {
  const mockGameState: GameState = createMockGameState({
    id: 'test-game-1',
    phase: 'playing',
    currentPlayer: 'player-1',
    players: [
      {
        id: 'player-1',
        name: 'Alice',
        position: 'north',
        hand: [{ high: 6, low: 6, id: 'dom-66', pointValue: 10, isCountDomino: true }],
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
    },
    {
      id: 'spectator-2',
      name: 'Spectator Two',
      joinedAt: '2024-01-01T12:05:00Z'
    }
  ];

  it('handles missing handlers gracefully', () => {
    expect(() => {
      render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
    }).not.toThrow();
  });

  it('handles empty players array', () => {
    const emptyGameState = createMockGameState({ ...mockGameState, players: [] });
    
    expect(() => {
      render(<SpectatorView gameState={emptyGameState} spectators={mockSpectators} />);
    }).not.toThrow();
  });

  it('handles missing current player', () => {
    const gameStateWithoutCurrentPlayer = createMockGameState({ ...mockGameState, currentPlayer: undefined });
    
    expect(() => {
      render(<SpectatorView gameState={gameStateWithoutCurrentPlayer} spectators={mockSpectators} />);
    }).not.toThrow();
  });

  it('handles invalid spectator ID', () => {
    render(
      <SpectatorView 
        gameState={mockGameState} 
        spectators={mockSpectators} 
        currentSpectatorId="invalid-id"
      />
    );
    
    expect(screen.queryByText('You')).not.toBeInTheDocument();
  });
});