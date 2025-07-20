"use strict";
/**
 * Texas 42 Validation Errors
 * Error types and error creation utilities
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationErrorType = exports.ValidationSeverity = void 0;
exports.createValidResult = createValidResult;
exports.createInvalidResult = createInvalidResult;
exports.createValidationError = createValidationError;
exports.createValidationWarning = createValidationWarning;
/**
 * Validation severity levels
 */
var ValidationSeverity;
(function (ValidationSeverity) {
    ValidationSeverity["ERROR"] = "error";
    ValidationSeverity["WARNING"] = "warning";
    ValidationSeverity["INFO"] = "info";
})(ValidationSeverity || (exports.ValidationSeverity = ValidationSeverity = {}));
/**
 * Validation error types
 * Categorizes different types of validation failures
 */
var ValidationErrorType;
(function (ValidationErrorType) {
    // Game state validation
    ValidationErrorType["INVALID_GAME_STATE"] = "INVALID_GAME_STATE";
    ValidationErrorType["INVALID_PLAYER_COUNT"] = "INVALID_PLAYER_COUNT";
    ValidationErrorType["INVALID_PHASE"] = "INVALID_PHASE";
    ValidationErrorType["MISSING_REQUIRED_FIELD"] = "MISSING_REQUIRED_FIELD";
    // Player validation
    ValidationErrorType["INVALID_PLAYER"] = "INVALID_PLAYER";
    ValidationErrorType["DUPLICATE_PLAYER"] = "DUPLICATE_PLAYER";
    ValidationErrorType["INVALID_POSITION"] = "INVALID_POSITION";
    ValidationErrorType["PLAYER_NOT_FOUND"] = "PLAYER_NOT_FOUND";
    ValidationErrorType["PLAYER_NOT_READY"] = "PLAYER_NOT_READY";
    // Domino validation
    ValidationErrorType["INVALID_DOMINO"] = "INVALID_DOMINO";
    ValidationErrorType["INVALID_DOMINO_VALUES"] = "INVALID_DOMINO_VALUES";
    ValidationErrorType["INVALID_POINT_VALUE"] = "INVALID_POINT_VALUE";
    ValidationErrorType["DOMINO_NOT_IN_HAND"] = "DOMINO_NOT_IN_HAND";
    ValidationErrorType["DUPLICATE_DOMINO"] = "DUPLICATE_DOMINO";
    // Trump validation
    ValidationErrorType["INVALID_TRUMP_SUIT"] = "INVALID_TRUMP_SUIT";
    ValidationErrorType["INVALID_TRUMP_MAPPING"] = "INVALID_TRUMP_MAPPING";
    // Bidding validation
    ValidationErrorType["INVALID_BID"] = "INVALID_BID";
    ValidationErrorType["BID_TOO_LOW"] = "BID_TOO_LOW";
    ValidationErrorType["BID_TOO_HIGH"] = "BID_TOO_HIGH";
    ValidationErrorType["INVALID_BIDDER"] = "INVALID_BIDDER";
    ValidationErrorType["BIDDING_COMPLETE"] = "BIDDING_COMPLETE";
    // Trick validation
    ValidationErrorType["INVALID_TRICK"] = "INVALID_TRICK";
    ValidationErrorType["INVALID_PLAY"] = "INVALID_PLAY";
    ValidationErrorType["MUST_FOLLOW_SUIT"] = "MUST_FOLLOW_SUIT";
    ValidationErrorType["TRICK_ALREADY_COMPLETE"] = "TRICK_ALREADY_COMPLETE";
    // Scoring validation
    ValidationErrorType["INVALID_SCORE"] = "INVALID_SCORE";
    ValidationErrorType["SCORE_CALCULATION_ERROR"] = "SCORE_CALCULATION_ERROR";
    ValidationErrorType["INVALID_MARKS"] = "INVALID_MARKS";
    // Rule compliance
    ValidationErrorType["RULE_VIOLATION"] = "RULE_VIOLATION";
    ValidationErrorType["SPECIAL_CONTRACT_VIOLATION"] = "SPECIAL_CONTRACT_VIOLATION";
    ValidationErrorType["GAME_RULE_VIOLATION"] = "GAME_RULE_VIOLATION";
})(ValidationErrorType || (exports.ValidationErrorType = ValidationErrorType = {}));
/**
 * Create a successful validation result
 *
 * @param warnings Optional warning messages
 * @param context Optional context information
 * @returns Successful validation result
 */
function createValidResult(warnings = [], context) {
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
function createInvalidResult(errors, warnings = [], context) {
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
function createValidationError(type, message, field, value) {
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
function createValidationWarning(type, message, field, value) {
    return {
        type,
        message,
        field,
        value,
        severity: ValidationSeverity.WARNING
    };
}
//# sourceMappingURL=validation-errors.js.map