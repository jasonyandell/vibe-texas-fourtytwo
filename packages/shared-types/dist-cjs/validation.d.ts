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
export type RuleValidationFunction<T = unknown> = (input: T, context?: ValidationContext) => ValidationResult;
/**
 * Domino play validation function signature
 */
export type DominoPlayValidationFunction = (domino: Domino, playerHand: Domino[], currentTrick: Trick, trump: DominoSuit, context?: ValidationContext) => ValidationResult;
/**
 * Bid validation function signature
 */
export type BidValidationFunction = (bid: Bid, gameState: GameState, context?: ValidationContext) => ValidationResult;
/**
 * Game state validation function signature
 */
export type GameStateValidationFunction = (gameState: GameState, context?: ValidationContext) => ValidationResult;
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
export declare function combineValidationResults(results: ValidationResult[]): ValidationResult;
/**
 * Validate required fields
 *
 * @param obj Object to validate
 * @param requiredFields Array of required field names
 * @returns Validation result
 */
export declare function validateRequiredFields(obj: Record<string, unknown>, requiredFields: string[]): ValidationResult;
/**
 * Validate field type
 *
 * @param value Value to validate
 * @param expectedType Expected type
 * @param fieldName Field name for error messages
 * @returns Validation result
 */
export declare function validateFieldType(value: unknown, expectedType: string, fieldName: string): ValidationResult;
/**
 * Validate array length
 *
 * @param array Array to validate
 * @param minLength Minimum length
 * @param maxLength Maximum length
 * @param fieldName Field name for error messages
 * @returns Validation result
 */
export declare function validateArrayLength(array: unknown[], minLength: number, maxLength: number, fieldName: string): ValidationResult;
/**
 * Validate numeric range
 *
 * @param value Value to validate
 * @param min Minimum value
 * @param max Maximum value
 * @param fieldName Field name for error messages
 * @returns Validation result
 */
export declare function validateNumericRange(value: number, min: number, max: number, fieldName: string): ValidationResult;
/**
 * Validation constants
 */
export declare const VALIDATION_CONSTANTS: {
    /** Maximum error message length */
    readonly MAX_ERROR_MESSAGE_LENGTH: 500;
    /** Maximum number of errors to collect */
    readonly MAX_ERRORS: 50;
    /** Maximum number of warnings to collect */
    readonly MAX_WARNINGS: 20;
    /** Default validation timeout (ms) */
    readonly DEFAULT_TIMEOUT: 5000;
};
//# sourceMappingURL=validation.d.ts.map