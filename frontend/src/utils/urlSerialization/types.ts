/**
 * Type definitions for URL Serialization
 */

import { GameState, Player, Trick, Domino } from '@texas42/shared-types';

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
  boneyard?: Domino[];
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