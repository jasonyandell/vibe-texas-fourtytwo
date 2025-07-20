/**
 * Texas 42 Bidding Utility Functions and Constants
 * Helper functions and constants for the bidding system
 */

import { Bid } from './bidding-types';

/**
 * Convert bid amount to marks
 * 
 * @param amount Bid amount
 * @returns Number of marks (1 mark = 42 points)
 */
export function convertBidToMarks(amount: number): number {
  if (amount < 42) return 0;
  return Math.floor(amount / 42);
}

/**
 * Convert marks to bid amount
 * 
 * @param marks Number of marks
 * @returns Bid amount (marks * 42)
 */
export function convertMarksToBid(marks: number): number {
  return marks * 42;
}

/**
 * Check if a bid is a pass
 * 
 * @param bid The bid to check
 * @returns True if the bid is a pass
 */
export function isPassBid(bid: Bid): boolean {
  return bid.amount === 0;
}

/**
 * Check if a bid is a mark bid
 * 
 * @param bid The bid to check
 * @returns True if the bid is for marks (42+ points)
 */
export function isMarkBid(bid: Bid): boolean {
  return bid.amount >= 42 || (bid.marks !== undefined && bid.marks > 0);
}

/**
 * Get the minimum valid bid amount
 * 
 * @param currentHighBid Current highest bid (if any)
 * @returns Minimum valid bid amount
 */
export function getMinimumBidAmount(currentHighBid?: Bid): number {
  if (!currentHighBid || currentHighBid.amount === 0) {
    return 30; // Minimum opening bid
  }
  return currentHighBid.amount + 1;
}

/**
 * Constants for the bidding system
 */
export const BIDDING_CONSTANTS = {
  /** Minimum bid amount */
  MIN_BID: 30,
  /** Maximum regular bid amount */
  MAX_REGULAR_BID: 41,
  /** Points per mark */
  POINTS_PER_MARK: 42,
  /** Maximum marks that can be bid */
  MAX_MARKS: 6,
  /** Maximum total bid amount */
  MAX_BID: 252, // 6 marks * 42 points
  /** Number of passes needed to end bidding */
  PASSES_TO_END: 3,
  /** All special contract types */
  SPECIAL_CONTRACTS: ['nello', 'plunge', 'sevens', 'follow-me'] as const
} as const;