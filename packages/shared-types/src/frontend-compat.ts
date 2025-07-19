/**
 * Frontend Compatibility Layer
 * Provides compatibility types and functions for migrating from frontend types
 */

import {
  GameState as SharedGameState,
  Player,
  Trick,
  BiddingState,
  ScoringState,
  PartnershipState,
  PlayerPosition,
  GamePhase,
  LobbyGame,
  LobbyState,
  GameAction,
  ApiResponse,
  WebSocketMessage,
  PlayedDomino
} from './game-state';
import { Domino } from './dominoes';
import { DominoSuit } from './trump';
import { Bid } from './bidding';
import { isValidPlayer } from './type-guards';

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

/**
 * Legacy validation function for GameState
 */
export function isValidLegacyGameState(value: unknown): value is LegacyGameState {
  if (!value || typeof value !== 'object') return false;

  const obj = value as Record<string, unknown>;
  const {
    id, phase, players, dealer, tricks, scores, gameScore, boneyard, createdAt, updatedAt
  } = obj;

  // Check required fields
  if (typeof id !== 'string' || id.length === 0) return false;
  if (!['bidding', 'playing', 'scoring', 'finished'].includes(phase as string)) return false;
  if (!Array.isArray(players)) return false;
  if (typeof dealer !== 'string' || dealer.length === 0) return false;
  if (!Array.isArray(tricks)) return false;
  if (!Array.isArray(boneyard)) return false;
  if (typeof createdAt !== 'string') return false;
  if (typeof updatedAt !== 'string') return false;

  // Validate players (must be exactly 4 for Texas 42)
  if (players.length !== 4) return false;
  if (!players.every(player => isValidPlayer(player))) return false;

  // Check for unique positions (no duplicates)
  const positions = players.map((p: any) => p.position);
  const uniquePositions = new Set(positions);
  if (uniquePositions.size !== 4) return false;

  // Check that dealer is one of the player IDs
  const playerIds = players.map((p: any) => p.id);
  if (!playerIds.includes(dealer)) return false;

  // Validate scores
  if (!scores || typeof scores !== 'object') return false;
  const scoresObj = scores as Record<string, unknown>;
  if (typeof scoresObj.northSouth !== 'number' || typeof scoresObj.eastWest !== 'number') return false;
  if (!gameScore || typeof gameScore !== 'object') return false;
  const gameScoreObj = gameScore as Record<string, unknown>;
  if (typeof gameScoreObj.northSouth !== 'number' || typeof gameScoreObj.eastWest !== 'number') return false;

  return true;
}

/**
 * Factory function to create empty legacy game state
 */
export function createEmptyGameState(gameId: string): LegacyGameState {
  const now = new Date().toISOString();

  return {
    id: gameId,
    phase: 'bidding',
    players: [],
    dealer: '',
    tricks: [],
    scores: { northSouth: 0, eastWest: 0 },
    gameScore: { northSouth: 0, eastWest: 0 },
    boneyard: [],
    createdAt: now,
    updatedAt: now
  };
}

// Re-export all other types and functions for compatibility
export type {
  Player,
  Trick,
  BiddingState,
  ScoringState,
  PartnershipState,
  PlayerPosition,
  GamePhase,
  LobbyGame,
  LobbyState,
  GameAction,
  ApiResponse,
  WebSocketMessage
};

export type { Domino } from './dominoes';
export type { DominoSuit } from './trump';
export type { Bid } from './bidding';

// Re-export validation functions
export {
  isValidPlayer,
  isValidBid,
  isValidTrick,
  isValidBiddingState,
  isValidScoringState,
  isValidLobbyState,
  validatePlayerPosition,
  validateGamePhase,
  validateDominoSuit
} from './type-guards';

// Re-export factory functions
export {
  createEmptyLobbyState,
  createEmptyBiddingState,
  createEmptyScoringState
} from './game-state';

// Re-export domino functions
export {
  calculateDominoPointValue,
  isCountDomino,
  createDomino,
  createFullDominoSet
} from './dominoes';

// ============================================================================
// Helper Functions for Frontend Compatibility
// ============================================================================

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
