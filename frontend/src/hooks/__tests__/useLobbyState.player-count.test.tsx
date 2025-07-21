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

describe('useLobbyState - Player Count Management', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

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