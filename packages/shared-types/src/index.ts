/**
 * Texas 42 Shared Types Package
 * Main export file for all shared types and utilities
 */

// ============================================================================
// Domino Types and Utilities
// ============================================================================
export type {
  Domino,
  DominoSet
} from './dominoes';

export {
  calculateDominoPointValue,
  isCountDomino,
  isCountDominoByValues,
  createFullDominoSet,
  getCountDominoes,
  calculateTotalPoints,
  isValidDominoSet,
  DOMINO_CONSTANTS
} from './dominoes';

// ============================================================================
// Trump System Types and Utilities
// ============================================================================
export type {
  DominoSuit,
  TrumpSystem,
  DominoSuitMapping,
  TrumpHierarchy,
  NoTrumpConfig
} from './trump';

export {
  getSuitValue,
  getSuitName,
  getDominoSuits,
  isTrumpDomino,
  getTrumpRank,
  compareTrumpDominoes,
  compareNonTrumpDominoes,
  getTrumpDominoes,
  createTrumpHierarchy,
  isValidTrumpSuit,
  createNoTrumpConfig,
  TRUMP_CONSTANTS
} from './trump';

// ============================================================================
// Bidding System Types and Utilities
// ============================================================================
export type {
  SpecialContractType,
  Bid,
  SpecialContract,
  BidValidationResult
} from './bidding';

export {
  BiddingValidationError,
  createPassBid,
  createRegularBid,
  createMarkBid,
  createSpecialContractBid,
  getSpecialContractAmount,
  convertBidToMarks,
  convertMarksToBid,
  validateBid,
  validateSpecialContract,
  isPassBid,
  isMarkBid,
  getMinimumBidAmount,
  BIDDING_CONSTANTS
} from './bidding';

// ============================================================================
// Player Types
// ============================================================================
export type {
  PlayerPosition,
  Player
} from './player';

// ============================================================================
// Partnership Types and Utilities
// ============================================================================
export type {
  PartnershipTeam,
  Partnership,
  PartnershipState,
  PartnershipMarks,
  PartnershipScore
} from './partnership';

export {
  createEmptyPartnershipState
} from './partnership';

// ============================================================================
// Trick Types
// ============================================================================
export type {
  PlayedDomino,
  Trick
} from './trick';

// ============================================================================
// Scoring Types and Utilities
// ============================================================================
export type {
  HandScore,
  ScoringState
} from './scoring';

export {
  createEmptyScoringState
} from './scoring';

// ============================================================================
// Bidding State Types and Utilities
// ============================================================================
export type {
  BiddingState
} from './bidding-state';

export {
  createEmptyBiddingState
} from './bidding-state';

// ============================================================================
// Lobby Types and Utilities
// ============================================================================
export type {
  LobbyGame,
  LobbyState
} from './lobby';

export {
  createEmptyLobbyState
} from './lobby';

// ============================================================================
// API Types
// ============================================================================
export type {
  ApiResponse,
  WebSocketMessage
} from './api';

// ============================================================================
// Action Types
// ============================================================================
export type {
  GameAction
} from './actions';

// ============================================================================
// Game State Types and Utilities
// ============================================================================
export type {
  GamePhase,
  GameState
} from './game-state';

export {
  createEmptyGameState
} from './game-state';

// ============================================================================
// Constants
// ============================================================================
export {
  GAME_CONSTANTS
} from './constants';

// ============================================================================
// Validation Types and Utilities
// ============================================================================
export type {
  ValidationResult,
  ValidationContext,
  ValidationError,
  RuleValidationFunction,
  DominoPlayValidationFunction,
  BidValidationFunction,
  GameStateValidationFunction
} from './validation';

export {
  ValidationSeverity,
  ValidationErrorType,
  createValidResult,
  createInvalidResult,
  createValidationError,
  createValidationWarning,
  combineValidationResults,
  validateRequiredFields,
  validateFieldType,
  validateArrayLength,
  validateNumericRange,
  VALIDATION_CONSTANTS
} from './validation';

// ============================================================================
// Type Guards and Runtime Validation
// ============================================================================
export {
  isValidDomino,
  isValidPlayer,
  isValidGameState,
  isValidLobbyState,
  isValidBiddingState,
  isValidScoringState,
  isValidTrick,
  isValidBid,
  validatePlayerPosition,
  validateGamePhase,
  validateDominoSuit,
  createDomino
} from './type-guards';

// ============================================================================
// Re-export commonly used types for convenience
// ============================================================================

// Import types for re-export
import type { Domino } from './dominoes';
import type { DominoSuit } from './trump';
import type { Player } from './player';
import type { GameState } from './game-state';
import type { Trick } from './trick';
import type { Bid } from './bidding';
import type { ValidationResult, ValidationError, ValidationContext } from './validation';
import type { Partnership, PartnershipState, PartnershipMarks, PartnershipTeam } from './partnership';

/**
 * Core game types that are frequently used together
 */
export type CoreGameTypes = {
  Domino: Domino;
  DominoSuit: DominoSuit;
  Player: Player;
  GameState: GameState;
  Bid: Bid;
  Trick: Trick;
};

/**
 * Validation types that are frequently used together
 */
export type ValidationTypes = {
  ValidationResult: ValidationResult;
  ValidationError: ValidationError;
  ValidationContext: ValidationContext;
};

/**
 * Partnership types that are frequently used together
 */
export type PartnershipTypes = {
  Partnership: Partnership;
  PartnershipState: PartnershipState;
  PartnershipMarks: PartnershipMarks;
  PartnershipTeam: PartnershipTeam;
};

// ============================================================================
// Frontend Compatibility Layer
// ============================================================================

/**
 * Legacy types and functions for frontend migration compatibility
 * Use these during migration from frontend types to shared types
 */
export type { LegacyGameState } from './frontend-compat';
export {
  convertToLegacyGameState,
  convertFromLegacyGameState,
  isValidLegacyGameState,
  createEmptyGameState as createEmptyLegacyGameState,
  createCompatibleBid,
  createCompatiblePlayedDomino,
  createCompatibleBiddingState,
  createCompatibleTrick
} from './frontend-compat';

// ============================================================================
// Package Information
// ============================================================================

/**
 * Package version and metadata
 */
export const PACKAGE_INFO = {
  name: '@texas42/shared-types',
  version: '1.0.0',
  description: 'Shared TypeScript types for Texas 42 game frontend and backend',
  author: 'Texas 42 Development Team',
  license: 'MIT'
} as const;
