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

describe('useBiddingState - bid validation', () => {
  beforeEach(() => {
    mockUseGameState.mockReturnValue(createMockGameState(baseGameState));
  });
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
    mockUseGameState.mockReturnValue(createMockGameState({ ...baseGameState, currentPlayer: 'player2' }));

    const { result } = renderHook(() => useBiddingState());

    const validation = result.current.actions.validateBidInput(30, 'sixes');
    expect(validation.isValid).toBe(false);
    expect(validation.error).toBe('It is not your turn to bid');
  });
});