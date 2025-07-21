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

describe('useBiddingState - initialization', () => {
  beforeEach(() => {
    mockUseGameState.mockReturnValue(createMockGameState(baseGameState));
  });
  it('initializes with correct bidding state', () => {
    const { result } = renderHook(() => useBiddingState());

    expect(result.current.biddingState.currentBidder).toBe('player1');
    expect(result.current.biddingState.bidHistory).toEqual([]);
    expect(result.current.biddingState.isComplete).toBe(false);
    expect(result.current.biddingState.minimumBid).toBe(30);
  });

  it('handles missing game state gracefully', () => {
    mockUseGameState.mockReturnValue(createMockGameState(null));

    const { result } = renderHook(() => useBiddingState());

    expect(result.current.biddingState.currentBidder).toBeUndefined();
    expect(result.current.biddingState.bidHistory).toEqual([]);
    expect(result.current.biddingState.minimumBid).toBe(30);
  });
});