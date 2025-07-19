/**
 * Texas 42 Validation Types
 * Shared validation interfaces and error handling for rule compliance
 */

import { Domino } from './dominoes';
import { DominoSuit } from './trump';
import { Bid } from './bidding';
import { GameState, Player, Trick } from './game-state';

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
 * Create a successful validation result
 * 
 * @param warnings Optional warning messages
 * @param context Optional context information
 * @returns Successful validation result
 */
export function createValidResult(
  warnings: string[] = [],
  context?: Record<string, unknown>
): ValidationResult {
  return {
    isValid: true,
    errors: [],
    warnings,
    context
  };
}

/**
 * Create a failed validation result
 * 
 * @param errors Error messages
 * @param warnings Optional warning messages
 * @param context Optional context information
 * @returns Failed validation result
 */
export function createInvalidResult(
  errors: string[],
  warnings: string[] = [],
  context?: Record<string, unknown>
): ValidationResult {
  return {
    isValid: false,
    errors,
    warnings,
    context
  };
}

/**
 * Create a validation error
 * 
 * @param type Error type
 * @param message Error message
 * @param field Optional field name
 * @param value Optional field value
 * @returns Validation error object
 */
export function createValidationError(
  type: ValidationErrorType,
  message: string,
  field?: string,
  value?: unknown
): ValidationError {
  return {
    type,
    message,
    field,
    value,
    severity: ValidationSeverity.ERROR
  };
}

/**
 * Create a validation warning
 * 
 * @param type Warning type
 * @param message Warning message
 * @param field Optional field name
 * @param value Optional field value
 * @returns Validation warning object
 */
export function createValidationWarning(
  type: ValidationErrorType,
  message: string,
  field?: string,
  value?: unknown
): ValidationError {
  return {
    type,
    message,
    field,
    value,
    severity: ValidationSeverity.WARNING
  };
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

/**
 * Combine multiple validation results
 * 
 * @param results Array of validation results to combine
 * @returns Combined validation result
 */
export function combineValidationResults(results: ValidationResult[]): ValidationResult {
  const allErrors: string[] = [];
  const allWarnings: string[] = [];
  const combinedContext: Record<string, unknown> = {};
  
  let isValid = true;
  
  for (const result of results) {
    if (!result.isValid) {
      isValid = false;
    }
    
    allErrors.push(...result.errors);
    allWarnings.push(...result.warnings);
    
    if (result.context) {
      Object.assign(combinedContext, result.context);
    }
  }
  
  return {
    isValid,
    errors: allErrors,
    warnings: allWarnings,
    context: Object.keys(combinedContext).length > 0 ? combinedContext : undefined
  };
}

/**
 * Validate required fields
 * 
 * @param obj Object to validate
 * @param requiredFields Array of required field names
 * @returns Validation result
 */
export function validateRequiredFields(
  obj: Record<string, unknown>,
  requiredFields: string[]
): ValidationResult {
  const errors: string[] = [];
  
  for (const field of requiredFields) {
    if (obj[field] === undefined || obj[field] === null) {
      errors.push(`Required field '${field}' is missing`);
    }
  }
  
  return errors.length > 0 
    ? createInvalidResult(errors)
    : createValidResult();
}

/**
 * Validate field type
 * 
 * @param value Value to validate
 * @param expectedType Expected type
 * @param fieldName Field name for error messages
 * @returns Validation result
 */
export function validateFieldType(
  value: unknown,
  expectedType: string,
  fieldName: string
): ValidationResult {
  const actualType = typeof value;
  
  if (actualType !== expectedType) {
    return createInvalidResult([
      `Field '${fieldName}' must be of type '${expectedType}', got '${actualType}'`
    ]);
  }
  
  return createValidResult();
}

/**
 * Validate array length
 * 
 * @param array Array to validate
 * @param minLength Minimum length
 * @param maxLength Maximum length
 * @param fieldName Field name for error messages
 * @returns Validation result
 */
export function validateArrayLength(
  array: unknown[],
  minLength: number,
  maxLength: number,
  fieldName: string
): ValidationResult {
  const errors: string[] = [];
  
  if (array.length < minLength) {
    errors.push(`Field '${fieldName}' must have at least ${minLength} items, got ${array.length}`);
  }
  
  if (array.length > maxLength) {
    errors.push(`Field '${fieldName}' must have at most ${maxLength} items, got ${array.length}`);
  }
  
  return errors.length > 0 
    ? createInvalidResult(errors)
    : createValidResult();
}

/**
 * Validate numeric range
 * 
 * @param value Value to validate
 * @param min Minimum value
 * @param max Maximum value
 * @param fieldName Field name for error messages
 * @returns Validation result
 */
export function validateNumericRange(
  value: number,
  min: number,
  max: number,
  fieldName: string
): ValidationResult {
  const errors: string[] = [];
  
  if (value < min) {
    errors.push(`Field '${fieldName}' must be at least ${min}, got ${value}`);
  }
  
  if (value > max) {
    errors.push(`Field '${fieldName}' must be at most ${max}, got ${value}`);
  }
  
  return errors.length > 0 
    ? createInvalidResult(errors)
    : createValidResult();
}

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
