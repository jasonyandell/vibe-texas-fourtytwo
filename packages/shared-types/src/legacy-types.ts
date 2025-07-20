/**
 * Legacy Types
 * Defines legacy interfaces for frontend compatibility
 */

import { GamePhase } from './game-state';
import { Player } from './player';
import { Trick } from './trick';
import { BiddingState } from './bidding-state';
import { ScoringState } from './scoring';
import { PartnershipState } from './partnership';
import { Domino } from './dominoes';
import { DominoSuit } from './trump';
import { Bid } from './bidding';

/**
 * Legacy GameState interface for frontend compatibility
 * This matches the structure expected by the existing frontend code
 */
export interface LegacyGameState {
  id: string;
  phase: GamePhase;
  players: Player[];
  currentPlayer?: string;
  dealer: string;
  bidder?: string;
  currentBid?: Bid;
  trump?: DominoSuit;
  tricks: Trick[];
  currentTrick?: Trick;
  scores: {
    northSouth: number;
    eastWest: number;
  };
  gameScore: {
    northSouth: number;
    eastWest: number;
  };
  boneyard: Domino[];
  biddingState?: BiddingState;
  scoringState?: ScoringState;
  partnershipState?: PartnershipState;
  createdAt: string;
  updatedAt: string;
}