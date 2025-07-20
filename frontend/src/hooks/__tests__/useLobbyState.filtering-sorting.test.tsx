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

describe('useLobbyState - Game Filtering and Sorting', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

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