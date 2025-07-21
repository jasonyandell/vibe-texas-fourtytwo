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

describe('useLobbyState - Basic State Management', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

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