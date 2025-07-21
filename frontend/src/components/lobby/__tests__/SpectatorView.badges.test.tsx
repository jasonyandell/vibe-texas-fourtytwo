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

describe('SpectatorView - Badge Variants', () => {
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
      },
      {
        id: 'player-3',
        name: 'Carol',
        position: 'south',
        hand: [{ high: 4, low: 3, id: 'dom-43', pointValue: 0, isCountDomino: false }],
        isConnected: false,
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

  it('shows correct badge variants for connection status', () => {
    render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
    
    const connectedBadges = screen.getAllByText('Connected');
    const disconnectedBadges = screen.getAllByText('Disconnected');
    
    connectedBadges.forEach(badge => {
      expect(badge.closest('.badge')).toHaveClass('success');
    });
    
    disconnectedBadges.forEach(badge => {
      expect(badge.closest('.badge')).toHaveClass('danger');
    });
  });

  it('shows correct badge variants for game phase', () => {
    render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
    
    const phaseBadge = screen.getByText('Phase: playing');
    expect(phaseBadge.closest('.badge')).toHaveClass('primary');
  });

  it('shows correct badge variants for current player', () => {
    render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
    
    const currentPlayerBadge = screen.getByText('Current: Alice');
    expect(currentPlayerBadge.closest('.badge')).toHaveClass('secondary');
  });
});