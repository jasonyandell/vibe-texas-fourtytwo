import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import {
  baseGameState,
  createMockGameState
} from './useBiddingState.test.fixtures';

// Mock the useGameState hook at the top level
const mockUseGameState = vi.fn();
vi.mock('@/hooks/useGameState', () => ({
  useGameState: mockUseGameState
}));

// Import after mocking
const { useBiddingState } = await import('../useBiddingState');

describe('useBiddingState - utility functions', () => {
  beforeEach(() => {
    mockUseGameState.mockReturnValue(createMockGameState(baseGameState));
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