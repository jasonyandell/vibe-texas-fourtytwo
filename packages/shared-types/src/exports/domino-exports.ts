/**
 * Domino Types and Utilities Export Module
 * Centralizes all domino-related exports
 */

// Type exports
export type {
  Domino,
  DominoSet
} from '../dominoes';

// Utility exports
export {
  calculateDominoPointValue,
  isCountDomino,
  isCountDominoByValues,
  createFullDominoSet,
  getCountDominoes,
  calculateTotalPoints,
  isValidDominoSet,
  DOMINO_CONSTANTS
} from '../dominoes';

// Factory exports
export {
  createDomino,
  createFullDominoSet as createFullDominoSetFromFactory
} from '../domino-factory';

// Validator exports
export {
  isValidDomino as isValidDominoFromValidators,
  isValidDominoSet as isValidDominoSetFromValidators
} from '../domino-validators';