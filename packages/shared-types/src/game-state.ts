/**
 * Texas 42 Game State Types
 * Enhanced game state with complete rule compliance and marks system
 */

import { Domino } from './dominoes';
import { DominoSuit } from './trump';
import { Bid, SpecialContract } from './bidding';
import { Player } from './player';
import { PartnershipState, PartnershipMarks, PartnershipScore, PartnershipTeam, createEmptyPartnershipState } from './partnership';
import { Trick } from './trick';
import { HandScore, ScoringState, createEmptyScoringState } from './scoring';
import { BiddingState, createEmptyBiddingState } from './bidding-state';

/**
 * Game phases in Texas 42
 */
export type GamePhase = 'bidding' | 'playing' | 'scoring' | 'finished';

/**
 * Complete game state
 * Enhanced with marks system and rule compliance
 */
export interface GameState {
  // Core identification
  /** Unique game identifier */
  id: string;
  /** Current game phase */
  phase: GamePhase;
  
  // Players and partnerships
  /** All players in the game */
  players: Player[];
  /** Partnership information */
  partnerships: PartnershipState;
  
  // Game progression
  /** Current hand number */
  handNumber: number;
  /** Current dealer */
  dealer: string;
  /** Current player (whose turn it is) */
  currentPlayer?: string;
  
  // Bidding state
  /** Complete bidding state */
  biddingState: BiddingState;
  /** Current highest bid */
  currentBid?: Bid;
  /** Active special contract */
  specialContract?: SpecialContract;
  
  // Playing state
  /** Current trump suit */
  trump?: DominoSuit;
  /** All completed tricks */
  tricks: Trick[];
  /** Current trick being played */
  currentTrick?: Trick;
  /** Remaining dominoes (boneyard) */
  boneyard: Domino[];
  
  // Scoring state
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
  
  // Game completion
  /** True if game is complete */
  gameComplete: boolean;
  /** Winning partnership if game is complete */
  winner?: PartnershipTeam;
  
  // Metadata
  /** Game creation timestamp */
  createdAt: string;
  /** Last update timestamp */
  updatedAt: string;
  
  // Validation
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
export function createEmptyGameState(gameId: string): GameState {
  const now = new Date().toISOString();

  return {
    id: gameId,
    phase: 'bidding',
    players: [],
    partnerships: createEmptyPartnershipState(),
    handNumber: 1,
    dealer: '',
    biddingState: createEmptyBiddingState(),
    tricks: [],
    boneyard: [],
    scoringState: createEmptyScoringState(),
    handScores: [],
    marks: { northSouth: 0, eastWest: 0 },
    gameScore: { northSouth: 0, eastWest: 0 },
    marksToWin: 7,
    gameComplete: false,
    createdAt: now,
    updatedAt: now,
    isValid: true,
    validationErrors: []
  };
}

