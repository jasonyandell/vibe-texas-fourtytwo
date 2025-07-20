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
export declare function convertBidToMarks(amount: number): number;
/**
 * Convert marks to bid amount
 *
 * @param marks Number of marks
 * @returns Bid amount (marks * 42)
 */
export declare function convertMarksToBid(marks: number): number;
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
//# sourceMappingURL=bidding-utils.d.ts.map