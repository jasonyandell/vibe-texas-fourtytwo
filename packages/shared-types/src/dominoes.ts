/**
 * Texas 42 Domino Types and Utilities
 * Re-exports all domino-related functionality
 */

// Type exports
export type { Domino, DominoSet } from './domino-types';
export { DOMINO_CONSTANTS } from './domino-types';

// Utility exports
export {
  calculateDominoPointValue,
  isCountDomino,
  isCountDominoByValues,
  getCountDominoes,
  calculateTotalPoints
} from './domino-utils';

// Factory exports
export {
  createDomino,
  createFullDominoSet
} from './domino-factory';

// Validation exports
export {
  isValidDomino,
  isValidDominoSet
} from './domino-validators';