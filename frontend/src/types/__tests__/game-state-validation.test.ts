import { describe, it, expect } from 'vitest'
import {
  isValidGameState,
  createEmptyGameState,
  type GameState,
  type PlayerPosition
} from '@texas42/shared-types'

describe('GameState Validation', () => {
  const validGameState: GameState = (() => {
    const state = createEmptyGameState('game-1');
    state.players = [
      { id: 'p1', name: 'Player 1', position: 'north', hand: [], isConnected: true, isReady: true },
      { id: 'p2', name: 'Player 2', position: 'east', hand: [], isConnected: true, isReady: true },
      { id: 'p3', name: 'Player 3', position: 'south', hand: [], isConnected: true, isReady: true },
      { id: 'p4', name: 'Player 4', position: 'west', hand: [], isConnected: true, isReady: true }
    ];
    state.dealer = 'p1';
    state.createdAt = '2024-01-01T00:00:00Z';
    state.updatedAt = '2024-01-01T00:00:00Z';
    return state;
  })()

  it('validates correct game state', () => {
    expect(isValidGameState(validGameState)).toBe(true)
  })

  it('rejects game state with wrong number of players', () => {
    const gameState = { ...validGameState, players: validGameState.players.slice(0, 3) }
    expect(isValidGameState(gameState)).toBe(false)
  })

  it('rejects game state with duplicate positions', () => {
    const gameState = {
      ...validGameState,
      players: [
        ...validGameState.players.slice(0, 3),
        { ...validGameState.players[3], position: 'north' as PlayerPosition }
      ]
    }
    expect(isValidGameState(gameState)).toBe(false)
  })

  it('rejects game state with invalid dealer', () => {
    const gameState = { ...validGameState, dealer: 'invalid-player' }
    expect(isValidGameState(gameState)).toBe(false)
  })
})