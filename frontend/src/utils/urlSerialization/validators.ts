/**
 * Validation functions for URL Serialization
 */

import { GameState } from '@texas42/shared-types';
import { SerializedGameState } from './types';

// Temporary workaround for build issue - simplified validation
export function isValidGameState(value: unknown): value is GameState {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  return typeof obj.id === 'string' && typeof obj.phase === 'string';
}

/**
 * Validates serialized game state
 */
export function validateUrlGameState(serialized: unknown): serialized is SerializedGameState {
  if (!serialized || typeof serialized !== 'object') return false;
  
  const obj = serialized as Record<string, unknown>;
  const { version, gameId, phase, players, dealer, scores, gameScore } = obj;
  
  // Check required fields
  if (typeof version !== 'number') return false;
  if (typeof gameId !== 'string' || gameId.length === 0) return false;
  if (typeof phase !== 'string') return false;
  if (!Array.isArray(players)) return false;
  if (typeof dealer !== 'string' || dealer.length === 0) return false;
  if (!scores || typeof scores !== 'object') return false;
  if (!gameScore || typeof gameScore !== 'object') return false;
  
  // Validate scores
  const scoresObj = scores as Record<string, unknown>;
  const gameScoreObj = gameScore as Record<string, unknown>;
  if (typeof scoresObj.northSouth !== 'number' || typeof scoresObj.eastWest !== 'number') return false;
  if (typeof gameScoreObj.northSouth !== 'number' || typeof gameScoreObj.eastWest !== 'number') return false;
  
  return true;
}