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

describe('useLobbyState - Real-time Updates', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

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