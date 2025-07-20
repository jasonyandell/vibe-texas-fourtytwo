/**
 * Texas 42 Scoring Types
 */
import { Domino } from './dominoes';
import { Bid, SpecialContract } from './bidding';
import { PartnershipTeam } from './partnership';
/**
 * Hand scoring information
 * Tracks points and marks for a completed hand
 */
export interface HandScore {
    /** Hand number */
    handNumber: number;
    /** Points from count dominoes */
    countPoints: number;
    /** Points from tricks won (1 per trick) */
    trickPoints: number;
    /** Total points scored */
    totalPoints: number;
    /** Team that was bidding */
    biddingTeam: PartnershipTeam;
    /** The winning bid for this hand */
    winningBid: Bid;
    /** True if the bid was fulfilled */
    bidFulfilled: boolean;
    /** Marks awarded to bidding team */
    marksAwarded: number;
    /** Marks awarded to opposing team */
    opposingMarksAwarded: number;
    /** Special contract if any */
    specialContract?: SpecialContract;
}
/**
 * Enhanced scoring state
 * Tracks current hand scoring progress
 */
export interface ScoringState {
    /** Current trick winner */
    currentTrickWinner?: string;
    /** Points from tricks (1 per trick) */
    trickPoints: number;
    /** Count dominoes captured so far */
    countDominoes: Domino[];
    /** Bonus points if any */
    bonusPoints: number;
    /** Penalty points if any */
    penaltyPoints: number;
    /** True if hand scoring is complete */
    roundComplete: boolean;
    /** Calculated hand score */
    handScore?: HandScore;
}
/**
 * Create empty scoring state
 *
 * @returns Empty scoring state
 */
export declare function createEmptyScoringState(): ScoringState;
//# sourceMappingURL=scoring.d.ts.map