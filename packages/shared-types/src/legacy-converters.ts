/**
 * Legacy Converters
 * Functions to convert between shared and legacy formats
 */

import { GameState as SharedGameState } from './game-state';
import { LegacyGameState } from './legacy-types';

/**
 * Convert shared GameState to legacy format for frontend compatibility
 */
export function convertToLegacyGameState(sharedState: SharedGameState): LegacyGameState {
  return {
    id: sharedState.id,
    phase: sharedState.phase,
    players: sharedState.players,
    currentPlayer: sharedState.currentPlayer,
    dealer: sharedState.dealer,
    bidder: sharedState.currentBid?.playerId,
    currentBid: sharedState.currentBid,
    trump: sharedState.trump,
    tricks: sharedState.tricks,
    currentTrick: sharedState.currentTrick,
    scores: {
      northSouth: sharedState.partnerships.northSouth.currentHandScore,
      eastWest: sharedState.partnerships.eastWest.currentHandScore
    },
    gameScore: sharedState.gameScore,
    boneyard: sharedState.boneyard,
    biddingState: sharedState.biddingState,
    scoringState: sharedState.scoringState,
    partnershipState: sharedState.partnerships,
    createdAt: sharedState.createdAt,
    updatedAt: sharedState.updatedAt
  };
}

/**
 * Convert legacy GameState to shared format
 */
export function convertFromLegacyGameState(legacyState: LegacyGameState): SharedGameState {
  return {
    id: legacyState.id,
    phase: legacyState.phase,
    players: legacyState.players,
    partnerships: legacyState.partnershipState || {
      northSouth: {
        players: ['', ''],
        currentHandScore: legacyState.scores.northSouth,
        marks: 0,
        totalGameScore: legacyState.gameScore.northSouth,
        tricksWon: 0,
        isBiddingTeam: false
      },
      eastWest: {
        players: ['', ''],
        currentHandScore: legacyState.scores.eastWest,
        marks: 0,
        totalGameScore: legacyState.gameScore.eastWest,
        tricksWon: 0,
        isBiddingTeam: false
      }
    },
    handNumber: 1,
    dealer: legacyState.dealer,
    currentPlayer: legacyState.currentPlayer,
    biddingState: legacyState.biddingState || {
      bidHistory: [],
      biddingComplete: false,
      passCount: 0,
      minimumBid: 30,
      forcedBidActive: false
    },
    currentBid: legacyState.currentBid,
    trump: legacyState.trump,
    tricks: legacyState.tricks,
    currentTrick: legacyState.currentTrick,
    boneyard: legacyState.boneyard,
    scoringState: legacyState.scoringState || {
      trickPoints: 0,
      countDominoes: [],
      bonusPoints: 0,
      penaltyPoints: 0,
      roundComplete: false
    },
    handScores: [],
    marks: {
      northSouth: legacyState.partnershipState?.northSouth.marks || 0,
      eastWest: legacyState.partnershipState?.eastWest.marks || 0
    },
    gameScore: legacyState.gameScore,
    marksToWin: 7,
    gameComplete: false,
    createdAt: legacyState.createdAt,
    updatedAt: legacyState.updatedAt,
    isValid: true,
    validationErrors: []
  };
}