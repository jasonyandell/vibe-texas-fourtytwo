import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGameState } from '../useGameState'
import { createMockGameState, wrapper } from './useGameState.optimistic-setup'
import { createOptimisticScoreUpdate } from './useGameState.optimistic-factories'

describe('useGameState - Optimistic Updates', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('applies optimistic update', () => {
    const { result } = renderHook(() => useGameState(), { wrapper })
    const mockGameState = createMockGameState()
    
    act(() => {
      result.current.updateGameState(mockGameState)
    })
    
    const optimisticUpdate = createOptimisticScoreUpdate(10, 5)
    
    act(() => {
      result.current.applyOptimisticUpdate('test-update', optimisticUpdate)
    })
    
    expect(result.current.gameState?.partnerships.northSouth.currentHandScore).toBe(10)
    expect(result.current.gameState?.partnerships.eastWest.currentHandScore).toBe(5)
  })

  it('reverts optimistic update', () => {
    const { result } = renderHook(() => useGameState(), { wrapper })
    const mockGameState = createMockGameState()
    
    act(() => {
      result.current.updateGameState(mockGameState)
    })
    
    const optimisticUpdate = createOptimisticScoreUpdate(10, 5)
    
    act(() => {
      result.current.applyOptimisticUpdate('test-update', optimisticUpdate)
    })
    
    act(() => {
      result.current.revertOptimisticUpdate('test-update')
    })
    
    expect(result.current.gameState?.partnerships.northSouth.currentHandScore).toBe(0)
    expect(result.current.gameState?.partnerships.eastWest.currentHandScore).toBe(0)
  })

  it('confirms optimistic update', () => {
    const { result } = renderHook(() => useGameState(), { wrapper })
    const mockGameState = createMockGameState()
    
    act(() => {
      result.current.updateGameState(mockGameState)
    })
    
    const optimisticUpdate = createOptimisticScoreUpdate(10, 5)
    
    act(() => {
      result.current.applyOptimisticUpdate('test-update', optimisticUpdate)
    })
    
    act(() => {
      result.current.confirmOptimisticUpdate('test-update')
    })
    
    // Should still have the updated scores but no longer be optimistic
    expect(result.current.gameState?.partnerships.northSouth.currentHandScore).toBe(10)
    expect(result.current.gameState?.partnerships.eastWest.currentHandScore).toBe(5)
  })
})