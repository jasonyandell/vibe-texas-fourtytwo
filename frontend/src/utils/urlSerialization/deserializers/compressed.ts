/**
 * Compressed game state deserialization
 */

import { UrlParsingResult, CompressionMethod } from '../types';
import { decompressGameState } from '../compression';
import { convertToGameState } from '../converters';

/**
 * Parses compressed game state from URL parameters
 */
export function parseCompressedGameState(
  compressed: string,
  method: CompressionMethod
): UrlParsingResult {
  try {
    const decompressed = decompressGameState(compressed, method);
    if (!decompressed) {
      return {
        gameState: null,
        error: 'decompression_failed',
        errorMessage: `Failed to decompress using method: ${String(method)}`
      };
    }

    const gameState = convertToGameState(decompressed);
    if (!gameState) {
      return {
        gameState: null,
        error: 'invalid_game_state',
        errorMessage: 'Decompressed data is not a valid game state'
      };
    }

    return {
      gameState,
      compressionStats: {
        method,
        originalSize: JSON.stringify(decompressed).length,
        compressedSize: compressed.length
      }
    };
  } catch (decompressionError) {
    // Try fallback methods for backward compatibility
    const fallbackMethods: CompressionMethod[] = ['base64', 'none'];

    for (const fallbackMethod of fallbackMethods) {
      if (fallbackMethod === method) continue;

      try {
        const decompressed = decompressGameState(compressed, fallbackMethod);
        if (decompressed) {
          const gameState = convertToGameState(decompressed);
          if (gameState) {
            console.warn(`Fallback decompression successful with method: ${fallbackMethod}`);
            return { gameState };
          }
        }
      } catch {
        // Continue to next fallback method
      }
    }

    return {
      gameState: null,
      error: 'decompression_failed',
      errorMessage: `All decompression methods failed. Original error: ${String(decompressionError)}`
    };
  }
}