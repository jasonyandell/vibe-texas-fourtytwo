import { describe, it, expect } from 'vitest'
import {
  migrateGameStateVersion
} from '../urlSerialization'
import { createEmptyGameState } from '@texas42/shared-types'

describe('URL Serialization - Version Migration', () => {
  const mockGameState = createEmptyGameState('game-123');

  describe('Version Migration', () => {
    it('migrates v1 game state to current version', () => {
      const v1State = {
        version: 1,
        id: 'game-123',
        phase: 'playing',
        players: [],
        dealer: 'p1',
        scores: { northSouth: 0, eastWest: 0 }
      }

      const migrated = migrateGameStateVersion(v1State)

      expect(migrated).toBeDefined()
      expect(migrated!.version).toBe(2)
      expect(migrated!.gameId).toBe('game-123')
    })

    it('handles unknown version gracefully', () => {
      const unknownVersionState = {
        version: 999,
        id: 'game-123'
      }
      
      const result = migrateGameStateVersion(unknownVersionState)
      
      expect(result).toBeNull()
    })

    it('preserves current version state', () => {
      const currentState = { ...mockGameState, version: 2 }
      const migrated = migrateGameStateVersion(currentState)
      
      expect(migrated).toEqual(currentState)
    })
  })
})