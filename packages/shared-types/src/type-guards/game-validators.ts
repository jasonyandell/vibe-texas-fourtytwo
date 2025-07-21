/**
 * Game State Type Guards
 * Runtime validation for game-related types
 */

import { isValidPlayer } from './player-validators';
import { validateGamePhase } from './enum-validators';
import { GameState, createEmptyGameState } from '../game-state';

/**
 * Validates if a value is a valid game state
 */
export function isValidGameState(value: unknown): value is GameState {
  // This is a simplified validation - the actual GameState in shared types
  // has a different structure than the frontend version
  if (!value || typeof value !== 'object') return false;

  const obj = value as Record<string, unknown>;
  const { id, phase, players, dealer } = obj;

  // Check basic required fields
  if (typeof id !== 'string' || id.length === 0) return false;
  if (!validateGamePhase(phase)) return false;
  if (!Array.isArray(players)) return false;
  if (typeof dealer !== 'string' || dealer.length === 0) return false;

  // Validate players (must be exactly 4 for Texas 42)
  if (players.length !== 4) return false;
  if (!players.every(player => isValidPlayer(player))) return false;

  // Check for unique positions (no duplicates)
  const positions = players.map((p: any) => p.position);
  const uniquePositions = new Set(positions);
  if (uniquePositions.size !== 4) return false;

  // Check that dealer is one of the player IDs
  const playerIds = players.map((p: any) => p.id);
  if (!playerIds.includes(dealer)) return false;

  return true;
}

// Re-export factory function
export { createEmptyGameState };