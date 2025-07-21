/**
 * Scoring Type Guards
 * Runtime validation for scoring-related types
 */

import { isValidDomino } from '../dominoes';
import { ScoringState, createEmptyScoringState } from '../scoring';

/**
 * Validates if a value is a valid scoring state
 */
export function isValidScoringState(value: unknown): value is ScoringState {
  if (!value || typeof value !== 'object') return false;

  const { trickPoints, countDominoes, bonusPoints, penaltyPoints, roundComplete, currentTrickWinner } = value as Record<string, unknown>;

  // Check required fields
  if (typeof trickPoints !== 'number' || trickPoints < 0) return false;
  if (!Array.isArray(countDominoes)) return false;
  if (typeof bonusPoints !== 'number') return false;
  if (typeof penaltyPoints !== 'number') return false;
  if (typeof roundComplete !== 'boolean') return false;

  // Validate count dominoes
  if (!countDominoes.every((domino: unknown) => isValidDomino(domino))) return false;

  // Optional fields
  if (currentTrickWinner !== undefined && typeof currentTrickWinner !== 'string') return false;

  return true;
}

// Re-export factory function
export { createEmptyScoringState };