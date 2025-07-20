import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SpectatorView, SpectatorInfo } from '../SpectatorView';
import { GameState } from '@texas42/shared-types';

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
const createMockGameState = (overrides: Partial<GameState> = {}): GameState => ({
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

describe('SpectatorView - Basic Rendering', () => {
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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders spectator view with game information', () => {
    render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
    
    expect(screen.getByText('Spectating: test-game-1')).toBeInTheDocument();
    expect(screen.getByText('Phase: playing')).toBeInTheDocument();
    expect(screen.getByText('Current: Alice')).toBeInTheDocument();
  });

  it('renders all player hands', () => {
    render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
    
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Carol')).toBeInTheDocument();
    expect(screen.getByText('Dave')).toBeInTheDocument();
  });

  it('shows player connection status', () => {
    render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
    
    // Three players are connected (Alice, Bob, Dave) and one disconnected (Carol)
    const connectedBadges = screen.getAllByText('Connected');
    expect(connectedBadges).toHaveLength(3);
    expect(screen.getByText('Disconnected')).toBeInTheDocument();
  });

  it('displays hand counts for each player', () => {
    render(<SpectatorView gameState={mockGameState} spectators={mockSpectators} />);
    
    // Each player shows their domino count - getAllByText will find all instances
    const twoDominoes = screen.getAllByText('2 dominoes');
    expect(twoDominoes.length).toBeGreaterThanOrEqual(2); // At least Alice and Bob
    
    const oneDomino = screen.getAllByText('1 domino');
    expect(oneDomino.length).toBeGreaterThanOrEqual(1); // At least Carol
    
    const threeDominoes = screen.getAllByText('3 dominoes');
    expect(threeDominoes.length).toBeGreaterThanOrEqual(1); // At least Dave
  });
});

export { createMockGameState };