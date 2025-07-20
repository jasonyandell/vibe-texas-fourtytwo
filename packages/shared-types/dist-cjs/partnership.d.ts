/**
 * Texas 42 Partnership Types
 */
import { SpecialContract } from './bidding';
/**
 * Partnership teams
 */
export type PartnershipTeam = 'northSouth' | 'eastWest';
/**
 * Partnership information
 * Enhanced with marks and game scoring
 */
export interface Partnership {
    /** Player IDs in this partnership */
    players: [string, string];
    /** Current hand score */
    currentHandScore: number;
    /** Total marks accumulated */
    marks: number;
    /** Total game score (for point-based games) */
    totalGameScore: number;
    /** Tricks won in current hand */
    tricksWon: number;
    /** True if this partnership is currently bidding */
    isBiddingTeam: boolean;
    /** Active special contract if any */
    specialContractActive?: SpecialContract;
}
/**
 * Partnership state for both teams
 */
export interface PartnershipState {
    /** North-South partnership */
    northSouth: Partnership;
    /** East-West partnership */
    eastWest: Partnership;
}
/**
 * Partnership marks tracking
 */
export interface PartnershipMarks {
    /** North-South marks */
    northSouth: number;
    /** East-West marks */
    eastWest: number;
}
/**
 * Partnership scores (for point-based games)
 */
export interface PartnershipScore {
    /** North-South total score */
    northSouth: number;
    /** East-West total score */
    eastWest: number;
}
/**
 * Create empty partnership state
 *
 * @returns Empty partnership state
 */
export declare function createEmptyPartnershipState(): PartnershipState;
//# sourceMappingURL=partnership.d.ts.map