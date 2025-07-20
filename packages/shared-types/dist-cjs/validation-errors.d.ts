/**
 * Texas 42 Validation Errors
 * Error types and error creation utilities
 */
import { ValidationResult } from './validation-types';
/**
 * Validation severity levels
 */
export declare enum ValidationSeverity {
    ERROR = "error",
    WARNING = "warning",
    INFO = "info"
}
/**
 * Validation error types
 * Categorizes different types of validation failures
 */
export declare enum ValidationErrorType {
    INVALID_GAME_STATE = "INVALID_GAME_STATE",
    INVALID_PLAYER_COUNT = "INVALID_PLAYER_COUNT",
    INVALID_PHASE = "INVALID_PHASE",
    MISSING_REQUIRED_FIELD = "MISSING_REQUIRED_FIELD",
    INVALID_PLAYER = "INVALID_PLAYER",
    DUPLICATE_PLAYER = "DUPLICATE_PLAYER",
    INVALID_POSITION = "INVALID_POSITION",
    PLAYER_NOT_FOUND = "PLAYER_NOT_FOUND",
    PLAYER_NOT_READY = "PLAYER_NOT_READY",
    INVALID_DOMINO = "INVALID_DOMINO",
    INVALID_DOMINO_VALUES = "INVALID_DOMINO_VALUES",
    INVALID_POINT_VALUE = "INVALID_POINT_VALUE",
    DOMINO_NOT_IN_HAND = "DOMINO_NOT_IN_HAND",
    DUPLICATE_DOMINO = "DUPLICATE_DOMINO",
    INVALID_TRUMP_SUIT = "INVALID_TRUMP_SUIT",
    INVALID_TRUMP_MAPPING = "INVALID_TRUMP_MAPPING",
    INVALID_BID = "INVALID_BID",
    BID_TOO_LOW = "BID_TOO_LOW",
    BID_TOO_HIGH = "BID_TOO_HIGH",
    INVALID_BIDDER = "INVALID_BIDDER",
    BIDDING_COMPLETE = "BIDDING_COMPLETE",
    INVALID_TRICK = "INVALID_TRICK",
    INVALID_PLAY = "INVALID_PLAY",
    MUST_FOLLOW_SUIT = "MUST_FOLLOW_SUIT",
    TRICK_ALREADY_COMPLETE = "TRICK_ALREADY_COMPLETE",
    INVALID_SCORE = "INVALID_SCORE",
    SCORE_CALCULATION_ERROR = "SCORE_CALCULATION_ERROR",
    INVALID_MARKS = "INVALID_MARKS",
    RULE_VIOLATION = "RULE_VIOLATION",
    SPECIAL_CONTRACT_VIOLATION = "SPECIAL_CONTRACT_VIOLATION",
    GAME_RULE_VIOLATION = "GAME_RULE_VIOLATION"
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
 * Create a successful validation result
 *
 * @param warnings Optional warning messages
 * @param context Optional context information
 * @returns Successful validation result
 */
export declare function createValidResult(warnings?: string[], context?: Record<string, unknown>): ValidationResult;
/**
 * Create a failed validation result
 *
 * @param errors Error messages
 * @param warnings Optional warning messages
 * @param context Optional context information
 * @returns Failed validation result
 */
export declare function createInvalidResult(errors: string[], warnings?: string[], context?: Record<string, unknown>): ValidationResult;
/**
 * Create a validation error
 *
 * @param type Error type
 * @param message Error message
 * @param field Optional field name
 * @param value Optional field value
 * @returns Validation error object
 */
export declare function createValidationError(type: ValidationErrorType, message: string, field?: string, value?: unknown): ValidationError;
/**
 * Create a validation warning
 *
 * @param type Warning type
 * @param message Warning message
 * @param field Optional field name
 * @param value Optional field value
 * @returns Validation warning object
 */
export declare function createValidationWarning(type: ValidationErrorType, message: string, field?: string, value?: unknown): ValidationError;
//# sourceMappingURL=validation-errors.d.ts.map