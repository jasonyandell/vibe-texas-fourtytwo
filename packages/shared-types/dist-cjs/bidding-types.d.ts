/**
 * Texas 42 Bidding System Types
 * Core type definitions for the bidding system
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
export declare enum BiddingValidationError {
    BID_TOO_LOW = "BID_TOO_LOW",
    BID_TOO_HIGH = "BID_TOO_HIGH",
    BID_NOT_HIGHER = "BID_NOT_HIGHER",
    NOT_CURRENT_BIDDER = "NOT_CURRENT_BIDDER",
    INVALID_TRUMP_SUIT = "INVALID_TRUMP_SUIT",
    BIDDING_COMPLETE = "BIDDING_COMPLETE",
    MISSING_TRUMP = "MISSING_TRUMP",
    INVALID_SPECIAL_CONTRACT = "INVALID_SPECIAL_CONTRACT",
    INSUFFICIENT_DOUBLES_FOR_PLUNGE = "INSUFFICIENT_DOUBLES_FOR_PLUNGE",
    INVALID_MARK_BID = "INVALID_MARK_BID"
}
//# sourceMappingURL=bidding-types.d.ts.map