/**
 * Version migration utilities for URL Serialization
 */

import { Player, Trick, Domino } from '@texas42/shared-types';
import { SerializedGameState } from './types';
import { CURRENT_VERSION } from './constants';

/**
 * Migrates game state from older versions
 */
export function migrateGameStateVersion(serialized: unknown): SerializedGameState | null {
  if (!serialized || typeof serialized !== 'object') return null;

  const obj = serialized as Record<string, unknown>;
  const version = obj.version || 1;
  
  if (version === CURRENT_VERSION) {
    return serialized as SerializedGameState;
  }
  
  if (version === 1) {
    // Migrate from v1 to v2
    const migrated: SerializedGameState = {
      version: CURRENT_VERSION,
      gameId: (obj.id as string) || (obj.gameId as string) || '',
      phase: (obj.phase as string) || 'bidding',
      players: (obj.players as Player[]) || [],
      dealer: (obj.dealer as string) || '',
      scores: (obj.scores as { northSouth: number; eastWest: number }) || { northSouth: 0, eastWest: 0 },
      gameScore: (obj.gameScore as { northSouth: number; eastWest: number }) || { northSouth: 0, eastWest: 0 }
    };

    // Copy over other fields if they exist
    if (obj.currentPlayer) migrated.currentPlayer = obj.currentPlayer as string;
    if (obj.bidder) migrated.bidder = obj.bidder as string;
    if (obj.trump) migrated.trump = obj.trump as string;
    if (obj.tricks) migrated.tricks = obj.tricks as Trick[];
    if (obj.boneyard) migrated.boneyard = obj.boneyard as Domino[];
    if (obj.createdAt) migrated.createdAt = obj.createdAt as string;
    if (obj.updatedAt) migrated.updatedAt = obj.updatedAt as string;

    return migrated;
  }
  
  // Unknown version
  let versionStr: string;
  if (typeof version === 'object' && version !== null) {
    versionStr = JSON.stringify(version);
  } else if (typeof version === 'string' || typeof version === 'number') {
    versionStr = String(version);
  } else {
    versionStr = 'unknown';
  }
  console.warn(`Unknown game state version: ${versionStr}`);
  return null;
}