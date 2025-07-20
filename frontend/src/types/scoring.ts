/**
 * Scoring Types
 * Types and validation for scoring state in Texas 42
 */

import type { Domino } from './domino';
import { isValidDomino } from './domino';

// Scoring state
export interface ScoringState {
  currentTrickWinner?: string;
  trickPoints: number;
  countDominoes: Domino[];
  bonusPoints: number;
  penaltyPoints: number;
  roundComplete: boolean;
}

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

/**
 * Creates an empty scoring state with default values
 */
export function createEmptyScoringState(): ScoringState {
  return {
    trickPoints: 0,
    countDominoes: [],
    bonusPoints: 0,
    penaltyPoints: 0,
    roundComplete: false
  };
}