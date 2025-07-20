/**
 * Texas 42 Bidding State Types
 */
import { Bid, SpecialContract } from './bidding';
/**
 * Bidding state for game management
 * Tracks the current bidding phase progress
 */
export interface BiddingState {
    /** Current player whose turn it is to bid */
    currentBidder?: string;
    /** Current highest bid */
    currentBid?: Bid;
    /** Complete history of all bids in this hand */
    bidHistory: Bid[];
    /** True when bidding phase is complete */
    biddingComplete: boolean;
    /** Number of consecutive passes */
    passCount: number;
    /** Minimum bid amount (always 30 in Texas 42) */
    minimumBid: number;
    /** True if forced bid variation is active */
    forcedBidActive: boolean;
    /** Active special contract if any */
    specialContractActive?: SpecialContract;
}
/**
 * Create empty bidding state
 *
 * @returns Empty bidding state
 */
export declare function createEmptyBiddingState(): BiddingState;
//# sourceMappingURL=bidding-state.d.ts.map