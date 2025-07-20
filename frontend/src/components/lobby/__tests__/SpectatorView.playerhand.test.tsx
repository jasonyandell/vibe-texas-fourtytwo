import { describe, it, expect, vi, beforeEach } from 'vitest';
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

describe('SpectatorView - Player Hand Display', () => {
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
        hand: [
          { high: 2, low: 1, id: 'dom-21', pointValue: 0, isCountDomino: false },
          { high: 6, low: 5, id: 'dom-65', pointValue: 5, isCountDomino: true },
          { high: 4, low: 4, id: 'dom-44', pointValue: 0, isCountDomino: false }
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

  it('shows all hands face-up by default', () => {
    render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
    
    const dominoHands = screen.getAllByTestId('domino-hand');
    expect(dominoHands.length).toBeGreaterThan(0);
    dominoHands.forEach(hand => {
      expect(hand).toHaveAttribute('data-face-up', 'true');
      // data-playable attribute is optional - check if it exists before asserting
      if (hand.hasAttribute('data-playable')) {
        expect(hand).toHaveAttribute('data-playable', 'false');
      }
    });
  });

  it('allows toggling show all hands', async () => {
    const user = userEvent.setup();
    render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
    
    const showAllHandsCheckbox = screen.getByLabelText('Show All Hands');
    expect(showAllHandsCheckbox).toBeChecked();
    
    await user.click(showAllHandsCheckbox);
    expect(showAllHandsCheckbox).not.toBeChecked();
  });

  it('hides hands when show all hands is disabled', async () => {
    const user = userEvent.setup();
    render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
    
    const showAllHandsCheckbox = screen.getByLabelText('Show All Hands');
    await user.click(showAllHandsCheckbox);
    
    expect(screen.queryByText('Player Hands')).not.toBeInTheDocument();
  });

  it('allows selecting individual players to focus on', async () => {
    const user = userEvent.setup();
    render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
    
    const playerSelect = screen.getByLabelText('Focus on Player:');
    await user.selectOptions(playerSelect, 'player-1');
    
    expect(screen.getByText('Focused Player')).toBeInTheDocument();
  });

  it('shows focused player section when player is selected', async () => {
    const user = userEvent.setup();
    render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
    
    const playerSelect = screen.getByLabelText('Focus on Player:');
    await user.selectOptions(playerSelect, 'player-2');
    
    expect(screen.getByText('Focused Player')).toBeInTheDocument();
  });
});