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
/**
 * Create a pass bid
 *
 * @param playerId Player making the pass
 * @returns Pass bid object
 */
export declare function createPassBid(playerId: string): Bid;
/**
 * Create a regular point bid
 *
 * @param playerId Player making the bid
 * @param amount Bid amount (30-41)
 * @param trump Trump suit
 * @returns Regular bid object
 */
export declare function createRegularBid(playerId: string, amount: number, trump: DominoSuit): Bid;
/**
 * Create a mark bid
 *
 * @param playerId Player making the bid
 * @param marks Number of marks (1+ marks)
 * @param trump Trump suit
 * @returns Mark bid object
 */
export declare function createMarkBid(playerId: string, marks: number, trump: DominoSuit): Bid;
/**
 * Create a special contract bid
 *
 * @param playerId Player making the bid
 * @param contractType Type of special contract
 * @param doublesOption For no-trump contracts
 * @returns Special contract bid object
 */
export declare function createSpecialContractBid(playerId: string, contractType: SpecialContractType, doublesOption?: 'high' | 'low'): Bid;
/**
 * Get the bid amount for a special contract
 *
 * @param contractType Type of special contract
 * @returns Bid amount for the contract
 */
export declare function getSpecialContractAmount(contractType: SpecialContractType): number;
/**
 * Convert bid amount to marks
 *
 * @param amount Bid amount
 * @returns Number of marks (1 mark = 42 points)
 */
export declare function convertBidToMarks(amount: number): number;
/**
 * Convert marks to bid amount
 *
 * @param marks Number of marks
 * @returns Bid amount (marks * 42)
 */
export declare function convertMarksToBid(marks: number): number;
/**
 * Validate a bid
 *
 * @param bid The bid to validate
 * @param currentHighBid Current highest bid (if any)
 * @param biddingComplete Whether bidding is complete
 * @returns Validation result
 */
export declare function validateBid(bid: Bid, currentHighBid?: Bid, biddingComplete?: boolean): BidValidationResult;
/**
 * Validate a special contract bid
 *
 * @param contractType Type of special contract
 * @param bid The bid object
 * @returns Validation result
 */
export declare function validateSpecialContract(contractType: SpecialContractType, bid: Bid): BidValidationResult;
/**
 * Check if a bid is a pass
 *
 * @param bid The bid to check
 * @returns True if the bid is a pass
 */
export declare function isPassBid(bid: Bid): boolean;
/**
 * Check if a bid is a mark bid
 *
 * @param bid The bid to check
 * @returns True if the bid is for marks (42+ points)
 */
export declare function isMarkBid(bid: Bid): boolean;
/**
 * Get the minimum valid bid amount
 *
 * @param currentHighBid Current highest bid (if any)
 * @returns Minimum valid bid amount
 */
export declare function getMinimumBidAmount(currentHighBid?: Bid): number;
/**
 * Constants for the bidding system
 */
export declare const BIDDING_CONSTANTS: {
    /** Minimum bid amount */
    readonly MIN_BID: 30;
    /** Maximum regular bid amount */
    readonly MAX_REGULAR_BID: 41;
    /** Points per mark */
    readonly POINTS_PER_MARK: 42;
    /** Maximum marks that can be bid */
    readonly MAX_MARKS: 6;
    /** Maximum total bid amount */
    readonly MAX_BID: 252;
    /** Number of passes needed to end bidding */
    readonly PASSES_TO_END: 3;
    /** All special contract types */
    readonly SPECIAL_CONTRACTS: readonly ["nello", "plunge", "sevens", "follow-me"];
};
//# sourceMappingURL=bidding.d.ts.map