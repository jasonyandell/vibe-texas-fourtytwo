/**
 * Player Types
 * Player-related types and validation for Texas 42
 */

import type { Domino } from './domino';
import { isValidDomino } from './domino';

// Player positions in Texas 42 (partnerships: North-South, East-West)
export type PlayerPosition = 'north' | 'east' | 'south' | 'west';

// Player information
export interface Player {
  id: string;
  name: string;
  position: PlayerPosition;
  hand: Domino[];
  isConnected: boolean;
  isReady: boolean;
}

// Player state (alias for Player interface for story compliance)
export type PlayerState = Player;

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

/**
 * Validates player position enum
 */
export function validatePlayerPosition(value: unknown): value is PlayerPosition {
  return typeof value === 'string' && ['north', 'east', 'south', 'west'].includes(value);
}