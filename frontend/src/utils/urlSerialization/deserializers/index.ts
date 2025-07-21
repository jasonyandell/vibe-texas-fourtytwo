/**
 * Main deserialization functions for URL Serialization
 */

import { GameState } from '@texas42/shared-types';
import { UrlParsingResult, CompressionMethod } from '../types';
import { parseCompressedGameState } from './compressed';
import { parseUncompressedGameState } from './uncompressed';

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
      return parseCompressedGameState(compressed, method);
    }

    // Parse uncompressed
    return parseUncompressedGameState(params);
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