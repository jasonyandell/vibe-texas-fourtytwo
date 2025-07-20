import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGameState } from '../useGameState'
import { GameStateProvider } from '@/contexts/GameStateContext'
import { createEmptyGameState } from '@texas42/shared-types'
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

describe('useGameState - Basic State Management', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('provides initial empty state', () => {
    const { result } = renderHook(() => useGameState(), { wrapper })
    
    expect(result.current.gameState).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('updates game state', () => {
    const { result } = renderHook(() => useGameState(), { wrapper })
    
    act(() => {
      result.current.updateGameState(mockGameState)
    })
    
    expect(result.current.gameState).toEqual(mockGameState)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('sets loading state', () => {
    const { result } = renderHook(() => useGameState(), { wrapper })
    
    act(() => {
      result.current.setLoading(true)
    })
    
    expect(result.current.isLoading).toBe(true)
  })

  it('sets error state', () => {
    const { result } = renderHook(() => useGameState(), { wrapper })
    const error = new Error('Test error')
    
    act(() => {
      result.current.setError(error)
    })
    
    expect(result.current.error).toBe(error)
  })
})