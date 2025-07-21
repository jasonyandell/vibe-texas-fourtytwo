/**
 * Texas 42 Validation Types
 * Core validation interfaces and type definitions
 */

import { Domino } from './dominoes';
import { DominoSuit } from './trump';
import { Bid } from './bidding';
import { GameState } from './game-state';
import { Player } from './player';
import { Trick } from './trick';

/**
 * Validation result interface
 * Standard format for all validation operations
 */
export interface ValidationResult {
  /** True if validation passed */
  isValid: boolean;
  /** Error messages for validation failures */
  errors: string[];
  /** Warning messages for valid but risky operations */
  warnings: string[];
  /** Additional context information */
  context?: Record<string, unknown>;
}

/**
 * Validation context for rule checking
 * Provides context information for validation operations
 */
export interface ValidationContext {
  /** Current game state */
  gameState?: GameState;
  /** Current player */
  currentPlayer?: Player;
  /** Current trump suit */
  trump?: DominoSuit;
  /** Current trick */
  currentTrick?: Trick;
  /** Additional context data */
  metadata?: Record<string, unknown>;
}

/**
 * Rule validation function signature
 * Standard interface for all rule validation functions
 */
export type RuleValidationFunction<T = unknown> = (
  input: T,
  context?: ValidationContext
) => ValidationResult;

/**
 * Domino play validation function signature
 */
export type DominoPlayValidationFunction = (
  domino: Domino,
  playerHand: Domino[],
  currentTrick: Trick,
  trump: DominoSuit,
  context?: ValidationContext
) => ValidationResult;

/**
 * Bid validation function signature
 */
export type BidValidationFunction = (
  bid: Bid,
  gameState: GameState,
  context?: ValidationContext
) => ValidationResult;

/**
 * Game state validation function signature
 */
export type GameStateValidationFunction = (
  gameState: GameState,
  context?: ValidationContext
) => ValidationResult;

/**
 * Validation constants
 */
export const VALIDATION_CONSTANTS = {
  /** Maximum error message length */
  MAX_ERROR_MESSAGE_LENGTH: 500,
  /** Maximum number of errors to collect */
  MAX_ERRORS: 50,
  /** Maximum number of warnings to collect */
  MAX_WARNINGS: 20,
  /** Default validation timeout (ms) */
  DEFAULT_TIMEOUT: 5000
} as const;