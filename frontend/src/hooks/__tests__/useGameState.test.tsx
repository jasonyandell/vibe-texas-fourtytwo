import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGameState } from '../useGameState'
import { GameStateProvider } from '@/contexts/GameStateContext'
import { LegacyGameState as GameState, createEmptyLegacyGameState } from '@texas42/shared-types'
import React from 'react'

// Mock the URL serialization functions
vi.mock('@/utils/urlSerialization', () => ({
  serializeGameStateToUrl: vi.fn(() => 'mocked-url-params'),
  parseGameStateFromUrl: vi.fn(() => null)
}))

const mockGameState = createEmptyLegacyGameState('test-game');
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

describe('useGameState', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic State Management', () => {
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

  describe('Player Management', () => {
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

  describe('Game Actions', () => {
    it('starts game', () => {
      const { result } = renderHook(() => useGameState(), { wrapper })
      
      act(() => {
        result.current.updateGameState(mockGameState)
      })
      
      act(() => {
        result.current.startGame()
      })
      
      expect(result.current.gameState?.phase).toBe('playing')
    })

    it('ends game', () => {
      const { result } = renderHook(() => useGameState(), { wrapper })
      
      act(() => {
        result.current.updateGameState({ ...mockGameState, phase: 'playing' })
      })
      
      act(() => {
        result.current.endGame()
      })
      
      expect(result.current.gameState?.phase).toBe('finished')
    })

    it('resets game', () => {
      const { result } = renderHook(() => useGameState(), { wrapper })
      
      act(() => {
        result.current.updateGameState(mockGameState)
      })
      
      act(() => {
        result.current.resetGame()
      })
      
      expect(result.current.gameState).toBeNull()
      expect(result.current.error).toBeNull()
    })
  })

  describe('Optimistic Updates', () => {
    it('applies optimistic update', () => {
      const { result } = renderHook(() => useGameState(), { wrapper })
      
      act(() => {
        result.current.updateGameState(mockGameState)
      })
      
      const optimisticUpdate = (state: GameState) => ({
        ...state,
        scores: { northSouth: 10, eastWest: 5 }
      })
      
      act(() => {
        result.current.applyOptimisticUpdate('test-update', optimisticUpdate)
      })
      
      expect(result.current.gameState?.scores.northSouth).toBe(10)
      expect(result.current.gameState?.scores.eastWest).toBe(5)
    })

    it('reverts optimistic update', () => {
      const { result } = renderHook(() => useGameState(), { wrapper })
      
      act(() => {
        result.current.updateGameState(mockGameState)
      })
      
      const optimisticUpdate = (state: GameState) => ({
        ...state,
        scores: { northSouth: 10, eastWest: 5 }
      })
      
      act(() => {
        result.current.applyOptimisticUpdate('test-update', optimisticUpdate)
      })
      
      act(() => {
        result.current.revertOptimisticUpdate('test-update')
      })
      
      expect(result.current.gameState?.scores.northSouth).toBe(0)
      expect(result.current.gameState?.scores.eastWest).toBe(0)
    })

    it('confirms optimistic update', () => {
      const { result } = renderHook(() => useGameState(), { wrapper })
      
      act(() => {
        result.current.updateGameState(mockGameState)
      })
      
      const optimisticUpdate = (state: GameState) => ({
        ...state,
        scores: { northSouth: 10, eastWest: 5 }
      })
      
      act(() => {
        result.current.applyOptimisticUpdate('test-update', optimisticUpdate)
      })
      
      act(() => {
        result.current.confirmOptimisticUpdate('test-update')
      })
      
      // Should still have the updated scores but no longer be optimistic
      expect(result.current.gameState?.scores.northSouth).toBe(10)
      expect(result.current.gameState?.scores.eastWest).toBe(5)
    })
  })

  describe('URL Synchronization', () => {
    it('serializes state to URL', () => {
      const { result } = renderHook(() => useGameState(), { wrapper })
      
      act(() => {
        result.current.updateGameState(mockGameState)
      })
      
      const urlParams = result.current.serializeToUrl()
      expect(urlParams).toBe('mocked-url-params')
    })

    it('loads state from URL', () => {
      const { result } = renderHook(() => useGameState(), { wrapper })
      
      act(() => {
        result.current.loadFromUrl('gameId=test&phase=playing')
      })
      
      // Since our mock returns null, state should remain null
      expect(result.current.gameState).toBeNull()
    })
  })

  describe('Validation', () => {
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

  describe('Error Recovery', () => {
    it('recovers from errors', () => {
      const { result } = renderHook(() => useGameState(), { wrapper })
      
      act(() => {
        result.current.setError(new Error('Test error'))
      })
      
      act(() => {
        result.current.clearError()
      })
      
      expect(result.current.error).toBeNull()
    })

    it('retries failed operations', async () => {
      const { result } = renderHook(() => useGameState(), { wrapper })

      const mockOperation = vi.fn().mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce(mockGameState)

      await act(async () => {
        await result.current.retryOperation(mockOperation)
      })

      expect(mockOperation).toHaveBeenCalledTimes(2)
      expect(result.current.gameState).toEqual(mockGameState)
    })
  })
})
