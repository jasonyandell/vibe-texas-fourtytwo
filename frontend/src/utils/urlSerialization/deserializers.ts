/**
 * Deserialization functions for URL Serialization
 */

import { GameState } from '@texas42/shared-types';
import { UrlParsingResult, CompressionMethod } from './types';
import { decompressGameState } from './compression';
import { convertToGameState } from './converters';
import { migrateGameStateVersion } from './migration';
import { parseUrlParams } from './urlHelpers';

/**
 * Parses game state from URL parameters with detailed error reporting
 */
export function parseGameStateFromUrlDetailed(urlParams: string): UrlParsingResult {
  try {
    const params = new URLSearchParams(urlParams);

    // Check if compressed
    const compressed = params.get('compressed');
    if (compressed) {
      const method = (params.get('method') as CompressionMethod) || 'base64';

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

    // Parse uncompressed
    try {
      const serialized = parseUrlParams(params);
      if (!serialized) {
        return {
          gameState: null,
          error: 'invalid_url_format',
          errorMessage: 'Failed to parse URL parameters'
        };
      }

      // Migrate version if needed
      const migrated = migrateGameStateVersion(serialized);
      if (!migrated) {
        return {
          gameState: null,
          error: 'version_migration_failed',
          errorMessage: 'Failed to migrate game state version'
        };
      }

      const gameState = convertToGameState(migrated);
      if (!gameState) {
        return {
          gameState: null,
          error: 'validation_failed',
          errorMessage: 'Parsed data failed game state validation'
        };
      }

      return { gameState };
    } catch (parseError) {
      return {
        gameState: null,
        error: 'invalid_url_format',
        errorMessage: `Failed to parse uncompressed URL: ${String(parseError)}`
      };
    }
  } catch (error) {
    return {
      gameState: null,
      error: 'unknown_error',
      errorMessage: `Unexpected error: ${String(error)}`
    };
  }
}

/**
 * Parses game state from URL parameters (backward compatible)
 */
export function parseGameStateFromUrl(urlParams: string): GameState | null {
  const result = parseGameStateFromUrlDetailed(urlParams);
  if (result.error) {
    console.error(`URL parsing failed: ${result.error} - ${result.errorMessage}`);
  }
  return result.gameState;
}

/**
 * Parses shareable URL to extract game state
 */
export function parseShareableUrl(url: string): GameState | null {
  try {
    const urlObj = new URL(url);
    return parseGameStateFromUrl(urlObj.search.substring(1));
  } catch (error) {
    console.error('Failed to parse shareable URL:', error);
    return null;
  }
}