"use strict";
/**
 * Texas 42 Bidding State Types
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmptyBiddingState = createEmptyBiddingState;
/**
 * Create empty bidding state
 *
 * @returns Empty bidding state
 */
function createEmptyBiddingState() {
    return {
        bidHistory: [],
        biddingComplete: false,
        passCount: 0,
        minimumBid: 30,
        forcedBidActive: false
    };
}
//# sourceMappingURL=bidding-state.js.map