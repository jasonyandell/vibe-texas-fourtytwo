/**
 * URL Serialization for Texas 42 Game State
 * Handles conversion between game state and URL parameters with compression and versioning
 */

// Re-export all types
export type {
  SerializedGameState,
  UrlSerializationOptions,
  UrlParsingError,
  UrlParsingResult,
  CompressionMethod,
  CompressionResult
} from './types';

// Re-export constants
export { CURRENT_VERSION, DEFAULT_MAX_URL_LENGTH } from './constants';

// Re-export validators
export { isValidGameState, validateUrlGameState } from './validators';

// Re-export compression utilities
export { compressGameState, decompressGameState } from './compression';

// Re-export migration utilities
export { migrateGameStateVersion } from './migration';

// Re-export converters
export { convertToGameState } from './converters';

// Re-export URL helpers
export { createUrlParams, parseUrlParams } from './urlHelpers';

// Re-export serializers
export { serializeGameStateToUrl, createShareableUrl } from './serializers';

// Re-export deserializers
export { 
  parseGameStateFromUrlDetailed, 
  parseGameStateFromUrl, 
  parseShareableUrl 
} from './deserializers';