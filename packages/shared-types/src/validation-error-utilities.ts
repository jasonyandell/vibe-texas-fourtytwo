/**
 * Texas 42 Validation Error Utilities
 * Helper functions for creating validation results and errors
 */

import { ValidationResult } from './validation-types';
import { ValidationError, ValidationErrorType, ValidationSeverity } from './validation-error-types';

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