import { vi } from 'vitest';
import { Player } from '@/types/texas42';
import {
  GameState,
  createEmptyGameState,
  createCompatibleBiddingState
} from '@texas42/shared-types';

// Mock the useGameStateContext hook
vi.mock('@/hooks/useGameStateContext', () => ({
  useGameStateContext: vi.fn()
}));

// Import the mocked function
export const { useGameStateContext } = await import('@/hooks/useGameStateContext');
export const mockUseGameStateContext = vi.mocked(useGameStateContext);

// Test data
export const players: Player[] = [
  { id: 'player1', name: 'Player 1', position: 'north', hand: [], isConnected: true, isReady: true },
  { id: 'player2', name: 'Player 2', position: 'east', hand: [], isConnected: true, isReady: true },
  { id: 'player3', name: 'Player 3', position: 'south', hand: [], isConnected: true, isReady: true },
  { id: 'player4', name: 'Player 4', position: 'west', hand: [], isConnected: true, isReady: true }
];

export const baseBiddingState = createCompatibleBiddingState({
  currentBidder: 'player1',
  currentBid: undefined,
  bidHistory: [],
  biddingComplete: false,
  passCount: 0,
  minimumBid: 30
});

export const baseGameState = createEmptyGameState('test-game');
// Add test-specific data
baseGameState.phase = 'bidding';
baseGameState.players = players;
baseGameState.currentPlayer = 'player1';
baseGameState.dealer = 'player1';
baseGameState.biddingState = baseBiddingState;
baseGameState.createdAt = '2023-01-01T00:00:00Z';
baseGameState.updatedAt = '2023-01-01T00:00:00Z';

export const mockUpdateGameState = vi.fn();

export const createMockContext = (gameState: GameState | null) => ({
  gameState,
  updateGameState: mockUpdateGameState,
  isLoading: false,
  error: null,
  optimisticUpdates: new Map(),
  baseState: null,
  lastPersisted: null,
  autoSave: true,
  setLoading: vi.fn(),
  setError: vi.fn(),
  addPlayer: vi.fn(),
  removePlayer: vi.fn(),
  updatePlayerReady: vi.fn(),
  updatePlayerConnection: vi.fn(),
  startGame: vi.fn(),
  endGame: vi.fn(),
  resetGame: vi.fn(),
  applyOptimisticUpdate: vi.fn(),
  revertOptimisticUpdate: vi.fn(),
  confirmOptimisticUpdate: vi.fn(),
  clearError: vi.fn(),
  serializeToUrl: vi.fn(),
  loadFromUrl: vi.fn(),
  retryOperation: vi.fn(),
  persistState: vi.fn(),
  restoreState: vi.fn(),
  setAutoSave: vi.fn(),
  getOptimisticUpdates: vi.fn()
});