/**
 * Texas 42 Game State Types
 * Enhanced game state with complete rule compliance and marks system
 */
import { Domino } from './dominoes';
import { DominoSuit } from './trump';
import { Bid, SpecialContract } from './bidding';
import { Player } from './player';
import { PartnershipState, PartnershipMarks, PartnershipScore, PartnershipTeam } from './partnership';
import { Trick } from './trick';
import { HandScore, ScoringState } from './scoring';
import { BiddingState } from './bidding-state';
/**
 * Game phases in Texas 42
 */
export type GamePhase = 'bidding' | 'playing' | 'scoring' | 'finished';
/**
 * Complete game state
 * Enhanced with marks system and rule compliance
 */
export interface GameState {
    /** Unique game identifier */
    id: string;
    /** Current game phase */
    phase: GamePhase;
    /** All players in the game */
    players: Player[];
    /** Partnership information */
    partnerships: PartnershipState;
    /** Current hand number */
    handNumber: number;
    /** Current dealer */
    dealer: string;
    /** Current player (whose turn it is) */
    currentPlayer?: string;
    /** Complete bidding state */
    biddingState: BiddingState;
    /** Current highest bid */
    currentBid?: Bid;
    /** Active special contract */
    specialContract?: SpecialContract;
    /** Current trump suit */
    trump?: DominoSuit;
    /** All completed tricks */
    tricks: Trick[];
    /** Current trick being played */
    currentTrick?: Trick;
    /** Remaining dominoes (boneyard) */
    boneyard: Domino[];
    /** Current hand scoring */
    scoringState: ScoringState;
    /** All completed hand scores */
    handScores: HandScore[];
    /** Current marks for each partnership */
    marks: PartnershipMarks;
    /** Total game scores (for point-based games) */
    gameScore: PartnershipScore;
    /** Marks needed to win (typically 7) */
    marksToWin: number;
    /** True if game is complete */
    gameComplete: boolean;
    /** Winning partnership if game is complete */
    winner?: PartnershipTeam;
    /** Game creation timestamp */
    createdAt: string;
    /** Last update timestamp */
    updatedAt: string;
    /** True if game state is valid */
    isValid: boolean;
    /** Validation errors if any */
    validationErrors: string[];
}
/**
 * Create an empty game state
 *
 * @param gameId Game identifier
 * @returns Empty game state with default values
 */
export declare function createEmptyGameState(gameId: string): GameState;
//# sourceMappingURL=game-state.d.ts.map