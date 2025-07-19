/**
 * Texas 42 Bidding System Types
 * Enhanced bidding types with special contracts and mark system
 */

import { DominoSuit } from './trump';

/**
 * Special contract types in Texas 42
 * Based on rules research for authentic gameplay
 */
export type SpecialContractType = 'nello' | 'plunge' | 'sevens' | 'follow-me';

/**
 * Enhanced bid interface with special contracts
 * Supports both point bids (30-41) and mark bids (42+)
 */
export interface Bid {
  /** Player making the bid */
  playerId: string;
  /** Bid amount: 30-41 for point bids, 0 for pass */
  amount: number;
  /** Mark-based bidding: 1+ marks (1 mark = 42 points) */
  marks?: number;
  /** Chosen trump suit (required for non-pass bids) */
  trump?: DominoSuit;
  /** True if this is a special contract bid */
  isSpecialContract: boolean;
  /** Type of special contract if applicable */
  contractType?: SpecialContractType;
  /** For no-trump contracts: whether doubles are high or low */
  doublesOption?: 'high' | 'low';
  /** Timestamp when bid was placed */
  timestamp: string;
}

/**
 * Special contract configuration
 * Defines rules and requirements for special bids
 */
export interface SpecialContract {
  /** Type of special contract */
  type: SpecialContractType;
  /** Player who bid the contract */
  bidder: string;
  /** Partner player (may sit out in some contracts) */
  partner?: string;
  /** Requirements to bid this contract */
  requirements: string[];
  /** Special scoring rules for this contract */
  scoringRules: string[];
  /** Whether partner participates */
  partnerParticipates: boolean;
}



/**
 * Bid validation result
 * Used for validating bid attempts
 */
export interface BidValidationResult {
  /** True if the bid is valid */
  isValid: boolean;
  /** Error message if bid is invalid */
  error?: string;
  /** Warning message for valid but risky bids */
  warning?: string;
}

/**
 * Bidding validation errors
 * Enumeration of possible bid validation failures
 */
export enum BiddingValidationError {
  BID_TOO_LOW = 'BID_TOO_LOW',
  BID_TOO_HIGH = 'BID_TOO_HIGH',
  BID_NOT_HIGHER = 'BID_NOT_HIGHER',
  NOT_CURRENT_BIDDER = 'NOT_CURRENT_BIDDER',
  INVALID_TRUMP_SUIT = 'INVALID_TRUMP_SUIT',
  BIDDING_COMPLETE = 'BIDDING_COMPLETE',
  MISSING_TRUMP = 'MISSING_TRUMP',
  INVALID_SPECIAL_CONTRACT = 'INVALID_SPECIAL_CONTRACT',
  INSUFFICIENT_DOUBLES_FOR_PLUNGE = 'INSUFFICIENT_DOUBLES_FOR_PLUNGE',
  INVALID_MARK_BID = 'INVALID_MARK_BID'
}

/**
 * Create a pass bid
 * 
 * @param playerId Player making the pass
 * @returns Pass bid object
 */
export function createPassBid(playerId: string): Bid {
  return {
    playerId,
    amount: 0,
    isSpecialContract: false,
    timestamp: new Date().toISOString()
  };
}

/**
 * Create a regular point bid
 * 
 * @param playerId Player making the bid
 * @param amount Bid amount (30-41)
 * @param trump Trump suit
 * @returns Regular bid object
 */
export function createRegularBid(playerId: string, amount: number, trump: DominoSuit): Bid {
  return {
    playerId,
    amount,
    trump,
    isSpecialContract: false,
    timestamp: new Date().toISOString()
  };
}

/**
 * Create a mark bid
 * 
 * @param playerId Player making the bid
 * @param marks Number of marks (1+ marks)
 * @param trump Trump suit
 * @returns Mark bid object
 */
export function createMarkBid(playerId: string, marks: number, trump: DominoSuit): Bid {
  return {
    playerId,
    amount: marks * 42, // 1 mark = 42 points
    marks,
    trump,
    isSpecialContract: false,
    timestamp: new Date().toISOString()
  };
}

/**
 * Create a special contract bid
 * 
 * @param playerId Player making the bid
 * @param contractType Type of special contract
 * @param doublesOption For no-trump contracts
 * @returns Special contract bid object
 */
export function createSpecialContractBid(
  playerId: string, 
  contractType: SpecialContractType,
  doublesOption?: 'high' | 'low'
): Bid {
  return {
    playerId,
    amount: getSpecialContractAmount(contractType),
    isSpecialContract: true,
    contractType,
    doublesOption,
    timestamp: new Date().toISOString()
  };
}

/**
 * Get the bid amount for a special contract
 * 
 * @param contractType Type of special contract
 * @returns Bid amount for the contract
 */
export function getSpecialContractAmount(contractType: SpecialContractType): number {
  switch (contractType) {
    case 'nello': return 42; // 1 mark
    case 'plunge': return 168; // 4 marks minimum
    case 'sevens': return 42; // 1 mark
    case 'follow-me': return 42; // 1 mark
    default: return 42;
  }
}

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
 * Validate a bid
 *
 * @param bid The bid to validate
 * @param currentHighBid Current highest bid (if any)
 * @param biddingComplete Whether bidding is complete
 * @returns Validation result
 */
export function validateBid(
  bid: Bid,
  currentHighBid?: Bid,
  biddingComplete?: boolean
): BidValidationResult {
  // Check if bidding is complete
  if (biddingComplete) {
    return {
      isValid: false,
      error: 'Bidding phase is already complete'
    };
  }

  // Check if it's a pass bid
  if (bid.amount === 0) {
    return { isValid: true };
  }

  // Validate bid amount range
  if (bid.amount < 30 || bid.amount > 252) { // Max is 6 marks (6 * 42)
    return {
      isValid: false,
      error: 'Bid amount must be between 30-252 or 0 (pass)'
    };
  }

  // Check if bid is higher than current bid
  if (currentHighBid && currentHighBid.amount > 0 && bid.amount <= currentHighBid.amount) {
    return {
      isValid: false,
      error: 'Bid must be higher than current bid'
    };
  }

  // Non-pass bids must have trump (except special contracts)
  if (!bid.isSpecialContract && !bid.trump) {
    return {
      isValid: false,
      error: 'Must select trump suit for regular bids'
    };
  }

  // Validate special contracts
  if (bid.isSpecialContract && bid.contractType) {
    const contractValidation = validateSpecialContract(bid.contractType, bid);
    if (!contractValidation.isValid) {
      return contractValidation;
    }
  }

  return { isValid: true };
}

/**
 * Validate a special contract bid
 * 
 * @param contractType Type of special contract
 * @param bid The bid object
 * @returns Validation result
 */
export function validateSpecialContract(
  contractType: SpecialContractType, 
  bid: Bid
): BidValidationResult {
  switch (contractType) {
    case 'nello':
      // Nello can be bid by any player
      return { isValid: true };
      
    case 'plunge':
      // Plunge requires minimum 4 marks
      if (bid.amount < 168) {
        return {
          isValid: false,
          error: 'Plunge requires minimum 4 marks (168 points)'
        };
      }
      return { isValid: true };
      
    case 'sevens':
      // Sevens can be bid by any player
      return { isValid: true };
      
    case 'follow-me':
      // Follow Me (no trump) can be bid by any player
      if (!bid.doublesOption) {
        return {
          isValid: false,
          error: 'Follow Me requires doubles option (high or low)'
        };
      }
      return { isValid: true };
      
    default:
      return {
        isValid: false,
        error: `Unknown special contract type: ${contractType}`
      };
  }
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
