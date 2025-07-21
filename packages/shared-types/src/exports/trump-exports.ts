/**
 * Trump System Types and Utilities Export Module
 * Centralizes all trump-related exports
 */

// Type exports
export type {
  DominoSuit,
  TrumpSystem,
  DominoSuitMapping,
  TrumpHierarchy,
  NoTrumpConfig
} from '../trump';

// Utility exports
export {
  getSuitValue,
  getSuitName,
  getDominoSuits,
  isTrumpDomino,
  getTrumpRank,
  compareTrumpDominoes,
  compareNonTrumpDominoes,
  getTrumpDominoes,
  createTrumpHierarchy,
  isValidTrumpSuit,
  createNoTrumpConfig,
  TRUMP_CONSTANTS
} from '../trump';