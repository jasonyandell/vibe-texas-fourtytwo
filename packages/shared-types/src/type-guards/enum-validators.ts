/**
 * Enum Validators
 * Runtime validation for enum types
 */

import { PlayerPosition } from '../player';
import { GamePhase } from '../game-state';
import { DominoSuit } from '../trump';

/**
 * Validates player position enum
 */
export function validatePlayerPosition(value: unknown): value is PlayerPosition {
  return typeof value === 'string' && ['north', 'east', 'south', 'west'].includes(value);
}

/**
 * Validates game phase enum
 */
export function validateGamePhase(value: unknown): value is GamePhase {
  return typeof value === 'string' && ['bidding', 'playing', 'scoring', 'finished'].includes(value);
}

/**
 * Validates domino suit enum
 */
export function validateDominoSuit(value: unknown): value is DominoSuit {
  return typeof value === 'string' &&
    ['blanks', 'ones', 'twos', 'threes', 'fours', 'fives', 'sixes', 'doubles'].includes(value);
}