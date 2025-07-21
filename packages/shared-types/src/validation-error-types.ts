/**
 * Texas 42 Validation Error Types
 * Defines error severity levels, error types, and interfaces
 */

/**
 * Validation severity levels
 */
export enum ValidationSeverity {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

/**
 * Validation error types
 * Categorizes different types of validation failures
 */
export enum ValidationErrorType {
  // Game state validation
  INVALID_GAME_STATE = 'INVALID_GAME_STATE',
  INVALID_PLAYER_COUNT = 'INVALID_PLAYER_COUNT',
  INVALID_PHASE = 'INVALID_PHASE',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  
  // Player validation
  INVALID_PLAYER = 'INVALID_PLAYER',
  DUPLICATE_PLAYER = 'DUPLICATE_PLAYER',
  INVALID_POSITION = 'INVALID_POSITION',
  PLAYER_NOT_FOUND = 'PLAYER_NOT_FOUND',
  PLAYER_NOT_READY = 'PLAYER_NOT_READY',
  
  // Domino validation
  INVALID_DOMINO = 'INVALID_DOMINO',
  INVALID_DOMINO_VALUES = 'INVALID_DOMINO_VALUES',
  INVALID_POINT_VALUE = 'INVALID_POINT_VALUE',
  DOMINO_NOT_IN_HAND = 'DOMINO_NOT_IN_HAND',
  DUPLICATE_DOMINO = 'DUPLICATE_DOMINO',
  
  // Trump validation
  INVALID_TRUMP_SUIT = 'INVALID_TRUMP_SUIT',
  INVALID_TRUMP_MAPPING = 'INVALID_TRUMP_MAPPING',
  
  // Bidding validation
  INVALID_BID = 'INVALID_BID',
  BID_TOO_LOW = 'BID_TOO_LOW',
  BID_TOO_HIGH = 'BID_TOO_HIGH',
  INVALID_BIDDER = 'INVALID_BIDDER',
  BIDDING_COMPLETE = 'BIDDING_COMPLETE',
  
  // Trick validation
  INVALID_TRICK = 'INVALID_TRICK',
  INVALID_PLAY = 'INVALID_PLAY',
  MUST_FOLLOW_SUIT = 'MUST_FOLLOW_SUIT',
  TRICK_ALREADY_COMPLETE = 'TRICK_ALREADY_COMPLETE',
  
  // Scoring validation
  INVALID_SCORE = 'INVALID_SCORE',
  SCORE_CALCULATION_ERROR = 'SCORE_CALCULATION_ERROR',
  INVALID_MARKS = 'INVALID_MARKS',
  
  // Rule compliance
  RULE_VIOLATION = 'RULE_VIOLATION',
  SPECIAL_CONTRACT_VIOLATION = 'SPECIAL_CONTRACT_VIOLATION',
  GAME_RULE_VIOLATION = 'GAME_RULE_VIOLATION'
}

/**
 * Validation error details
 */
export interface ValidationError {
  /** Error type */
  type: ValidationErrorType;
  /** Error message */
  message: string;
  /** Field that failed validation */
  field?: string;
  /** Value that failed validation */
  value?: unknown;
  /** Severity level */
  severity: ValidationSeverity;
}