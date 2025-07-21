/**
 * Validation Types and Utilities Export Module
 * Centralizes all validation-related exports
 */

// Type exports
export type {
  ValidationResult,
  ValidationContext,
  ValidationError,
  RuleValidationFunction,
  DominoPlayValidationFunction,
  BidValidationFunction,
  GameStateValidationFunction
} from '../validation';

// Utility exports
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
} from '../validation';

// Type guard exports
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
  validateDominoSuit
} from '../type-guards';