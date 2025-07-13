/**
 * URL Serialization for Texas 42 Game State
 * Handles conversion between game state and URL parameters with compression and versioning
 */

import { GameState, isValidGameState, Player, Trick } from '@/types/texas42';
import LZString from 'lz-string';

// Current serialization version
const CURRENT_VERSION = 2;

// URL length limits (typical browser limit is 2048)
const DEFAULT_MAX_URL_LENGTH = 2048;

export interface SerializedGameState {
  version: number;
  gameId: string;
  phase: string;
  players: Player[];
  dealer: string;
  currentPlayer?: string;
  bidder?: string;
  trump?: string;
  tricks?: Trick[];
  scores: { northSouth: number; eastWest: number };
  gameScore: { northSouth: number; eastWest: number };
  boneyard?: any[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UrlSerializationOptions {
  maxUrlLength?: number;
  includeFields?: string[];
  excludeFields?: string[];
  useCompression?: boolean;
}

/**
 * Serializes game state to URL parameters
 */
export function serializeGameStateToUrl(
  gameState: GameState, 
  options: UrlSerializationOptions = {}
): string {
  const {
    maxUrlLength = DEFAULT_MAX_URL_LENGTH,
    includeFields,
    excludeFields,
    useCompression = false
  } = options;

  // Create serialized state with version
  const serialized: SerializedGameState = {
    version: CURRENT_VERSION,
    gameId: gameState.id,
    phase: gameState.phase,
    players: gameState.players,
    dealer: gameState.dealer,
    scores: gameState.scores,
    gameScore: gameState.gameScore
  };

  // Add optional fields
  if (gameState.currentPlayer) serialized.currentPlayer = gameState.currentPlayer;
  if (gameState.bidder) serialized.bidder = gameState.bidder;
  if (gameState.trump) serialized.trump = gameState.trump;
  if (gameState.tricks?.length) serialized.tricks = gameState.tricks;
  if (gameState.boneyard?.length) serialized.boneyard = gameState.boneyard;
  if (gameState.createdAt) serialized.createdAt = gameState.createdAt;
  if (gameState.updatedAt) serialized.updatedAt = gameState.updatedAt;

  // Apply field filtering
  let filteredState = serialized;
  if (includeFields) {
    const filtered: any = { version: CURRENT_VERSION };
    includeFields.forEach(field => {
      if (field === 'id') {
        filtered.gameId = serialized.gameId;
      } else if (field === 'gameId') {
        filtered.gameId = serialized.gameId;
      } else if (serialized[field as keyof SerializedGameState] !== undefined) {
        filtered[field] = serialized[field as keyof SerializedGameState];
      }
    });
    filteredState = filtered as SerializedGameState;
  } else if (excludeFields) {
    filteredState = Object.fromEntries(
      Object.entries(serialized).filter(([key]) => !excludeFields.includes(key))
    ) as SerializedGameState;
  }

  // Try uncompressed first
  const uncompressed = createUrlParams(filteredState);

  // Use compression only if forced or URL is too long
  if (useCompression || uncompressed.length > maxUrlLength) {
    const compressionResult = compressGameState(filteredState);
    const compressedUrl = `compressed=${encodeURIComponent(compressionResult.data)}&method=${compressionResult.method}&version=${CURRENT_VERSION}`;

    // Log compression stats for debugging
    if (compressionResult.compressionRatio < 0.8) {
      console.log(`URL compression: ${compressionResult.originalSize} → ${compressionResult.compressedSize} bytes (${Math.round(compressionResult.compressionRatio * 100)}%) using ${compressionResult.method}`);
    }

    // If compressed is still too long, try more aggressive compression
    if (compressedUrl.length > maxUrlLength && compressionResult.method !== 'lz-string-uri') {
      const aggressiveResult = compressGameState(filteredState, 'lz-string-uri');
      const aggressiveUrl = `compressed=${encodeURIComponent(aggressiveResult.data)}&method=${aggressiveResult.method}&version=${CURRENT_VERSION}`;

      if (aggressiveUrl.length <= maxUrlLength) {
        return aggressiveUrl;
      }
    }

    return compressedUrl;
  }

  // Return uncompressed by default
  return uncompressed;
}

/**
 * Error types for URL parsing
 */
export type UrlParsingError =
  | 'invalid_url_format'
  | 'compression_failed'
  | 'decompression_failed'
  | 'invalid_game_state'
  | 'version_migration_failed'
  | 'validation_failed'
  | 'unknown_error';

/**
 * Result of URL parsing with error details
 */
export interface UrlParsingResult {
  gameState: GameState | null;
  error?: UrlParsingError;
  errorMessage?: string;
  compressionStats?: {
    method: CompressionMethod;
    originalSize: number;
    compressedSize: number;
  };
}

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
            errorMessage: `Failed to decompress using method: ${method}`
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
          errorMessage: `All decompression methods failed. Original error: ${decompressionError}`
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
        errorMessage: `Failed to parse uncompressed URL: ${parseError}`
      };
    }
  } catch (error) {
    return {
      gameState: null,
      error: 'unknown_error',
      errorMessage: `Unexpected error: ${error}`
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
 * Compression methods available
 */
export type CompressionMethod = 'none' | 'base64' | 'lz-string' | 'lz-string-uri';

/**
 * Compression result with metadata
 */
export interface CompressionResult {
  data: string;
  method: CompressionMethod;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

/**
 * Compresses game state using the best available method
 */
export function compressGameState(gameState: any, preferredMethod?: CompressionMethod): CompressionResult {
  const json = JSON.stringify(gameState);
  const originalSize = json.length;

  // Try different compression methods and pick the best one
  const methods: CompressionMethod[] = preferredMethod
    ? [preferredMethod]
    : ['lz-string-uri', 'lz-string', 'base64', 'none'];

  let bestResult: CompressionResult | null = null;

  for (const method of methods) {
    try {
      let compressed: string;

      switch (method) {
        case 'lz-string-uri':
          compressed = LZString.compressToEncodedURIComponent(json);
          break;
        case 'lz-string':
          compressed = LZString.compressToBase64(json);
          break;
        case 'base64':
          compressed = btoa(json);
          break;
        case 'none':
        default:
          compressed = json;
          break;
      }

      const result: CompressionResult = {
        data: compressed,
        method,
        originalSize,
        compressedSize: compressed.length,
        compressionRatio: compressed.length / originalSize
      };

      // Use the first successful compression, or the best ratio if trying all methods
      if (preferredMethod || !bestResult || result.compressionRatio < bestResult.compressionRatio) {
        bestResult = result;
        if (preferredMethod) break; // Use preferred method if specified
      }
    } catch (error) {
      console.warn(`Compression method ${method} failed:`, error);
      continue;
    }
  }

  if (!bestResult) {
    // Fallback to uncompressed
    return {
      data: json,
      method: 'none',
      originalSize,
      compressedSize: originalSize,
      compressionRatio: 1
    };
  }

  return bestResult;
}

/**
 * Decompresses game state from compressed string
 */
export function decompressGameState(compressed: string, method: CompressionMethod): any | null {
  try {
    let json: string;

    switch (method) {
      case 'lz-string-uri':
        json = LZString.decompressFromEncodedURIComponent(compressed);
        if (!json) throw new Error('LZ-string URI decompression failed');
        break;
      case 'lz-string':
        json = LZString.decompressFromBase64(compressed);
        if (!json) throw new Error('LZ-string base64 decompression failed');
        break;
      case 'base64':
        json = atob(compressed);
        break;
      case 'none':
      default:
        json = compressed;
        break;
    }

    return JSON.parse(json);
  } catch (error) {
    console.error(`Failed to decompress game state using method ${method}:`, error);
    return null;
  }
}

/**
 * Validates serialized game state
 */
export function validateUrlGameState(serialized: any): serialized is SerializedGameState {
  if (!serialized || typeof serialized !== 'object') return false;
  
  const { version, gameId, phase, players, dealer, scores, gameScore } = serialized;
  
  // Check required fields
  if (typeof version !== 'number') return false;
  if (typeof gameId !== 'string' || gameId.length === 0) return false;
  if (typeof phase !== 'string') return false;
  if (!Array.isArray(players)) return false;
  if (typeof dealer !== 'string' || dealer.length === 0) return false;
  if (!scores || typeof scores !== 'object') return false;
  if (!gameScore || typeof gameScore !== 'object') return false;
  
  // Validate scores
  if (typeof scores.northSouth !== 'number' || typeof scores.eastWest !== 'number') return false;
  if (typeof gameScore.northSouth !== 'number' || typeof gameScore.eastWest !== 'number') return false;
  
  return true;
}

/**
 * Migrates game state from older versions
 */
export function migrateGameStateVersion(serialized: any): SerializedGameState | null {
  if (!serialized || typeof serialized !== 'object') return null;
  
  const version = serialized.version || 1;
  
  if (version === CURRENT_VERSION) {
    return serialized as SerializedGameState;
  }
  
  if (version === 1) {
    // Migrate from v1 to v2
    const migrated: SerializedGameState = {
      version: CURRENT_VERSION,
      gameId: serialized.id || serialized.gameId || '',
      phase: serialized.phase || 'bidding',
      players: serialized.players || [],
      dealer: serialized.dealer || '',
      scores: serialized.scores || { northSouth: 0, eastWest: 0 },
      gameScore: serialized.gameScore || { northSouth: 0, eastWest: 0 }
    };

    // Copy over other fields if they exist
    if (serialized.currentPlayer) migrated.currentPlayer = serialized.currentPlayer;
    if (serialized.bidder) migrated.bidder = serialized.bidder;
    if (serialized.trump) migrated.trump = serialized.trump;
    if (serialized.tricks) migrated.tricks = serialized.tricks;
    if (serialized.boneyard) migrated.boneyard = serialized.boneyard;
    if (serialized.createdAt) migrated.createdAt = serialized.createdAt;
    if (serialized.updatedAt) migrated.updatedAt = serialized.updatedAt;

    return migrated;
  }
  
  // Unknown version
  console.warn(`Unknown game state version: ${version}`);
  return null;
}

/**
 * Creates shareable URL with base path
 */
export function createShareableUrl(
  gameState: GameState, 
  baseUrl: string, 
  options?: UrlSerializationOptions
): string {
  const params = serializeGameStateToUrl(gameState, options);
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}${params}`;
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

// Helper functions

function createUrlParams(serialized: SerializedGameState): string {
  const params = new URLSearchParams();

  params.set('version', serialized.version.toString());
  if (serialized.gameId) params.set('gameId', serialized.gameId);
  if (serialized.phase) params.set('phase', serialized.phase);
  if (serialized.players) params.set('players', JSON.stringify(serialized.players));
  if (serialized.dealer) params.set('dealer', serialized.dealer);
  if (serialized.scores) params.set('scores', JSON.stringify(serialized.scores));
  if (serialized.gameScore) params.set('gameScore', JSON.stringify(serialized.gameScore));

  if (serialized.currentPlayer) params.set('currentPlayer', serialized.currentPlayer);
  if (serialized.bidder) params.set('bidder', serialized.bidder);
  if (serialized.trump) params.set('trump', serialized.trump);
  if (serialized.tricks) params.set('tricks', JSON.stringify(serialized.tricks));
  if (serialized.boneyard) params.set('boneyard', JSON.stringify(serialized.boneyard));
  if (serialized.createdAt) params.set('createdAt', serialized.createdAt);
  if (serialized.updatedAt) params.set('updatedAt', serialized.updatedAt);

  return params.toString();
}

function parseUrlParams(params: URLSearchParams): SerializedGameState | null {
  try {
    const version = parseInt(params.get('version') || '1');
    const gameId = params.get('gameId');
    const phase = params.get('phase');
    const playersStr = params.get('players');
    const dealer = params.get('dealer');
    const scoresStr = params.get('scores');
    const gameScoreStr = params.get('gameScore');
    
    if (!gameId || !phase || !playersStr || !dealer || !scoresStr || !gameScoreStr) {
      return null;
    }
    
    const players = JSON.parse(playersStr);
    const scores = JSON.parse(scoresStr);
    const gameScore = JSON.parse(gameScoreStr);
    
    const serialized: SerializedGameState = {
      version,
      gameId,
      phase,
      players,
      dealer,
      scores,
      gameScore
    };
    
    // Add optional fields
    const currentPlayer = params.get('currentPlayer');
    if (currentPlayer) serialized.currentPlayer = currentPlayer;
    
    const bidder = params.get('bidder');
    if (bidder) serialized.bidder = bidder;
    
    const trump = params.get('trump');
    if (trump) serialized.trump = trump;
    
    const tricksStr = params.get('tricks');
    if (tricksStr) serialized.tricks = JSON.parse(tricksStr);
    
    const boneyardStr = params.get('boneyard');
    if (boneyardStr) serialized.boneyard = JSON.parse(boneyardStr);
    
    const createdAt = params.get('createdAt');
    if (createdAt) serialized.createdAt = createdAt;
    
    const updatedAt = params.get('updatedAt');
    if (updatedAt) serialized.updatedAt = updatedAt;
    
    return serialized;
  } catch (error) {
    console.error('Failed to parse URL params:', error);
    return null;
  }
}

function convertToGameState(serialized: SerializedGameState): GameState | null {
  try {
    const gameState: GameState = {
      id: serialized.gameId,
      phase: serialized.phase as any,
      players: serialized.players,
      dealer: serialized.dealer,
      tricks: serialized.tricks || [],
      scores: serialized.scores,
      gameScore: serialized.gameScore,
      boneyard: serialized.boneyard || [],
      createdAt: serialized.createdAt || new Date().toISOString(),
      updatedAt: serialized.updatedAt || new Date().toISOString()
    };
    
    if (serialized.currentPlayer) gameState.currentPlayer = serialized.currentPlayer;
    if (serialized.bidder) gameState.bidder = serialized.bidder;
    if (serialized.trump) gameState.trump = serialized.trump as any;
    
    // Validate the converted state
    if (!isValidGameState(gameState)) {
      console.error('Converted game state is invalid');
      return null;
    }
    
    return gameState;
  } catch (error) {
    console.error('Failed to convert to game state:', error);
    return null;
  }
}
