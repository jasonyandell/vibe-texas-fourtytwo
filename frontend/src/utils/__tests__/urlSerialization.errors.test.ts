import { describe, it, expect } from 'vitest'
import {
  parseGameStateFromUrl,
  validateUrlGameState,
  type SerializedGameState
} from '../urlSerialization'
import { createEmptyGameState } from '@texas42/shared-types'

describe('URL Serialization - Error Handling', () => {
  const mockGameState = createEmptyGameState('game-123');
  mockGameState.phase = 'playing';
  mockGameState.players = [
    { id: 'p1', name: 'Player 1', position: 'north', hand: [], isConnected: true, isReady: true },
    { id: 'p2', name: 'Player 2', position: 'east', hand: [], isConnected: true, isReady: true },
    { id: 'p3', name: 'Player 3', position: 'south', hand: [], isConnected: true, isReady: true },
    { id: 'p4', name: 'Player 4', position: 'west', hand: [], isConnected: true, isReady: true }
  ];

  describe('Error Handling', () => {
    it('handles malformed URL parameters', () => {
      const malformedUrl = 'gameId=test&phase=invalid&trump=badsuit'
      const result = parseGameStateFromUrl(malformedUrl)
      
      expect(result).toBeNull()
    })

    it('handles missing required fields', () => {
      const incompleteUrl = 'phase=playing&trump=sixes'
      const result = parseGameStateFromUrl(incompleteUrl)
      
      expect(result).toBeNull()
    })

    it('validates parsed game state', () => {
      const invalidUrl = 'gameId=test&phase=playing&players=invalid'
      const result = parseGameStateFromUrl(invalidUrl)
      
      expect(result).toBeNull()
    })
  })

  describe('Validation', () => {
    it('validates correct serialized game state', () => {
      const serialized: SerializedGameState = {
        version: 2,
        gameId: 'game-123',
        phase: 'playing',
        players: mockGameState.players,
        dealer: 'p1',
        scores: { northSouth: 15, eastWest: 23 },
        gameScore: { northSouth: 1, eastWest: 2 }
      }
      
      expect(validateUrlGameState(serialized)).toBe(true)
    })

    it('rejects invalid serialized game state', () => {
      const invalid = {
        version: 2,
        gameId: 'game-123',
        phase: 'invalid-phase',
        players: []
      }
      
      expect(validateUrlGameState(invalid)).toBe(false)
    })
  })
})