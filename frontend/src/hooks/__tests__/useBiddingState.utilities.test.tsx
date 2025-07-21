import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useBiddingState } from '../useBiddingState';
import {
  mockUseGameStateContext,
  baseGameState,
  createMockContext
} from './useBiddingState.test.fixtures';

describe('useBiddingState - utility functions', () => {
  beforeEach(() => {
    mockUseGameStateContext.mockReturnValue(createMockContext(baseGameState));
  });
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