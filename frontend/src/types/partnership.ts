/**
 * Partnership Types
 * Types and validation for Texas 42 partnerships (North-South vs East-West)
 */

import type { Bid } from './bidding';
import type { Player } from './player';
import { isValidBid } from './bidding';

// Partnership state for Texas 42 (North-South vs East-West)
export interface PartnershipState {
  northSouth: {
    players: [string, string]; // [north player id, south player id]
    score: number;
    gameScore: number;
    tricksWon: number;
    currentBid?: Bid;
  };
  eastWest: {
    players: [string, string]; // [east player id, west player id]
    score: number;
    gameScore: number;
    tricksWon: number;
    currentBid?: Bid;
  };
}

/**
 * Validates if a value is a valid partnership state
 */
export function isValidPartnershipState(value: unknown): value is PartnershipState {
  if (!value || typeof value !== 'object') return false;

  const obj = value as Record<string, unknown>;
  const { northSouth, eastWest } = obj;

  // Check both partnerships exist
  if (!northSouth || !eastWest) return false;

  // Validate each partnership
  for (const partnership of [northSouth, eastWest]) {
    if (typeof partnership !== 'object') return false;

    const partnershipObj = partnership as Record<string, unknown>;
    const { players, score, gameScore, tricksWon } = partnershipObj;

    // Check required fields
    if (!Array.isArray(players) || players.length !== 2) return false;
    if (!players.every(p => typeof p === 'string' && p.length > 0)) return false;
    if (typeof score !== 'number' || score < 0) return false;
    if (typeof gameScore !== 'number' || gameScore < 0) return false;
    if (typeof tricksWon !== 'number' || tricksWon < 0) return false;

    // Optional bid validation
    if (partnershipObj.currentBid !== undefined && !isValidBid(partnershipObj.currentBid)) return false;
  }

  return true;
}

/**
 * Creates an empty partnership state with default values
 */
export function createEmptyPartnershipState(players: Player[]): PartnershipState {
  // Find players by position
  const northPlayer = players.find(p => p.position === 'north')?.id || '';
  const southPlayer = players.find(p => p.position === 'south')?.id || '';
  const eastPlayer = players.find(p => p.position === 'east')?.id || '';
  const westPlayer = players.find(p => p.position === 'west')?.id || '';

  return {
    northSouth: {
      players: [northPlayer, southPlayer],
      score: 0,
      gameScore: 0,
      tricksWon: 0
    },
    eastWest: {
      players: [eastPlayer, westPlayer],
      score: 0,
      gameScore: 0,
      tricksWon: 0
    }
  };
}