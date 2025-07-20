"use strict";
/**
 * Texas 42 Bidding Utility Functions and Constants
 * Helper functions and constants for the bidding system
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BIDDING_CONSTANTS = void 0;
exports.convertBidToMarks = convertBidToMarks;
exports.convertMarksToBid = convertMarksToBid;
exports.isPassBid = isPassBid;
exports.isMarkBid = isMarkBid;
exports.getMinimumBidAmount = getMinimumBidAmount;
/**
 * Convert bid amount to marks
 *
 * @param amount Bid amount
 * @returns Number of marks (1 mark = 42 points)
 */
function convertBidToMarks(amount) {
    if (amount < 42)
        return 0;
    return Math.floor(amount / 42);
}
/**
 * Convert marks to bid amount
 *
 * @param marks Number of marks
 * @returns Bid amount (marks * 42)
 */
function convertMarksToBid(marks) {
    return marks * 42;
}
/**
 * Check if a bid is a pass
 *
 * @param bid The bid to check
 * @returns True if the bid is a pass
 */
function isPassBid(bid) {
    return bid.amount === 0;
}
/**
 * Check if a bid is a mark bid
 *
 * @param bid The bid to check
 * @returns True if the bid is for marks (42+ points)
 */
function isMarkBid(bid) {
    return bid.amount >= 42 || (bid.marks !== undefined && bid.marks > 0);
}
/**
 * Get the minimum valid bid amount
 *
 * @param currentHighBid Current highest bid (if any)
 * @returns Minimum valid bid amount
 */
function getMinimumBidAmount(currentHighBid) {
    if (!currentHighBid || currentHighBid.amount === 0) {
        return 30; // Minimum opening bid
    }
    return currentHighBid.amount + 1;
}
/**
 * Constants for the bidding system
 */
exports.BIDDING_CONSTANTS = {
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
    SPECIAL_CONTRACTS: ['nello', 'plunge', 'sevens', 'follow-me']
};
//# sourceMappingURL=bidding-utils.js.map