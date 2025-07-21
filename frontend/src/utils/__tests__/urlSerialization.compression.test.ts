import { describe, it, expect } from 'vitest'
import {
  compressGameState,
  decompressGameState
} from '../urlSerialization'
import { createTestGameState, createSerializedState } from './helpers/compressionTestHelpers'

describe('URL Serialization - Compression', () => {
  const mockGameState = createTestGameState();

  describe('Compression', () => {
    it('compresses game state for shorter URLs', () => {
      const serializedState = createSerializedState(mockGameState);
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
      const serializedState = createSerializedState(mockGameState);
      const compressionResult = compressGameState(serializedState)
      const decompressed = decompressGameState(compressionResult.data, compressionResult.method)

      expect(decompressed).toEqual(serializedState)
    })

    it('handles compression round-trip', () => {
      const serializedState = createSerializedState(mockGameState);
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
      const serializedState = createSerializedState(mockGameState);
      const result = compressGameState(serializedState)

      // Should choose an efficient compression method for this data
      expect(['lz-string-uri', 'lz-string', 'base64', 'none']).toContain(result.method)
      expect(result.compressionRatio).toBeLessThanOrEqual(1)
    })

    it('respects preferred compression method', () => {
      const serializedState = createSerializedState(mockGameState);
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