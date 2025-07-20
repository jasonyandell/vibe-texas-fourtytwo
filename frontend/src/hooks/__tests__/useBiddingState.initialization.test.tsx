import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useBiddingState } from '../useBiddingState';
import {
  mockUseGameStateContext,
  createMockContext
} from './useBiddingState.test.fixtures';

describe('useBiddingState - initialization', () => {
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