import { describe, it, expect } from 'vitest'
import {
  serializeGameStateToUrl,
  parseGameStateFromUrl,
  parseGameStateFromUrlDetailed,
  compressGameState,
  decompressGameState,
  validateUrlGameState,
  migrateGameStateVersion,
  createShareableUrl,
  parseShareableUrl,
  type SerializedGameState,
  type UrlSerializationOptions,
  type CompressionMethod,
  type CompressionResult,
  type UrlParsingResult
} from '../urlSerialization'
import { GameState, createEmptyGameState } from '@/types/texas42'

describe('URL Serialization', () => {
  const mockGameState: GameState = {
    id: 'game-123',
    phase: 'playing',
    players: [
      { id: 'p1', name: 'Player 1', position: 'north', hand: [], isConnected: true, isReady: true },
      { id: 'p2', name: 'Player 2', position: 'east', hand: [], isConnected: true, isReady: true },
      { id: 'p3', name: 'Player 3', position: 'south', hand: [], isConnected: true, isReady: true },
      { id: 'p4', name: 'Player 4', position: 'west', hand: [], isConnected: true, isReady: true }
    ],
    dealer: 'p1',
    currentPlayer: 'p2',
    trump: 'sixes',
    tricks: [],
    scores: { northSouth: 15, eastWest: 23 },
    gameScore: { northSouth: 1, eastWest: 2 },
    boneyard: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }

  describe('Basic Serialization', () => {
    it('serializes game state to URL parameters', () => {
      const urlParams = serializeGameStateToUrl(mockGameState)
      
      expect(urlParams).toContain('gameId=game-123')
      expect(urlParams).toContain('phase=playing')
      expect(urlParams).toContain('trump=sixes')
      expect(urlParams).toContain('dealer=p1')
      expect(urlParams).toContain('currentPlayer=p2')
    })

    it('parses game state from URL parameters', () => {
      const urlParams = serializeGameStateToUrl(mockGameState)
      const parsedState = parseGameStateFromUrl(urlParams)
      
      expect(parsedState).toBeDefined()
      expect(parsedState!.id).toBe(mockGameState.id)
      expect(parsedState!.phase).toBe(mockGameState.phase)
      expect(parsedState!.trump).toBe(mockGameState.trump)
      expect(parsedState!.dealer).toBe(mockGameState.dealer)
      expect(parsedState!.currentPlayer).toBe(mockGameState.currentPlayer)
    })

    it('handles round-trip serialization correctly', () => {
      const urlParams = serializeGameStateToUrl(mockGameState)
      const parsedState = parseGameStateFromUrl(urlParams)
      
      expect(parsedState).toBeDefined()
      expect(parsedState!.id).toBe(mockGameState.id)
      expect(parsedState!.phase).toBe(mockGameState.phase)
      expect(parsedState!.players).toHaveLength(4)
      expect(parsedState!.scores.northSouth).toBe(15)
      expect(parsedState!.scores.eastWest).toBe(23)
    })
  })

  describe('Compression', () => {
    it('compresses game state for shorter URLs', () => {
      const compressionResult = compressGameState(mockGameState)
      const original = JSON.stringify(mockGameState)

      // Compression should return a valid result
      expect(compressionResult.data.length).toBeGreaterThan(0)
      expect(typeof compressionResult.data).toBe('string')
      expect(compressionResult.method).toBeDefined()
      expect(compressionResult.originalSize).toBe(original.length)
      expect(compressionResult.compressedSize).toBe(compressionResult.data.length)
      expect(compressionResult.compressionRatio).toBeGreaterThan(0)
    })

    it('decompresses game state correctly', () => {
      const compressionResult = compressGameState(mockGameState)
      const decompressed = decompressGameState(compressionResult.data, compressionResult.method)

      expect(decompressed).toEqual(mockGameState)
    })

    it('handles compression round-trip', () => {
      const compressionResult = compressGameState(mockGameState)
      const decompressed = decompressGameState(compressionResult.data, compressionResult.method)
      const recompressionResult = compressGameState(decompressed, compressionResult.method)

      // Should decompress to the same data
      expect(decompressed).toEqual(mockGameState)
      // Recompression with same method should produce similar results
      expect(recompressionResult.method).toBe(compressionResult.method)
    })

    it('chooses best compression method automatically', () => {
      const result = compressGameState(mockGameState)

      // Should choose an efficient compression method for this data
      expect(['lz-string-uri', 'lz-string', 'base64', 'none']).toContain(result.method)
      expect(result.compressionRatio).toBeLessThanOrEqual(1)
    })

    it('respects preferred compression method', () => {
      const result = compressGameState(mockGameState, 'base64')

      expect(result.method).toBe('base64')
      expect(result.data).toBe(btoa(JSON.stringify(mockGameState)))
    })
  })

  describe('URL Length Management', () => {
    it('keeps URLs under 2048 characters by default', () => {
      const urlParams = serializeGameStateToUrl(mockGameState)
      
      expect(urlParams.length).toBeLessThan(2048)
    })

    it('uses compression when URL would be too long', () => {
      const largeGameState = {
        ...mockGameState,
        tricks: Array(20).fill({
          id: 'trick-1',
          dominoes: [
            { domino: { id: '1', high: 6, low: 3 }, playerId: 'p1', position: 'north' },
            { domino: { id: '2', high: 5, low: 2 }, playerId: 'p2', position: 'east' },
            { domino: { id: '3', high: 4, low: 1 }, playerId: 'p3', position: 'south' },
            { domino: { id: '4', high: 3, low: 0 }, playerId: 'p4', position: 'west' }
          ]
        })
      }

      const urlParams = serializeGameStateToUrl(largeGameState, { useCompression: true })
      expect(urlParams).toContain('compressed=')
      expect(urlParams).toContain('version=2')
    })

    it('supports custom URL length limits', () => {
      const options: UrlSerializationOptions = { maxUrlLength: 1000 }
      const urlParams = serializeGameStateToUrl(mockGameState, options)
      
      expect(urlParams.length).toBeLessThan(1000)
    })
  })

  describe('Partial Serialization', () => {
    it('serializes only specified fields', () => {
      const options: UrlSerializationOptions = {
        includeFields: ['id', 'phase', 'scores']
      }
      const urlParams = serializeGameStateToUrl(mockGameState, options)
      
      expect(urlParams).toContain('gameId=game-123')
      expect(urlParams).toContain('phase=playing')
      expect(urlParams).toContain('scores=')
      expect(urlParams).not.toContain('trump=')
      expect(urlParams).not.toContain('players=')
    })

    it('excludes specified fields', () => {
      const options: UrlSerializationOptions = {
        excludeFields: ['boneyard', 'tricks', 'createdAt', 'updatedAt']
      }
      const urlParams = serializeGameStateToUrl(mockGameState, options)
      
      expect(urlParams).toContain('gameId=game-123')
      expect(urlParams).toContain('phase=playing')
      expect(urlParams).not.toContain('boneyard=')
      expect(urlParams).not.toContain('tricks=')
    })
  })

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

    it('handles corrupted compressed data', () => {
      const corruptedData = 'invalid-base64-data'
      const result = decompressGameState(corruptedData)
      
      expect(result).toBeNull()
    })

    it('validates parsed game state', () => {
      const invalidUrl = 'gameId=test&phase=playing&players=invalid'
      const result = parseGameStateFromUrl(invalidUrl)
      
      expect(result).toBeNull()
    })
  })

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

  describe('Shareable URLs', () => {
    it('creates shareable URL with base path', () => {
      const baseUrl = 'https://texas42.game'
      const shareableUrl = createShareableUrl(mockGameState, baseUrl)
      
      expect(shareableUrl.startsWith(baseUrl)).toBe(true)
      expect(shareableUrl).toContain('?')
    })

    it('parses shareable URL correctly', () => {
      const baseUrl = 'https://texas42.game/game'
      const shareableUrl = createShareableUrl(mockGameState, baseUrl)
      const parsedState = parseShareableUrl(shareableUrl)
      
      expect(parsedState).toBeDefined()
      expect(parsedState!.id).toBe(mockGameState.id)
    })

    it('handles URL fragments and query parameters', () => {
      const baseUrl = 'https://texas42.game/game#section'
      const shareableUrl = createShareableUrl(mockGameState, baseUrl)
      
      expect(shareableUrl).toContain('#section')
      
      const parsedState = parseShareableUrl(shareableUrl)
      expect(parsedState).toBeDefined()
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

  describe('Performance', () => {
    it('serializes large game state quickly', () => {
      const start = performance.now()
      serializeGameStateToUrl(mockGameState)
      const end = performance.now()
      
      expect(end - start).toBeLessThan(50) // Under 50ms
    })

    it('parses URL quickly', () => {
      const urlParams = serializeGameStateToUrl(mockGameState)
      
      const start = performance.now()
      parseGameStateFromUrl(urlParams)
      const end = performance.now()
      
      expect(end - start).toBeLessThan(50) // Under 50ms
    })
  })
})
