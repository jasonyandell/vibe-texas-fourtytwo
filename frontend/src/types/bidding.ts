/**
 * Bidding Types
 * Bidding-related types and validation for Texas 42
 */

import type { DominoSuit } from './domino';
import { validateDominoSuit } from './domino';

// Bid information
export interface Bid {
  playerId: string;
  amount: number;  // 30-42 or pass (0)
  trump?: DominoSuit;
}

// Bidding state
export interface BiddingState {
  currentBidder?: string;
  currentBid?: Bid;
  bidHistory: Bid[];
  biddingComplete: boolean;
  passCount: number;
  minimumBid: number;
}

/**
 * Validates if a value is a valid bid
 */
export function isValidBid(value: unknown): value is Bid {
  if (!value || typeof value !== 'object') return false;

  const obj = value as Record<string, unknown>;
  const { playerId, amount, trump } = obj;

  // Check required fields
  if (typeof playerId !== 'string' || playerId.length === 0) return false;
  if (typeof amount !== 'number') return false;

  // Pass bid (amount = 0)
  if (amount === 0) {
    // Pass bids should not have trump
    return trump === undefined;
  }

  // Regular bid validation
  if (amount < 30 || amount > 42) return false;

  // Non-pass bids must have trump
  if (!trump || !validateDominoSuit(trump)) return false;

  return true;
}

/**
 * Validates if a value is a valid bidding state
 */
export function isValidBiddingState(value: unknown): value is BiddingState {
  if (!value || typeof value !== 'object') return false;

  const obj = value as Record<string, unknown>;
  const { bidHistory, biddingComplete, passCount, minimumBid, currentBidder, currentBid } = obj;

  // Check required fields
  if (!Array.isArray(bidHistory)) return false;
  if (typeof biddingComplete !== 'boolean') return false;
  if (typeof passCount !== 'number' || passCount < 0) return false;
  if (typeof minimumBid !== 'number' || minimumBid < 30) return false;

  // Validate bid history
  if (!bidHistory.every((bid: unknown) => isValidBid(bid))) return false;

  // Optional fields
  if (currentBidder !== undefined && typeof currentBidder !== 'string') return false;
  if (currentBid !== undefined && !isValidBid(currentBid)) return false;

  return true;
}

/**
 * Creates an empty bidding state with default values
 */
export function createEmptyBiddingState(): BiddingState {
  return {
    bidHistory: [],
    biddingComplete: false,
    passCount: 0,
    minimumBid: 30
  };
}