/**
 * Compatibility Helpers
 * Helper functions for creating compatible objects
 */

import { Bid } from './bidding';
import { BiddingState } from './bidding-state';
import { Domino } from './dominoes';
import { PlayerPosition } from './player';
import { DominoSuit } from './trump';
import { Trick, PlayedDomino } from './trick';

/**
 * Create a compatible Bid object for frontend use
 */
export function createCompatibleBid(playerId: string, amount: number, trump?: DominoSuit): Bid {
  return {
    playerId,
    amount,
    trump,
    isSpecialContract: false,
    timestamp: new Date().toISOString()
  };
}

/**
 * Create a compatible PlayedDomino object for frontend use
 */
export function createCompatiblePlayedDomino(
  domino: Domino,
  playerId: string,
  position: PlayerPosition,
  playOrder: number = 0
) {
  return {
    domino,
    playerId,
    position,
    playOrder,
    timestamp: new Date().toISOString()
  };
}

/**
 * Create a compatible BiddingState object for frontend use
 */
export function createCompatibleBiddingState(overrides: Partial<BiddingState> = {}): BiddingState {
  return {
    bidHistory: [],
    biddingComplete: false,
    passCount: 0,
    minimumBid: 30,
    forcedBidActive: false,
    ...overrides
  };
}

/**
 * Create a compatible Trick object for frontend use
 */
export function createCompatibleTrick(
  id: string,
  dominoes: PlayedDomino[] = [],
  trickNumber: number = 1,
  overrides: Partial<Trick> = {}
): Trick {
  const pointValue = dominoes.reduce((sum, played) => sum + played.domino.pointValue, 0);
  const countDominoes = dominoes
    .filter(played => played.domino.isCountDomino)
    .map(played => played.domino);

  return {
    id,
    dominoes,
    pointValue,
    countDominoes,
    trickNumber,
    isComplete: dominoes.length === 4,
    ...overrides
  };
}