/**
 * Game State Types and Utilities Export Module
 * Centralizes all game state-related exports
 */

// Game state type exports
export type {
  GamePhase,
  GameState
} from '../game-state';

export {
  createEmptyGameState
} from '../game-state';

// Trick type exports
export type {
  PlayedDomino,
  Trick
} from '../trick';

// Scoring type exports
export type {
  HandScore,
  ScoringState
} from '../scoring';

export {
  createEmptyScoringState
} from '../scoring';

// Action type exports
export type {
  GameAction
} from '../actions';

// Constants export
export {
  GAME_CONSTANTS
} from '../constants';