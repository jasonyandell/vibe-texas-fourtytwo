import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBiddingState } from '../useBiddingState';
import { useGameState } from '@/contexts/GameStateContext';
import { GameState, Player, BiddingState } from '@/types/texas42';

// Mock the useGameState hook
vi.mock('@/contexts/GameStateContext', () => ({
  useGameState: vi.fn()
}));

const mockUseGameState = vi.mocked(useGameState);

describe('useBiddingState', () => {
  const players: Player[] = [
    { id: 'player1', name: 'Player 1', position: 'north', hand: [], isConnected: true, isReady: true },
    { id: 'player2', name: 'Player 2', position: 'east', hand: [], isConnected: true, isReady: true },
    { id: 'player3', name: 'Player 3', position: 'south', hand: [], isConnected: true, isReady: true },
    { id: 'player4', name: 'Player 4', position: 'west', hand: [], isConnected: true, isReady: true }
  ];

  const baseBiddingState: BiddingState = {
    currentBidder: 'player1',
    currentBid: undefined,
    bidHistory: [],
    biddingComplete: false,
    passCount: 0,
    minimumBid: 30
  };

  const baseGameState: GameState = {
    id: 'test-game',
    phase: 'bidding',
    players,
    currentPlayer: 'player1',
    dealer: 'player1',
    tricks: [],
    scores: { northSouth: 0, eastWest: 0 },
    gameScore: { northSouth: 0, eastWest: 0 },
    boneyard: [],
    biddingState: baseBiddingState,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  };

  const mockUpdateGameState = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseGameState.mockReturnValue({
      gameState: baseGameState,
      updateGameState: mockUpdateGameState,
      isLoading: false,
      error: null,
      dispatch: vi.fn(),
      applyOptimisticUpdate: vi.fn(),
      revertOptimisticUpdate: vi.fn(),
      confirmOptimisticUpdate: vi.fn()
    });
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
      mockUseGameState.mockReturnValue({
        gameState: null,
        updateGameState: mockUpdateGameState,
        isLoading: false,
        error: null,
        dispatch: vi.fn(),
        applyOptimisticUpdate: vi.fn(),
        revertOptimisticUpdate: vi.fn(),
        confirmOptimisticUpdate: vi.fn()
      });

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
      mockUseGameState.mockReturnValue({
        gameState: { ...baseGameState, currentPlayer: 'player2' },
        updateGameState: mockUpdateGameState,
        isLoading: false,
        error: null,
        dispatch: vi.fn(),
        applyOptimisticUpdate: vi.fn(),
        revertOptimisticUpdate: vi.fn(),
        confirmOptimisticUpdate: vi.fn()
      });

      const { result } = renderHook(() => useBiddingState());

      const validation = result.current.actions.validateBidInput(30, 'sixes');
      expect(validation.isValid).toBe(false);
      expect(validation.error).toBe('It is not your turn to bid');
    });
  });

  describe('placing bids', () => {
    it('successfully places a valid bid', async () => {
      const { result } = renderHook(() => useBiddingState());

      await act(async () => {
        const response = await result.current.actions.placeBid(30, 'sixes');
        expect(response.success).toBe(true);
        expect(response.error).toBeUndefined();
      });

      expect(mockUpdateGameState).toHaveBeenCalledWith(
        expect.objectContaining({
          biddingState: expect.objectContaining({
            bidHistory: expect.arrayContaining([
              expect.objectContaining({
                playerId: 'player1',
                amount: 30,
                trump: 'sixes'
              })
            ])
          })
        })
      );
    });

    it('rejects invalid bid', async () => {
      const { result } = renderHook(() => useBiddingState());

      await act(async () => {
        const response = await result.current.actions.placeBid(25, 'sixes');
        expect(response.success).toBe(false);
        expect(response.error).toBe('Bid must be at least 30');
      });

      expect(mockUpdateGameState).not.toHaveBeenCalled();
    });

    it('handles missing current player', async () => {
      mockUseGameState.mockReturnValue({
        gameState: { ...baseGameState, currentPlayer: undefined },
        updateGameState: mockUpdateGameState,
        isLoading: false,
        error: null,
        dispatch: vi.fn(),
        applyOptimisticUpdate: vi.fn(),
        revertOptimisticUpdate: vi.fn(),
        confirmOptimisticUpdate: vi.fn()
      });

      const { result } = renderHook(() => useBiddingState());

      await act(async () => {
        const response = await result.current.actions.placeBid(30, 'sixes');
        expect(response.success).toBe(false);
        expect(response.error).toBe('No current player or game state');
      });

      expect(mockUpdateGameState).not.toHaveBeenCalled();
    });
  });

  describe('passing bids', () => {
    it('successfully passes a bid', async () => {
      const { result } = renderHook(() => useBiddingState());

      await act(async () => {
        const response = await result.current.actions.passBid();
        expect(response.success).toBe(true);
        expect(response.error).toBeUndefined();
      });

      expect(mockUpdateGameState).toHaveBeenCalledWith(
        expect.objectContaining({
          biddingState: expect.objectContaining({
            passCount: 1
          })
        })
      );
    });

    it('handles missing current player', async () => {
      mockUseGameState.mockReturnValue({
        gameState: { ...baseGameState, currentPlayer: undefined },
        updateGameState: mockUpdateGameState,
        isLoading: false,
        error: null,
        dispatch: vi.fn(),
        applyOptimisticUpdate: vi.fn(),
        revertOptimisticUpdate: vi.fn(),
        confirmOptimisticUpdate: vi.fn()
      });

      const { result } = renderHook(() => useBiddingState());

      await act(async () => {
        const response = await result.current.actions.passBid();
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
