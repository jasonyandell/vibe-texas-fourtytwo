/**
 * Serialization functions for URL Serialization
 */

import { GameState } from '@texas42/shared-types';
import { SerializedGameState, UrlSerializationOptions } from './types';
import { CURRENT_VERSION, DEFAULT_MAX_URL_LENGTH } from './constants';
import { compressGameState } from './compression';
import { createUrlParams } from './urlHelpers';

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
    scores: {
      northSouth: gameState.partnerships.northSouth.currentHandScore,
      eastWest: gameState.partnerships.eastWest.currentHandScore
    },
    gameScore: gameState.gameScore
  };

  // Add optional fields
  if (gameState.currentPlayer) serialized.currentPlayer = gameState.currentPlayer;
  if (gameState.currentBid?.playerId) serialized.bidder = gameState.currentBid.playerId;
  if (gameState.trump) serialized.trump = gameState.trump;
  if (gameState.tricks?.length) serialized.tricks = gameState.tricks;
  if (gameState.boneyard?.length) serialized.boneyard = gameState.boneyard;
  if (gameState.createdAt) serialized.createdAt = gameState.createdAt;
  if (gameState.updatedAt) serialized.updatedAt = gameState.updatedAt;

  // Apply field filtering
  let filteredState = serialized;
  if (includeFields) {
    const filtered: Record<string, unknown> = { version: CURRENT_VERSION };
    includeFields.forEach(field => {
      if (field === 'id') {
        filtered.gameId = serialized.gameId;
      } else if (field === 'gameId') {
        filtered.gameId = serialized.gameId;
      } else if (serialized[field as keyof SerializedGameState] !== undefined) {
        filtered[field] = serialized[field as keyof SerializedGameState];
      }
    });
    filteredState = filtered as unknown as SerializedGameState;
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