"use strict";
/**
 * Texas 42 Validation Types
 * Shared validation interfaces and error handling for rule compliance
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateNumericRange = exports.validateArrayLength = exports.validateFieldType = exports.validateRequiredFields = exports.combineValidationResults = exports.createValidationWarning = exports.createValidationError = exports.createInvalidResult = exports.createValidResult = exports.ValidationErrorType = exports.ValidationSeverity = exports.VALIDATION_CONSTANTS = void 0;
// Re-export all validation types
var validation_types_1 = require("./validation-types");
Object.defineProperty(exports, "VALIDATION_CONSTANTS", { enumerable: true, get: function () { return validation_types_1.VALIDATION_CONSTANTS; } });
// Re-export all error types and functions
var validation_errors_1 = require("./validation-errors");
Object.defineProperty(exports, "ValidationSeverity", { enumerable: true, get: function () { return validation_errors_1.ValidationSeverity; } });
Object.defineProperty(exports, "ValidationErrorType", { enumerable: true, get: function () { return validation_errors_1.ValidationErrorType; } });
Object.defineProperty(exports, "createValidResult", { enumerable: true, get: function () { return validation_errors_1.createValidResult; } });
Object.defineProperty(exports, "createInvalidResult", { enumerable: true, get: function () { return validation_errors_1.createInvalidResult; } });
Object.defineProperty(exports, "createValidationError", { enumerable: true, get: function () { return validation_errors_1.createValidationError; } });
Object.defineProperty(exports, "createValidationWarning", { enumerable: true, get: function () { return validation_errors_1.createValidationWarning; } });
// Re-export all utility functions
var validation_utils_1 = require("./validation-utils");
Object.defineProperty(exports, "combineValidationResults", { enumerable: true, get: function () { return validation_utils_1.combineValidationResults; } });
Object.defineProperty(exports, "validateRequiredFields", { enumerable: true, get: function () { return validation_utils_1.validateRequiredFields; } });
Object.defineProperty(exports, "validateFieldType", { enumerable: true, get: function () { return validation_utils_1.validateFieldType; } });
Object.defineProperty(exports, "validateArrayLength", { enumerable: true, get: function () { return validation_utils_1.validateArrayLength; } });
Object.defineProperty(exports, "validateNumericRange", { enumerable: true, get: function () { return validation_utils_1.validateNumericRange; } });
//# sourceMappingURL=validation.js.map