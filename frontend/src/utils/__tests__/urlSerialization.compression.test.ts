import { describe, it, expect } from 'vitest'
import {
  compressGameState,
  decompressGameState
} from '../urlSerialization'
import { createEmptyGameState } from '@texas42/shared-types'

describe('URL Serialization - Compression', () => {
  const mockGameState = createEmptyGameState('game-123');
  // Add test-specific data
  mockGameState.phase = 'playing';
  mockGameState.players = [
    { id: 'p1', name: 'Player 1', position: 'north', hand: [], isConnected: true, isReady: true },
    { id: 'p2', name: 'Player 2', position: 'east', hand: [], isConnected: true, isReady: true },
    { id: 'p3', name: 'Player 3', position: 'south', hand: [], isConnected: true, isReady: true },
    { id: 'p4', name: 'Player 4', position: 'west', hand: [], isConnected: true, isReady: true }
  ];
  mockGameState.dealer = 'p1';
  mockGameState.partnerships.northSouth.currentHandScore = 15;
  mockGameState.partnerships.eastWest.currentHandScore = 23;
  mockGameState.gameScore = { northSouth: 1, eastWest: 2 };

  describe('Compression', () => {
    it('compresses game state for shorter URLs', () => {
      // Convert GameState to SerializedGameState for compression
      const serializedState = {
        version: 2,
        gameId: mockGameState.id,
        phase: mockGameState.phase,
        players: mockGameState.players,
        dealer: mockGameState.dealer,
        scores: {
          northSouth: mockGameState.partnerships.northSouth.currentHandScore,
          eastWest: mockGameState.partnerships.eastWest.currentHandScore
        },
        gameScore: mockGameState.gameScore
      };

      const compressionResult = compressGameState(serializedState)
      const original = JSON.stringify(serializedState)

      // Compression should return a valid result
      expect(compressionResult.data.length).toBeGreaterThan(0)
      expect(typeof compressionResult.data).toBe('string')
      expect(compressionResult.method).toBeDefined()
      expect(compressionResult.originalSize).toBe(original.length)
      expect(compressionResult.compressedSize).toBe(compressionResult.data.length)
      expect(compressionResult.compressionRatio).toBeGreaterThan(0)
    })

    it('decompresses game state correctly', () => {
      // Convert GameState to SerializedGameState for compression
      const serializedState = {
        version: 2,
        gameId: mockGameState.id,
        phase: mockGameState.phase,
        players: mockGameState.players,
        dealer: mockGameState.dealer,
        scores: {
          northSouth: mockGameState.partnerships.northSouth.currentHandScore,
          eastWest: mockGameState.partnerships.eastWest.currentHandScore
        },
        gameScore: mockGameState.gameScore
      };

      const compressionResult = compressGameState(serializedState)
      const decompressed = decompressGameState(compressionResult.data, compressionResult.method)

      expect(decompressed).toEqual(serializedState)
    })

    it('handles compression round-trip', () => {
      // Convert GameState to SerializedGameState for compression
      const serializedState = {
        version: 2,
        gameId: mockGameState.id,
        phase: mockGameState.phase,
        players: mockGameState.players,
        dealer: mockGameState.dealer,
        scores: {
          northSouth: mockGameState.partnerships.northSouth.currentHandScore,
          eastWest: mockGameState.partnerships.eastWest.currentHandScore
        },
        gameScore: mockGameState.gameScore
      };

      const compressionResult = compressGameState(serializedState)
      const decompressed = decompressGameState(compressionResult.data, compressionResult.method)

      // Ensure decompressed is not null before recompressing
      expect(decompressed).not.toBeNull()

      if (decompressed) {
        const recompressionResult = compressGameState(decompressed, compressionResult.method)

        // Should decompress to the same data
        expect(decompressed).toEqual(serializedState)
        // Recompression with same method should produce similar results
        expect(recompressionResult.method).toBe(compressionResult.method)
      }
    })

    it('chooses best compression method automatically', () => {
      // Convert GameState to SerializedGameState for compression
      const serializedState = {
        version: 2,
        gameId: mockGameState.id,
        phase: mockGameState.phase,
        players: mockGameState.players,
        dealer: mockGameState.dealer,
        scores: {
          northSouth: mockGameState.partnerships.northSouth.currentHandScore,
          eastWest: mockGameState.partnerships.eastWest.currentHandScore
        },
        gameScore: mockGameState.gameScore
      };

      const result = compressGameState(serializedState)

      // Should choose an efficient compression method for this data
      expect(['lz-string-uri', 'lz-string', 'base64', 'none']).toContain(result.method)
      expect(result.compressionRatio).toBeLessThanOrEqual(1)
    })

    it('respects preferred compression method', () => {
      // Convert GameState to SerializedGameState for compression
      const serializedState = {
        version: 2,
        gameId: mockGameState.id,
        phase: mockGameState.phase,
        players: mockGameState.players,
        dealer: mockGameState.dealer,
        scores: {
          northSouth: mockGameState.partnerships.northSouth.currentHandScore,
          eastWest: mockGameState.partnerships.eastWest.currentHandScore
        },
        gameScore: mockGameState.gameScore
      };

      const result = compressGameState(serializedState, 'base64')

      expect(result.method).toBe('base64')
      expect(result.data).toBe(btoa(JSON.stringify(serializedState)))
    })
  })

  describe('Error Handling', () => {
    it('handles corrupted compressed data', () => {
      const corruptedData = 'invalid-base64-data'
      const result = decompressGameState(corruptedData, 'base64')
      
      expect(result).toBeNull()
    })
  })
})