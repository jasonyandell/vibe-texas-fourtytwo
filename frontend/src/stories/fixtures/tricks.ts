/**
 * Trick fixtures for Storybook stories
 */

import { Trick, PlayedDomino, Domino, PlayerPosition } from '@texas42/shared-types';
import { countDominoes, testDominoes } from './dominoes';

// Helper to create a played domino
export function createPlayedDomino(
  domino: Domino,
  playerId: string,
  position: PlayerPosition,
  playOrder: number
): PlayedDomino {
  return {
    domino,
    playerId,
    position,
    playOrder,
    timestamp: new Date(Date.now() + playOrder * 1000).toISOString(), // Stagger timestamps
  };
}

// Empty trick scenarios
export const emptyTrick: Trick = {
  id: 'trick-empty',
  dominoes: [],
  pointValue: 0,
  countDominoes: [],
  trickNumber: 1,
  isComplete: false,
};

// Partial tricks (1-3 dominoes)
export const oneDominoTrick: Trick = {
  id: 'trick-one',
  dominoes: [
    createPlayedDomino(countDominoes.fourOne, 'player-1', 'north', 0),
  ],
  leadSuit: 'fours',
  pointValue: 5,
  countDominoes: [countDominoes.fourOne],
  trickNumber: 1,
  isComplete: false,
};

export const twoDominoTrick: Trick = {
  id: 'trick-two',
  dominoes: [
    createPlayedDomino(testDominoes.six, 'player-2', 'east', 0),
    createPlayedDomino(countDominoes.sixFour, 'player-3', 'south', 1),
  ],
  leadSuit: 'sixes',
  pointValue: 10,
  countDominoes: [countDominoes.sixFour],
  trickNumber: 2,
  isComplete: false,
};

export const threeDominoTrick: Trick = {
  id: 'trick-three',
  dominoes: [
    createPlayedDomino(countDominoes.treyDeuce, 'player-3', 'south', 0),
    createPlayedDomino(testDominoes.trey, 'player-4', 'west', 1),
    createPlayedDomino(testDominoes.deuce, 'player-1', 'north', 2),
  ],
  leadSuit: 'threes',
  pointValue: 5,
  countDominoes: [countDominoes.treyDeuce],
  trickNumber: 3,
  isComplete: false,
};

// Complete tricks
export const completeTrickNoCount: Trick = {
  id: 'trick-complete-no-count',
  dominoes: [
    createPlayedDomino(testDominoes.six, 'player-1', 'north', 0),
    createPlayedDomino({ ...testDominoes.five, high: 6, low: 5 }, 'player-2', 'east', 1),
    createPlayedDomino({ ...testDominoes.four, high: 6, low: 3 }, 'player-3', 'south', 2),
    createPlayedDomino({ ...testDominoes.ace, high: 6, low: 1 }, 'player-4', 'west', 3),
  ],
  leadSuit: 'sixes',
  winner: 'player-1', // Double six wins
  pointValue: 0,
  countDominoes: [],
  trickNumber: 4,
  isComplete: true,
};

export const completeTrickWithCount: Trick = {
  id: 'trick-complete-count',
  dominoes: [
    createPlayedDomino(countDominoes.fiveBlank, 'player-2', 'east', 0),
    createPlayedDomino(countDominoes.doubleFive, 'player-3', 'south', 1),
    createPlayedDomino({ ...testDominoes.four, high: 5, low: 4 }, 'player-4', 'west', 2),
    createPlayedDomino({ ...testDominoes.trey, high: 5, low: 3 }, 'player-1', 'north', 3),
  ],
  leadSuit: 'fives',
  winner: 'player-3', // Double five wins
  pointValue: 15, // 5-0 (5) + 5-5 (10)
  countDominoes: [countDominoes.fiveBlank, countDominoes.doubleFive],
  trickNumber: 5,
  isComplete: true,
};

export const completeTrickAllCount: Trick = {
  id: 'trick-all-count',
  dominoes: [
    createPlayedDomino(countDominoes.sixFour, 'player-4', 'west', 0),
    createPlayedDomino(countDominoes.fourOne, 'player-1', 'north', 1),
    createPlayedDomino(countDominoes.treyDeuce, 'player-2', 'east', 2),
    createPlayedDomino(countDominoes.fiveBlank, 'player-3', 'south', 3),
  ],
  leadSuit: 'sixes', // Led with 6-4
  winner: 'player-4', // 6-4 wins
  pointValue: 25, // All count dominoes!
  countDominoes: [
    countDominoes.sixFour,
    countDominoes.fourOne,
    countDominoes.treyDeuce,
    countDominoes.fiveBlank,
  ],
  trickNumber: 6,
  isComplete: true,
};

// Trump scenario
export const trickWithTrump: Trick = {
  id: 'trick-trump',
  dominoes: [
    createPlayedDomino(countDominoes.treyDeuce, 'player-1', 'north', 0), // Lead 3s
    createPlayedDomino({ ...testDominoes.trey, high: 3, low: 3 }, 'player-2', 'east', 1),
    createPlayedDomino(countDominoes.sixFour, 'player-3', 'south', 2), // Trump with 6 (if 6s are trump)
    createPlayedDomino({ ...testDominoes.ace, high: 3, low: 1 }, 'player-4', 'west', 3),
  ],
  leadSuit: 'threes',
  winner: 'player-3', // Trumped with 6-4
  pointValue: 15, // 3-2 (5) + 6-4 (10)
  countDominoes: [countDominoes.treyDeuce, countDominoes.sixFour],
  trickNumber: 7,
  isComplete: true,
};

// Trick collections
export const trickScenarios = {
  empty: emptyTrick,
  partial: {
    one: oneDominoTrick,
    two: twoDominoTrick,
    three: threeDominoTrick,
  },
  complete: {
    noCount: completeTrickNoCount,
    withCount: completeTrickWithCount,
    allCount: completeTrickAllCount,
    withTrump: trickWithTrump,
  },
};

// Helper to create a trick history
export function createTrickHistory(count: number): Trick[] {
  const tricks: Trick[] = [];
  for (let i = 0; i < count; i++) {
    tricks.push({
      ...completeTrickWithCount,
      id: `trick-${i + 1}`,
      trickNumber: i + 1,
    });
  }
  return tricks;
}

// Helper to calculate trick points
export function calculateTrickPoints(trick: Trick): number {
  return trick.countDominoes.reduce((sum, domino) => sum + domino.pointValue, 0);
}