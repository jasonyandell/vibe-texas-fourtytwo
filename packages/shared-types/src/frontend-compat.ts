/**
 * Frontend Compatibility Layer
 * Provides compatibility types and functions for migrating from frontend types
 */

// Import types for re-export
import type { Player, PlayerPosition } from './player';
import type { Trick } from './trick';
import type { BiddingState } from './bidding-state';
import type { ScoringState } from './scoring';
import type { PartnershipState } from './partnership';
import type { GamePhase } from './game-state';
import type { LobbyGame, LobbyState } from './lobby';
import type { GameAction } from './actions';
import type { ApiResponse, WebSocketMessage } from './api';

// Re-export legacy types
export type { LegacyGameState } from './legacy-types';

// Re-export converters
export { 
  convertToLegacyGameState, 
  convertFromLegacyGameState 
} from './legacy-converters';

// Re-export validators and factories
export { 
  isValidLegacyGameState,
  createEmptyGameState 
} from './legacy-validators';

// Re-export compatibility helpers
export {
  createCompatibleBid,
  createCompatiblePlayedDomino,
  createCompatibleBiddingState,
  createCompatibleTrick
} from './compatibility-helpers';

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
export { createEmptyLobbyState } from './lobby';
export { createEmptyBiddingState } from './bidding-state';
export { createEmptyScoringState } from './scoring';

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

