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

describe('useGameState - Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('validates game state before updates', () => {
    const { result } = renderHook(() => useGameState(), { wrapper })
    
    const invalidState = {
      ...mockGameState,
      players: [] // Invalid: needs 4 players
    }
    
    act(() => {
      result.current.updateGameState(invalidState)
    })
    
    expect(result.current.error).toBeTruthy()
    expect(result.current.gameState).toBeNull()
  })

  it('allows valid state updates', () => {
    const { result } = renderHook(() => useGameState(), { wrapper })
    
    act(() => {
      result.current.updateGameState(mockGameState)
    })
    
    expect(result.current.error).toBeNull()
    expect(result.current.gameState).toEqual(mockGameState)
  })
})