/**
 * Texas 42 Validation Types
 * Shared validation interfaces and error handling for rule compliance
 */
export { ValidationResult, ValidationContext, RuleValidationFunction, DominoPlayValidationFunction, BidValidationFunction, GameStateValidationFunction, VALIDATION_CONSTANTS } from './validation-types';
export { ValidationSeverity, ValidationErrorType, ValidationError, createValidResult, createInvalidResult, createValidationError, createValidationWarning } from './validation-errors';
export { combineValidationResults, validateRequiredFields, validateFieldType, validateArrayLength, validateNumericRange } from './validation-utils';
//# sourceMappingURL=validation.d.ts.map