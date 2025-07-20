/**
 * Texas 42 Validation Types
 * Shared validation interfaces and error handling for rule compliance
 */

// Re-export all validation types
export {
  ValidationResult,
  ValidationContext,
  RuleValidationFunction,
  DominoPlayValidationFunction,
  BidValidationFunction,
  GameStateValidationFunction,
  VALIDATION_CONSTANTS
} from './validation-types';

// Re-export all error types and functions
export {
  ValidationSeverity,
  ValidationErrorType,
  ValidationError,
  createValidResult,
  createInvalidResult,
  createValidationError,
  createValidationWarning
} from './validation-errors';

// Re-export all utility functions
export {
  combineValidationResults,
  validateRequiredFields,
  validateFieldType,
  validateArrayLength,
  validateNumericRange
} from './validation-utils';