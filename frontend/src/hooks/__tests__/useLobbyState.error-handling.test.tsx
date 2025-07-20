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

describe('useLobbyState - Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

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