/**
 * Player Type Guards
 * Runtime validation for player-related types
 */

import { isValidDomino } from '../dominoes';
import { validatePlayerPosition } from './enum-validators';
import { Player } from '../player';

/**
 * Validates if a value is a valid player
 */
export function isValidPlayer(value: unknown): value is Player {
  if (!value || typeof value !== 'object') return false;

  const obj = value as Record<string, unknown>;
  const { id, name, position, hand, isConnected, isReady } = obj;

  // Check required fields
  if (typeof id !== 'string' || id.length === 0) return false;
  if (typeof name !== 'string' || name.length === 0) return false;
  if (!validatePlayerPosition(position)) return false;
  if (!Array.isArray(hand)) return false;
  if (typeof isConnected !== 'boolean') return false;
  if (typeof isReady !== 'boolean') return false;

  // Validate all dominoes in hand
  if (!hand.every(domino => isValidDomino(domino))) return false;

  return true;
}