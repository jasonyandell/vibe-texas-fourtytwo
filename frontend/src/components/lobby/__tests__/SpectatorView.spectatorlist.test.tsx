import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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

describe('SpectatorView - Spectator List', () => {
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

  it('shows spectator list by default', () => {
    render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
    
    expect(screen.getByText('Spectators (2)')).toBeInTheDocument();
    expect(screen.getByText('Spectator One')).toBeInTheDocument();
    expect(screen.getByText('Spectator Two')).toBeInTheDocument();
  });

  it('hides spectator list when showSpectatorList is false', () => {
    render(
      <SpectatorView 
        gameState={mockGameState} 
        spectators={mockSpectators} 
        showSpectatorList={false}
      />
    );
    
    expect(screen.queryByText('Spectators (2)')).not.toBeInTheDocument();
  });

  it('shows current spectator with "You" badge', () => {
    render(
      <SpectatorView 
        gameState={mockGameState} 
        spectators={mockSpectators} 
        currentSpectatorId="spectator-1"
      />
    );
    
    expect(screen.getByText('You')).toBeInTheDocument();
  });

  it('shows join times for spectators', () => {
    render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
    
    // Should show formatted join times - there are multiple spectators so multiple join times
    const joinTimes = screen.getAllByText(/Joined/);
    expect(joinTimes.length).toBeGreaterThanOrEqual(2); // At least 2 spectators
  });

  it('shows empty message when no spectators', () => {
    render(<SpectatorView gameState={mockGameState} spectators={[]} />);
    
    expect(screen.getByText('No other spectators')).toBeInTheDocument();
  });
});