import { vi } from 'vitest';
import { GameState } from '@texas42/shared-types';
import { SpectatorInfo } from '../SpectatorView';

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

// Helper function to create valid GameState with overrides
export const createMockGameState = (overrides: Partial<GameState> = {}): GameState => ({
  id: 'test-game-1',
  phase: 'playing',
  currentPlayer: 'player-1',
  players: [],
  trump: 'doubles',
  currentTrick: undefined,
  gameScore: { northSouth: 3, eastWest: 2 },
  dealer: 'player-1',
  tricks: [],
  boneyard: [],
  partnerships: {
    northSouth: {
      players: ['player-1', 'player-3'],
      currentHandScore: 3,
      marks: 0,
      totalGameScore: 3,
      tricksWon: 0,
      isBiddingTeam: false
    },
    eastWest: {
      players: ['player-2', 'player-4'],
      currentHandScore: 2,
      marks: 0,
      totalGameScore: 2,
      tricksWon: 0,
      isBiddingTeam: false
    }
  },
  handNumber: 1,
  biddingState: {
    bidHistory: [],
    biddingComplete: true,
    passCount: 0,
    minimumBid: 30,
    forcedBidActive: false
  },
  scoringState: {
    trickPoints: 0,
    countDominoes: [],
    bonusPoints: 0,
    penaltyPoints: 0,
    roundComplete: false
  },
  handScores: [],
  marks: { northSouth: 0, eastWest: 0 },
  marksToWin: 7,
  gameComplete: false,
  createdAt: '2024-01-01T12:00:00Z',
  updatedAt: '2024-01-01T12:00:00Z',
  isValid: true,
  validationErrors: [],
  ...overrides
});

export const mockHandlers = {
  onLeaveSpectating: vi.fn(),
  onJoinAsPlayer: vi.fn()
};