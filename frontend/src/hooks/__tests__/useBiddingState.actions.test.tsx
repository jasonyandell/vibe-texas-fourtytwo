import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBiddingState } from '../useBiddingState';
import { GameState, BiddingState } from '@texas42/shared-types';
import {
  mockUseGameStateContext,
  baseGameState,
  createMockContext,
  mockUpdateGameState
} from './useBiddingState.test.fixtures';

describe('useBiddingState - placing bids', () => {
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

describe('useBiddingState - passing bids', () => {
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