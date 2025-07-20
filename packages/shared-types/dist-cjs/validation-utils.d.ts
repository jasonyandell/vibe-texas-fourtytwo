/**
 * Texas 42 Validation Utilities
 * Utility functions for common validation operations
 */
import { ValidationResult } from './validation-types';
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
//# sourceMappingURL=validation-utils.d.ts.map