import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLobbyState } from '../useLobbyState'
import { LobbyStateProvider } from '@/contexts/LobbyStateContext'
import { LobbyState, LobbyGame } from '@/types/texas42'
import React from 'react'

const mockLobbyState: LobbyState = {
  availableGames: [
    {
      id: 'game-1',
      name: 'Test Game 1',
      playerCount: 2,
      maxPlayers: 4,
      status: 'waiting',
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'game-2',
      name: 'Test Game 2',
      playerCount: 4,
      maxPlayers: 4,
      status: 'playing',
      createdAt: '2024-01-01T01:00:00Z'
    }
  ],
  connectedPlayers: 8
}

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LobbyStateProvider>{children}</LobbyStateProvider>
)

describe('useLobbyState', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic State Management', () => {
    it('provides initial empty state', () => {
      const { result } = renderHook(() => useLobbyState(), { wrapper })
      
      expect(result.current.lobbyState).toEqual({
        availableGames: [],
        connectedPlayers: 0
      })
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })

    it('updates lobby state', () => {
      const { result } = renderHook(() => useLobbyState(), { wrapper })
      
      act(() => {
        result.current.updateLobbyState(mockLobbyState)
      })
      
      expect(result.current.lobbyState).toEqual(mockLobbyState)
    })

    it('sets loading state', () => {
      const { result } = renderHook(() => useLobbyState(), { wrapper })
      
      act(() => {
        result.current.setLoading(true)
      })
      
      expect(result.current.isLoading).toBe(true)
    })

    it('sets error state', () => {
      const { result } = renderHook(() => useLobbyState(), { wrapper })
      const error = new Error('Test error')
      
      act(() => {
        result.current.setError(error)
      })
      
      expect(result.current.error).toBe(error)
    })
  })

  describe('Game Management', () => {
    it('adds new game to lobby', () => {
      const { result } = renderHook(() => useLobbyState(), { wrapper })
      
      const newGame = {
        id: 'game-3',
        name: 'New Game',
        playerCount: 1,
        maxPlayers: 4,
        status: 'waiting' as const,
        createdAt: '2024-01-01T02:00:00Z'
      }
      
      act(() => {
        result.current.addGame(newGame)
      })
      
      expect(result.current.lobbyState.availableGames).toContainEqual(newGame)
    })

    it('removes game from lobby', () => {
      const { result } = renderHook(() => useLobbyState(), { wrapper })
      
      act(() => {
        result.current.updateLobbyState(mockLobbyState)
      })
      
      act(() => {
        result.current.removeGame('game-1')
      })
      
      expect(result.current.lobbyState.availableGames).not.toContainEqual(
        expect.objectContaining({ id: 'game-1' })
      )
    })

    it('updates game status', () => {
      const { result } = renderHook(() => useLobbyState(), { wrapper })
      
      act(() => {
        result.current.updateLobbyState(mockLobbyState)
      })
      
      act(() => {
        result.current.updateGameStatus('game-1', 'playing')
      })
      
      const game = result.current.lobbyState.availableGames.find(g => g.id === 'game-1')
      expect(game?.status).toBe('playing')
    })

    it('updates game player count', () => {
      const { result } = renderHook(() => useLobbyState(), { wrapper })
      
      act(() => {
        result.current.updateLobbyState(mockLobbyState)
      })
      
      act(() => {
        result.current.updateGamePlayerCount('game-1', 3)
      })
      
      const game = result.current.lobbyState.availableGames.find(g => g.id === 'game-1')
      expect(game?.playerCount).toBe(3)
    })
  })

  describe('Player Count Management', () => {
    it('updates connected players count', () => {
      const { result } = renderHook(() => useLobbyState(), { wrapper })
      
      act(() => {
        result.current.updateConnectedPlayers(15)
      })
      
      expect(result.current.lobbyState.connectedPlayers).toBe(15)
    })

    it('increments connected players', () => {
      const { result } = renderHook(() => useLobbyState(), { wrapper })
      
      act(() => {
        result.current.updateLobbyState(mockLobbyState)
      })
      
      act(() => {
        result.current.incrementConnectedPlayers()
      })
      
      expect(result.current.lobbyState.connectedPlayers).toBe(9)
    })

    it('decrements connected players', () => {
      const { result } = renderHook(() => useLobbyState(), { wrapper })
      
      act(() => {
        result.current.updateLobbyState(mockLobbyState)
      })
      
      act(() => {
        result.current.decrementConnectedPlayers()
      })
      
      expect(result.current.lobbyState.connectedPlayers).toBe(7)
    })

    it('does not decrement below zero', () => {
      const { result } = renderHook(() => useLobbyState(), { wrapper })
      
      act(() => {
        result.current.updateLobbyState({ ...mockLobbyState, connectedPlayers: 0 })
      })
      
      act(() => {
        result.current.decrementConnectedPlayers()
      })
      
      expect(result.current.lobbyState.connectedPlayers).toBe(0)
    })
  })

  describe('Game Filtering and Sorting', () => {
    it('filters available games', () => {
      const { result } = renderHook(() => useLobbyState(), { wrapper })
      
      act(() => {
        result.current.updateLobbyState(mockLobbyState)
      })
      
      const waitingGames = result.current.getAvailableGames('waiting')
      expect(waitingGames).toHaveLength(1)
      expect(waitingGames[0].id).toBe('game-1')
    })

    it('gets joinable games', () => {
      const { result } = renderHook(() => useLobbyState(), { wrapper })
      
      act(() => {
        result.current.updateLobbyState(mockLobbyState)
      })
      
      const joinableGames = result.current.getJoinableGames()
      expect(joinableGames).toHaveLength(1)
      expect(joinableGames[0].id).toBe('game-1')
    })

    it('sorts games by creation time', () => {
      const { result } = renderHook(() => useLobbyState(), { wrapper })
      
      act(() => {
        result.current.updateLobbyState(mockLobbyState)
      })
      
      const sortedGames = result.current.getSortedGames('newest')
      expect(sortedGames[0].id).toBe('game-2') // Newer game first
      expect(sortedGames[1].id).toBe('game-1')
    })

    it('sorts games by player count', () => {
      const { result } = renderHook(() => useLobbyState(), { wrapper })
      
      act(() => {
        result.current.updateLobbyState(mockLobbyState)
      })
      
      const sortedGames = result.current.getSortedGames('playerCount')
      expect(sortedGames[0].id).toBe('game-2') // More players first
      expect(sortedGames[1].id).toBe('game-1')
    })
  })

  describe('Real-time Updates', () => {
    it('handles game join event', () => {
      const { result } = renderHook(() => useLobbyState(), { wrapper })
      
      act(() => {
        result.current.updateLobbyState(mockLobbyState)
      })
      
      act(() => {
        result.current.handlePlayerJoinGame('game-1')
      })
      
      const game = result.current.lobbyState.availableGames.find(g => g.id === 'game-1')
      expect(game?.playerCount).toBe(3)
    })

    it('handles game leave event', () => {
      const { result } = renderHook(() => useLobbyState(), { wrapper })
      
      act(() => {
        result.current.updateLobbyState(mockLobbyState)
      })
      
      act(() => {
        result.current.handlePlayerLeaveGame('game-1')
      })
      
      const game = result.current.lobbyState.availableGames.find(g => g.id === 'game-1')
      expect(game?.playerCount).toBe(1)
    })

    it('removes game when last player leaves', () => {
      const { result } = renderHook(() => useLobbyState(), { wrapper })
      
      const singlePlayerGame = {
        ...mockLobbyState,
        availableGames: [{
          id: 'game-single',
          name: 'Single Player Game',
          playerCount: 1,
          maxPlayers: 4,
          status: 'waiting' as const,
          createdAt: '2024-01-01T00:00:00Z'
        }]
      }
      
      act(() => {
        result.current.updateLobbyState(singlePlayerGame)
      })
      
      act(() => {
        result.current.handlePlayerLeaveGame('game-single')
      })
      
      expect(result.current.lobbyState.availableGames).toHaveLength(0)
    })
  })

  describe('Error Handling', () => {
    it('handles invalid game updates gracefully', () => {
      const { result } = renderHook(() => useLobbyState(), { wrapper })
      
      act(() => {
        result.current.updateGameStatus('non-existent-game', 'playing')
      })
      
      // Should not crash and should not change state
      expect(result.current.lobbyState.availableGames).toHaveLength(0)
    })

    it('validates lobby state updates', () => {
      const { result } = renderHook(() => useLobbyState(), { wrapper })
      
      const invalidState = {
        availableGames: 'invalid' as unknown as LobbyGame[],
        connectedPlayers: -1
      }
      
      act(() => {
        result.current.updateLobbyState(invalidState)
      })
      
      expect(result.current.error).toBeTruthy()
    })

    it('clears errors', () => {
      const { result } = renderHook(() => useLobbyState(), { wrapper })
      
      act(() => {
        result.current.setError(new Error('Test error'))
      })
      
      act(() => {
        result.current.clearError()
      })
      
      expect(result.current.error).toBeNull()
    })
  })

  describe('Refresh and Sync', () => {
    it('refreshes lobby state', async () => {
      const { result } = renderHook(() => useLobbyState(), { wrapper })
      
      const mockRefresh = vi.fn().mockResolvedValue(mockLobbyState)
      
      await act(async () => {
        await result.current.refreshLobby(mockRefresh)
      })
      
      expect(mockRefresh).toHaveBeenCalled()
      expect(result.current.lobbyState).toEqual(mockLobbyState)
    })

    it('handles refresh errors', async () => {
      const { result } = renderHook(() => useLobbyState(), { wrapper })
      
      const mockRefresh = vi.fn().mockRejectedValue(new Error('Network error'))
      
      await act(async () => {
        await result.current.refreshLobby(mockRefresh)
      })
      
      expect(result.current.error).toBeTruthy()
    })
  })
})
