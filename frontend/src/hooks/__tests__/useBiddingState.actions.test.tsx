import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { GameState, BiddingState } from '@texas42/shared-types';
import {
  baseGameState,
  createMockGameState,
  mockUpdateGameState
} from './useBiddingState.test.fixtures';

// Mock the useGameState hook at the top level
const mockUseGameState = vi.fn();
vi.mock('@/hooks/useGameState', () => ({
  useGameState: mockUseGameState
}));

// Import after mocking
const { useBiddingState } = await import('../useBiddingState');

describe('useBiddingState - placing bids', () => {
  beforeEach(() => {
    mockUpdateGameState.mockClear();
    mockUseGameState.mockReturnValue(createMockGameState(baseGameState));
  });
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
    mockUseGameState.mockReturnValue(createMockGameState({ ...baseGameState, currentPlayer: undefined }));

    const { result } = renderHook(() => useBiddingState());

    act(() => {
      const response = result.current.actions.placeBid(30, 'sixes');
      expect(response.success).toBe(false);
      expect(response.error).toBe('No current player or game state');
    });

    expect(mockUpdateGameState).not.toHaveBeenCalled();
  });
});

describe('useBiddingState - passing bids', () => {
  beforeEach(() => {
    mockUpdateGameState.mockClear();
    mockUseGameState.mockReturnValue(createMockGameState(baseGameState));
  });
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
    mockUseGameState.mockReturnValue(createMockGameState({ ...baseGameState, currentPlayer: undefined }));

    const { result } = renderHook(() => useBiddingState());

    act(() => {
      const response = result.current.actions.passBid();
      expect(response.success).toBe(false);
      expect(response.error).toBe('No current player or game state');
    });

    expect(mockUpdateGameState).not.toHaveBeenCalled();
  });
});