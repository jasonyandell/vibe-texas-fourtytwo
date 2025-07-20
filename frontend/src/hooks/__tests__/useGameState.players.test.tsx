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

describe('useGameState - Player Management', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('adds player to game', () => {
    const { result } = renderHook(() => useGameState(), { wrapper })
    
    act(() => {
      result.current.updateGameState(mockGameState)
    })
    
    const newPlayer = {
      id: 'p5',
      name: 'New Player',
      position: 'north' as const,
      hand: [],
      isConnected: true,
      isReady: false
    }
    
    act(() => {
      result.current.addPlayer(newPlayer)
    })
    
    expect(result.current.gameState?.players).toContainEqual(newPlayer)
  })

  it('removes player from game', () => {
    const { result } = renderHook(() => useGameState(), { wrapper })
    
    act(() => {
      result.current.updateGameState(mockGameState)
    })
    
    act(() => {
      result.current.removePlayer('p1')
    })
    
    expect(result.current.gameState?.players).not.toContainEqual(
      expect.objectContaining({ id: 'p1' })
    )
  })

  it('updates player ready state', () => {
    const { result } = renderHook(() => useGameState(), { wrapper })
    
    act(() => {
      result.current.updateGameState(mockGameState)
    })
    
    act(() => {
      result.current.updatePlayerReady('p1', false)
    })
    
    const player = result.current.gameState?.players.find(p => p.id === 'p1')
    expect(player?.isReady).toBe(false)
  })

  it('updates player connection state', () => {
    const { result } = renderHook(() => useGameState(), { wrapper })
    
    act(() => {
      result.current.updateGameState(mockGameState)
    })
    
    act(() => {
      result.current.updatePlayerConnection('p2', false)
    })
    
    const player = result.current.gameState?.players.find(p => p.id === 'p2')
    expect(player?.isConnected).toBe(false)
  })
})