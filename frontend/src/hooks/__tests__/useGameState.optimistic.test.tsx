import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGameState } from '../useGameState'
import { GameStateProvider } from '@/contexts/GameStateContext'
import { createEmptyGameState, GameState } from '@texas42/shared-types'
import React from 'react'

// Mock the URL serialization functions
vi.mock('@/utils/urlSerialization', () => ({
  serializeGameStateToUrl: vi.fn(() => 'mocked-url-params'),
  parseGameStateFromUrl: vi.fn(() => null)
}))

const mockGameState = createEmptyGameState('test-game');
// Add test-specific data
mockGameState.phase = 'bidding';
mockGameState.players = [
  { id: 'p1', name: 'Player 1', position: 'north', hand: [], isConnected: true, isReady: true },
  { id: 'p2', name: 'Player 2', position: 'east', hand: [], isConnected: true, isReady: true },
  { id: 'p3', name: 'Player 3', position: 'south', hand: [], isConnected: true, isReady: true },
  { id: 'p4', name: 'Player 4', position: 'west', hand: [], isConnected: true, isReady: true }
];
mockGameState.dealer = 'p1';
mockGameState.createdAt = '2024-01-01T00:00:00Z';
mockGameState.updatedAt = '2024-01-01T00:00:00Z';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <GameStateProvider>{children}</GameStateProvider>
)

describe('useGameState - Optimistic Updates', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('applies optimistic update', () => {
    const { result } = renderHook(() => useGameState(), { wrapper })
    
    act(() => {
      result.current.updateGameState(mockGameState)
    })
    
    const optimisticUpdate = (state: GameState) => ({
      ...state,
      partnerships: {
        ...state.partnerships,
        northSouth: {
          ...state.partnerships.northSouth,
          currentHandScore: 10
        },
        eastWest: {
          ...state.partnerships.eastWest,
          currentHandScore: 5
        }
      }
    })
    
    act(() => {
      result.current.applyOptimisticUpdate('test-update', optimisticUpdate)
    })
    
    expect(result.current.gameState?.partnerships.northSouth.currentHandScore).toBe(10)
    expect(result.current.gameState?.partnerships.eastWest.currentHandScore).toBe(5)
  })

  it('reverts optimistic update', () => {
    const { result } = renderHook(() => useGameState(), { wrapper })
    
    act(() => {
      result.current.updateGameState(mockGameState)
    })
    
    const optimisticUpdate = (state: GameState) => ({
      ...state,
      partnerships: {
        ...state.partnerships,
        northSouth: {
          ...state.partnerships.northSouth,
          currentHandScore: 10
        },
        eastWest: {
          ...state.partnerships.eastWest,
          currentHandScore: 5
        }
      }
    })
    
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
    
    act(() => {
      result.current.updateGameState(mockGameState)
    })
    
    const optimisticUpdate = (state: GameState) => ({
      ...state,
      partnerships: {
        ...state.partnerships,
        northSouth: {
          ...state.partnerships.northSouth,
          currentHandScore: 10
        },
        eastWest: {
          ...state.partnerships.eastWest,
          currentHandScore: 5
        }
      }
    })
    
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