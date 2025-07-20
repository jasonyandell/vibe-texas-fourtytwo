/**
 * Legacy Validators
 * Validation functions for legacy types
 */

import { LegacyGameState } from './legacy-types';
import { isValidPlayer } from './type-guards';

/**
 * Legacy validation function for GameState
 */
export function isValidLegacyGameState(value: unknown): value is LegacyGameState {
  if (!value || typeof value !== 'object') return false;

  const obj = value as Record<string, unknown>;
  const {
    id, phase, players, dealer, tricks, scores, gameScore, boneyard, createdAt, updatedAt
  } = obj;

  // Check required fields
  if (typeof id !== 'string' || id.length === 0) return false;
  if (!['bidding', 'playing', 'scoring', 'finished'].includes(phase as string)) return false;
  if (!Array.isArray(players)) return false;
  if (typeof dealer !== 'string' || dealer.length === 0) return false;
  if (!Array.isArray(tricks)) return false;
  if (!Array.isArray(boneyard)) return false;
  if (typeof createdAt !== 'string') return false;
  if (typeof updatedAt !== 'string') return false;

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

  // Validate scores
  if (!scores || typeof scores !== 'object') return false;
  const scoresObj = scores as Record<string, unknown>;
  if (typeof scoresObj.northSouth !== 'number' || typeof scoresObj.eastWest !== 'number') return false;
  if (!gameScore || typeof gameScore !== 'object') return false;
  const gameScoreObj = gameScore as Record<string, unknown>;
  if (typeof gameScoreObj.northSouth !== 'number' || typeof gameScoreObj.eastWest !== 'number') return false;

  return true;
}

/**
 * Factory function to create empty legacy game state
 */
export function createEmptyGameState(gameId: string): LegacyGameState {
  const now = new Date().toISOString();

  return {
    id: gameId,
    phase: 'bidding',
    players: [],
    dealer: '',
    tricks: [],
    scores: { northSouth: 0, eastWest: 0 },
    gameScore: { northSouth: 0, eastWest: 0 },
    boneyard: [],
    createdAt: now,
    updatedAt: now
  };
}