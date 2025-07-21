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

describe('SpectatorView - View Controls', () => {
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
      },
      {
        id: 'player-2',
        name: 'Bob',
        position: 'east',
        hand: [{ high: 3, low: 2, id: 'dom-32', pointValue: 5, isCountDomino: true }],
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

  it('renders view controls section', () => {
    render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
    
    expect(screen.getByLabelText('Show All Hands')).toBeInTheDocument();
    expect(screen.getByLabelText('Focus on Player:')).toBeInTheDocument();
  });

  it('has show all hands checkbox checked by default', () => {
    render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
    
    const checkbox = screen.getByLabelText('Show All Hands');
    expect(checkbox).toBeChecked();
  });

  it('has all players option selected by default in dropdown', () => {
    render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
    
    const select = screen.getByLabelText('Focus on Player:');
    expect(select).toHaveValue('');
  });
});