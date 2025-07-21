/**
 * Uncompressed game state deserialization
 */

import { UrlParsingResult } from '../types';
import { parseUrlParams } from '../urlHelpers';
import { migrateGameStateVersion } from '../migration';
import { convertToGameState } from '../converters';

/**
 * Parses uncompressed game state from URL parameters
 */
export function parseUncompressedGameState(params: URLSearchParams): UrlParsingResult {
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
}