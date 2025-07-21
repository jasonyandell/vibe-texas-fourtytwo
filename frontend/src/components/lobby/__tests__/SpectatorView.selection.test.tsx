import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SpectatorView, SpectatorInfo } from '../SpectatorView';
import { GameState } from '@texas42/shared-types';
import { createMockGameState } from './SpectatorView.basic.test';

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

describe('SpectatorView - Player Selection', () => {
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
      },
      {
        id: 'player-4',
        name: 'Dave',
        position: 'west',
        hand: [{ high: 2, low: 1, id: 'dom-21', pointValue: 0, isCountDomino: false }],
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

  it('allows clicking on player hands to select them', async () => {
    const user = userEvent.setup();
    render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
    
    const aliceHand = screen.getByTestId('player-hand-north');
    await user.click(aliceHand);
    
    expect(aliceHand.className).toMatch(/selected/);
  });

  it('deselects player when clicked again', async () => {
    const user = userEvent.setup();
    render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
    
    const aliceHand = screen.getByTestId('player-hand-north');
    await user.click(aliceHand);
    expect(aliceHand.className).toMatch(/selected/);
    
    await user.click(aliceHand);
    expect(aliceHand.className).not.toMatch(/selected/);
  });

  it('shows player select dropdown with all players', () => {
    render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
    
    const playerSelect = screen.getByLabelText('Focus on Player:');
    expect(playerSelect).toBeInTheDocument();
    
    expect(screen.getByText('Alice (north)')).toBeInTheDocument();
    expect(screen.getByText('Bob (east)')).toBeInTheDocument();
    expect(screen.getByText('Carol (south)')).toBeInTheDocument();
    expect(screen.getByText('Dave (west)')).toBeInTheDocument();
  });
});