/**
 * Texas 42 Validation Utilities
 * Utility functions for common validation operations
 */

import { ValidationResult } from './validation-types';
import { createValidResult, createInvalidResult } from './validation-errors';

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