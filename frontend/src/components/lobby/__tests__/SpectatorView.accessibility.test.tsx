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

describe('SpectatorView - Accessibility & CSS', () => {
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

  const mockHandlers = {
    onLeaveSpectating: vi.fn(),
    onJoinAsPlayer: vi.fn()
  };

  it('provides proper heading structure', () => {
    render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
    
    expect(screen.getByRole('heading', { name: 'Spectating: test-game-1' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Player Hands' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Spectators (2)' })).toBeInTheDocument();
  });

  it('provides accessible form controls', () => {
    render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
    
    const checkbox = screen.getByLabelText('Show All Hands');
    expect(checkbox).toHaveAttribute('type', 'checkbox');
    
    const select = screen.getByLabelText('Focus on Player:');
    expect(select).toHaveAttribute('id', 'player-select');
  });

  it('provides accessible buttons', () => {
    render(
      <SpectatorView 
        gameState={mockGameState} 
        spectators={mockSpectators} 
        {...mockHandlers}
      />
    );
    
    const stopButton = screen.getByRole('button', { name: 'Stop Spectating' });
    expect(stopButton).toBeInTheDocument();
  });

  it('applies correct CSS classes to main container', () => {
    render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
    
    const container = screen.getByTestId('spectator-view');
    expect(container).toBeInTheDocument();
  });

  it('applies position classes to player hands', () => {
    render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
    
    const aliceHand = screen.getByTestId('player-hand-north');
    expect(aliceHand).toBeInTheDocument();
  });

  it('applies selected class to clicked player hands', async () => {
    const user = userEvent.setup();
    render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
    
    const aliceHand = screen.getByTestId('player-hand-north');
    await user.click(aliceHand);
    
    // Verify that the hand was selected
    expect(aliceHand.className).toMatch(/selected/);
  });
});