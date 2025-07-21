/**
 * Trick Types
 * Types and validation for game tricks in Texas 42
 */

import type { Domino, DominoSuit } from './domino';
import type { PlayerPosition } from './player';
import { isValidDomino, validateDominoSuit } from './domino';
import { validatePlayerPosition } from './player';

// Game trick
export interface Trick {
  id: string;
  dominoes: Array<{
    domino: Domino;
    playerId: string;
    position: PlayerPosition;
  }>;
  winner?: string;
  leadSuit?: DominoSuit;
}

// Trick state (alias for Trick interface for story compliance)
export type TrickState = Trick;

/**
 * Validates if a value is a valid trick
 */
export function isValidTrick(value: unknown): value is Trick {
  if (!value || typeof value !== 'object') return false;

  const obj = value as Record<string, unknown>;
  const { id, dominoes, winner, leadSuit } = obj;

  // Check required fields
  if (typeof id !== 'string' || id.length === 0) return false;
  if (!Array.isArray(dominoes)) return false;

  // Check dominoes count (1-4 for Texas 42)
  if (dominoes.length === 0 || dominoes.length > 4) return false;

  // Validate each domino play
  for (const play of dominoes) {
    if (!play || typeof play !== 'object') return false;
    const playObj = play as Record<string, unknown>;
    if (!isValidDomino(playObj.domino)) return false;
    if (typeof playObj.playerId !== 'string' || playObj.playerId.length === 0) return false;
    if (!validatePlayerPosition(playObj.position)) return false;
  }

  // Optional fields validation
  if (winner !== undefined && (typeof winner !== 'string' || winner.length === 0)) return false;
  if (leadSuit !== undefined && !validateDominoSuit(leadSuit)) return false;

  return true;
}