/**
 * Texas 42 Trump Hierarchy Functions
 * Functions for creating trump hierarchies and no-trump configurations
 */

import { Domino } from './dominoes';
import { DominoSuit, TrumpHierarchy, NoTrumpConfig } from './trump-types';
import { getTrumpDominoes } from './trump-suit-mapping';
import { compareTrumpDominoes } from './trump-ranking';

/**
 * Create a trump hierarchy for a given trump suit
 * Returns all trump dominoes ranked from highest to lowest
 * 
 * @param trump The trump suit
 * @param allDominoes All available dominoes
 * @returns Trump hierarchy information
 */
export function createTrumpHierarchy(trump: DominoSuit, allDominoes: Domino[]): TrumpHierarchy {
  const trumpDominoes = getTrumpDominoes(allDominoes, trump);
  
  // Sort trump dominoes from highest to lowest
  const rankedDominoes = trumpDominoes.sort((a, b) => compareTrumpDominoes(b, a, trump));
  
  return {
    suit: trump,
    rankedDominoes,
    trumpCount: trumpDominoes.length
  };
}

/**
 * Create a no-trump configuration
 * 
 * @param doublesOption Whether doubles are high or low
 * @returns No-trump configuration
 */
export function createNoTrumpConfig(doublesOption: 'high' | 'low' = 'high'): NoTrumpConfig {
  return {
    doublesOption,
    specialRules: [
      'No trump suit in effect',
      `Doubles are ${doublesOption} in each suit`,
      'Follow suit rules still apply',
      'Highest domino of led suit wins'
    ]
  };
}