import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLobbyState } from '../useLobbyState'
import { LobbyStateProvider } from '@/contexts/LobbyStateContext'
import { LobbyState } from '@/types/texas42'
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

describe('useLobbyState - Game Management', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

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