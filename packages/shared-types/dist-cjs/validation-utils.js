"use strict";
/**
 * Texas 42 Validation Utilities
 * Utility functions for common validation operations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.combineValidationResults = combineValidationResults;
exports.validateRequiredFields = validateRequiredFields;
exports.validateFieldType = validateFieldType;
exports.validateArrayLength = validateArrayLength;
exports.validateNumericRange = validateNumericRange;
const validation_errors_1 = require("./validation-errors");
/**
 * Combine multiple validation results
 *
 * @param results Array of validation results to combine
 * @returns Combined validation result
 */
function combineValidationResults(results) {
    const allErrors = [];
    const allWarnings = [];
    const combinedContext = {};
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
function validateRequiredFields(obj, requiredFields) {
    const errors = [];
    for (const field of requiredFields) {
        if (obj[field] === undefined || obj[field] === null) {
            errors.push(`Required field '${field}' is missing`);
        }
    }
    return errors.length > 0
        ? (0, validation_errors_1.createInvalidResult)(errors)
        : (0, validation_errors_1.createValidResult)();
}
/**
 * Validate field type
 *
 * @param value Value to validate
 * @param expectedType Expected type
 * @param fieldName Field name for error messages
 * @returns Validation result
 */
function validateFieldType(value, expectedType, fieldName) {
    const actualType = typeof value;
    if (actualType !== expectedType) {
        return (0, validation_errors_1.createInvalidResult)([
            `Field '${fieldName}' must be of type '${expectedType}', got '${actualType}'`
        ]);
    }
    return (0, validation_errors_1.createValidResult)();
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
function validateArrayLength(array, minLength, maxLength, fieldName) {
    const errors = [];
    if (array.length < minLength) {
        errors.push(`Field '${fieldName}' must have at least ${minLength} items, got ${array.length}`);
    }
    if (array.length > maxLength) {
        errors.push(`Field '${fieldName}' must have at most ${maxLength} items, got ${array.length}`);
    }
    return errors.length > 0
        ? (0, validation_errors_1.createInvalidResult)(errors)
        : (0, validation_errors_1.createValidResult)();
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
function validateNumericRange(value, min, max, fieldName) {
    const errors = [];
    if (value < min) {
        errors.push(`Field '${fieldName}' must be at least ${min}, got ${value}`);
    }
    if (value > max) {
        errors.push(`Field '${fieldName}' must be at most ${max}, got ${value}`);
    }
    return errors.length > 0
        ? (0, validation_errors_1.createInvalidResult)(errors)
        : (0, validation_errors_1.createValidResult)();
}
//# sourceMappingURL=validation-utils.js.map