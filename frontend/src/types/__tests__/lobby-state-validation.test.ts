import { describe, it, expect } from 'vitest'
import {
  isValidLobbyState,
  type LobbyState,
  type LobbyGame
} from '@texas42/shared-types'

describe('LobbyState Validation', () => {
  const validLobbyState: LobbyState = {
    availableGames: [
      {
        id: 'game-1',
        name: 'Test Game',
        playerCount: 2,
        maxPlayers: 4,
        status: 'waiting',
        createdAt: '2024-01-01T00:00:00Z'
      }
    ],
    connectedPlayers: 5
  }

  it('validates correct lobby state', () => {
    expect(isValidLobbyState(validLobbyState)).toBe(true)
  })

  it('validates empty lobby', () => {
    const lobbyState: LobbyState = {
      availableGames: [],
      connectedPlayers: 0
    }
    expect(isValidLobbyState(lobbyState)).toBe(true)
  })

  it('rejects lobby with invalid game status', () => {
    const lobbyState = {
      ...validLobbyState,
      availableGames: [{
        ...validLobbyState.availableGames[0],
        status: 'invalid' as unknown as LobbyGame['status']
      }]
    }
    expect(isValidLobbyState(lobbyState)).toBe(false)
  })
})