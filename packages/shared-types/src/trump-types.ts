/**
 * Texas 42 Trump Suit System Type Definitions
 * Core types and interfaces for the trump system
 */

import { Domino } from './dominoes';

/**
 * The 7 trump suits in Texas 42
 * Based on rules-research-4: 6 number suits plus doubles
 */
export type DominoSuit = 'blanks' | 'ones' | 'twos' | 'threes' | 'fours' | 'fives' | 'sixes' | 'doubles';

/**
 * Trump system configuration
 * Defines the current trump state and options
 */
export interface TrumpSystem {
  /** The current trump suit */
  suit: DominoSuit;
  /** True if no trump is in effect */
  isNoTrump: boolean;
  /** For no-trump games: whether doubles are high or low */
  doublesOption?: 'high' | 'low';
}

/**
 * Domino suit mapping information
 * Shows which suits a domino belongs to and its trump status
 */
export interface DominoSuitMapping {
  /** The domino being mapped */
  domino: Domino;
  /** All suits this domino belongs to */
  suits: DominoSuit[];
  /** True if this domino is trump */
  isTrump: boolean;
  /** Ranking within trump suit (higher = stronger) */
  trumpRank?: number;
}

/**
 * Trump hierarchy information
 * Defines the ranking system within trump suits
 */
export interface TrumpHierarchy {
  /** The trump suit */
  suit: DominoSuit;
  /** All trump dominoes ranked from highest to lowest */
  rankedDominoes: Domino[];
  /** Total number of trump dominoes */
  trumpCount: number;
}

/**
 * No-trump game configuration
 * Special rules for games without trump
 */
export interface NoTrumpConfig {
  /** Whether doubles are high or low in each suit */
  doublesOption: 'high' | 'low';
  /** Special rules that apply */
  specialRules: string[];
}