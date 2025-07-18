import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBiddingState } from '../useBiddingState';
import { Player } from '@/types/texas42';
import {
  GameState,
  BiddingState,
  createEmptyGameState,
  createCompatibleBiddingState
} from '@texas42/shared-types';

// Mock the useGameStateContext hook
vi.mock('@/hooks/useGameStateContext', () => ({
  useGameStateContext: vi.fn()
}));

// Import the mocked function
const { useGameStateContext } = await import('@/hooks/useGameStateContext');
const mockUseGameStateContext = vi.mocked(useGameStateContext);

describe('useBiddingState', () => {
  const players: Player[] = [
    { id: 'player1', name: 'Player 1', position: 'north', hand: [], isConnected: true, isReady: true },
    { id: 'player2', name: 'Player 2', position: 'east', hand: [], isConnected: true, isReady: true },
    { id: 'player3', name: 'Player 3', position: 'south', hand: [], isConnected: true, isReady: true },
    { id: 'player4', name: 'Player 4', position: 'west', hand: [], isConnected: true, isReady: true }
  ];

  const baseBiddingState = createCompatibleBiddingState({
    currentBidder: 'player1',
    currentBid: undefined,
    bidHistory: [],
    biddingComplete: false,
    passCount: 0,
    minimumBid: 30
  });

  const baseGameState = createEmptyGameState('test-game');
  // Add test-specific data
  baseGameState.phase = 'bidding';
  baseGameState.players = players;
  baseGameState.currentPlayer = 'player1';
  baseGameState.dealer = 'player1';
  baseGameState.biddingState = baseBiddingState;
  baseGameState.createdAt = '2023-01-01T00:00:00Z';
  baseGameState.updatedAt = '2023-01-01T00:00:00Z';

  const mockUpdateGameState = vi.fn();

  const createMockContext = (gameState: GameState | null) => ({
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

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseGameStateContext.mockReturnValue(createMockContext(baseGameState));
  });

  describe('initialization', () => {
    it('initializes with correct bidding state', () => {
      const { result } = renderHook(() => useBiddingState());

      expect(result.current.biddingState.currentBidder).toBe('player1');
      expect(result.current.biddingState.bidHistory).toEqual([]);
      expect(result.current.biddingState.isComplete).toBe(false);
      expect(result.current.biddingState.minimumBid).toBe(30);
    });

    it('handles missing game state gracefully', () => {
      mockUseGameStateContext.mockReturnValue(createMockContext(null));

      const { result } = renderHook(() => useBiddingState());

      expect(result.current.biddingState.currentBidder).toBeUndefined();
      expect(result.current.biddingState.bidHistory).toEqual([]);
      expect(result.current.biddingState.minimumBid).toBe(30);
    });
  });

  describe('bid validation', () => {
    it('validates a valid bid', () => {
      const { result } = renderHook(() => useBiddingState());

      const validation = result.current.actions.validateBidInput(30, 'sixes');
      expect(validation.isValid).toBe(true);
      expect(validation.error).toBeUndefined();
    });

    it('rejects bid below minimum', () => {
      const { result } = renderHook(() => useBiddingState());

      const validation = result.current.actions.validateBidInput(25, 'sixes');
      expect(validation.isValid).toBe(false);
      expect(validation.error).toBe('Bid must be at least 30');
    });

    it('rejects bid above maximum', () => {
      const { result } = renderHook(() => useBiddingState());

      const validation = result.current.actions.validateBidInput(45, 'sixes');
      expect(validation.isValid).toBe(false);
      expect(validation.error).toBe('Bid cannot exceed 42');
    });

    it('rejects bid when not current player', () => {
      mockUseGameStateContext.mockReturnValue(createMockContext({ ...baseGameState, currentPlayer: 'player2' }));

      const { result } = renderHook(() => useBiddingState());

      const validation = result.current.actions.validateBidInput(30, 'sixes');
      expect(validation.isValid).toBe(false);
      expect(validation.error).toBe('It is not your turn to bid');
    });
  });

  describe('placing bids', () => {
    it('successfully places a valid bid', () => {
      const { result } = renderHook(() => useBiddingState());

      act(() => {
        const response = result.current.actions.placeBid(30, 'sixes');
        expect(response.success).toBe(true);
        expect(response.error).toBeUndefined();
      });

      expect(mockUpdateGameState).toHaveBeenCalledWith(
        expect.objectContaining<Partial<GameState>>({
          biddingState: expect.any(Object) as BiddingState
        })
      );
    });

    it('rejects invalid bid', () => {
      const { result } = renderHook(() => useBiddingState());

      act(() => {
        const response = result.current.actions.placeBid(25, 'sixes');
        expect(response.success).toBe(false);
        expect(response.error).toBe('Bid must be at least 30');
      });

      expect(mockUpdateGameState).not.toHaveBeenCalled();
    });

    it('handles missing current player', () => {
      mockUseGameStateContext.mockReturnValue(createMockContext({ ...baseGameState, currentPlayer: undefined }));

      const { result } = renderHook(() => useBiddingState());

      act(() => {
        const response = result.current.actions.placeBid(30, 'sixes');
        expect(response.success).toBe(false);
        expect(response.error).toBe('No current player or game state');
      });

      expect(mockUpdateGameState).not.toHaveBeenCalled();
    });
  });

  describe('passing bids', () => {
    it('successfully passes a bid', () => {
      const { result } = renderHook(() => useBiddingState());

      act(() => {
        const response = result.current.actions.passBid();
        expect(response.success).toBe(true);
        expect(response.error).toBeUndefined();
      });

      expect(mockUpdateGameState).toHaveBeenCalledWith(
        expect.objectContaining<Partial<GameState>>({
          biddingState: expect.any(Object) as BiddingState
        })
      );
    });

    it('handles missing current player', () => {
      mockUseGameStateContext.mockReturnValue(createMockContext({ ...baseGameState, currentPlayer: undefined }));

      const { result } = renderHook(() => useBiddingState());

      act(() => {
        const response = result.current.actions.passBid();
        expect(response.success).toBe(false);
        expect(response.error).toBe('No current player or game state');
      });

      expect(mockUpdateGameState).not.toHaveBeenCalled();
    });
  });

  describe('utility functions', () => {
    it('returns correct minimum bid amount', () => {
      const { result } = renderHook(() => useBiddingState());

      expect(result.current.actions.getMinimumBidAmount()).toBe(30);
    });

    it('checks if current player can bid', () => {
      const { result } = renderHook(() => useBiddingState());

      expect(result.current.actions.canCurrentPlayerBid()).toBe(true);
    });

    it('checks if bidding is complete', () => {
      const { result } = renderHook(() => useBiddingState());

      expect(result.current.actions.isBiddingComplete()).toBe(false);
    });

    it('returns current bidder', () => {
      const { result } = renderHook(() => useBiddingState());

      expect(result.current.actions.getCurrentBidder()).toBe('player1');
    });

    it('returns highest bid', () => {
      const { result } = renderHook(() => useBiddingState());

      expect(result.current.actions.getHighestBid()).toBeNull();
    });

    it('returns bid history', () => {
      const { result } = renderHook(() => useBiddingState());

      expect(result.current.actions.getBidHistory()).toEqual([]);
    });
  });
});
