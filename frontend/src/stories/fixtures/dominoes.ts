/**
 * Standard domino test fixtures for Storybook stories
 */

import { Domino } from '@texas42/shared-types';
import { createDomino, createFullDominoSet } from '@/types/domino';

// Individual test dominoes
export const testDominoes = {
  blank: createDomino(0, 0),
  ace: createDomino(1, 1),
  deuce: createDomino(2, 2),
  trey: createDomino(3, 3),
  four: createDomino(4, 4),
  five: createDomino(5, 5),
  six: createDomino(6, 6),
};

// Count dominoes (worth points in Texas 42)
export const countDominoes = {
  fiveBlank: createDomino(5, 0),    // 5 points
  fourOne: createDomino(4, 1),       // 5 points
  treyDeuce: createDomino(3, 2),     // 5 points
  sixFour: createDomino(6, 4),       // 10 points
  doubleFive: createDomino(5, 5),    // 10 points
};

// All count dominoes as array
export const allCountDominoes: Domino[] = Object.values(countDominoes);

// Non-count dominoes for testing
export const nonCountDominoes = [
  createDomino(6, 0),
  createDomino(6, 1),
  createDomino(6, 2),
  createDomino(6, 3),
  createDomino(5, 1),
  createDomino(5, 2),
  createDomino(5, 3),
  createDomino(5, 4),
  createDomino(4, 0),
  createDomino(4, 2),
  createDomino(4, 3),
  createDomino(3, 0),
  createDomino(3, 1),
  createDomino(2, 0),
  createDomino(2, 1),
  createDomino(1, 0),
];

// Example hands for testing (7 dominoes each)
export const exampleHands = {
  strongHand: [
    testDominoes.six,
    testDominoes.five,
    countDominoes.sixFour,
    countDominoes.doubleFive,
    createDomino(6, 3),
    createDomino(5, 4),
    createDomino(4, 3),
  ],
  weakHand: [
    testDominoes.blank,
    testDominoes.ace,
    createDomino(1, 0),
    createDomino(2, 0),
    createDomino(2, 1),
    createDomino(3, 0),
    createDomino(3, 1),
  ],
  balancedHand: [
    countDominoes.fiveBlank,
    countDominoes.fourOne,
    countDominoes.treyDeuce,
    createDomino(6, 2),
    createDomino(5, 3),
    createDomino(4, 2),
    createDomino(3, 1),
  ],
};

// Full domino set helper
export const fullDominoSet = createFullDominoSet();

// Helper to get dominoes by suit
export function getDominoesBySuit(suit: number): Domino[] {
  return fullDominoSet.dominoes.filter(
    domino => domino.high === suit || domino.low === suit
  );
}

// Helper to get random dominoes
export function getRandomDominoes(count: number): Domino[] {
  const shuffled = [...fullDominoSet.dominoes].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Helper to create a specific trick scenario
export function createTrickDominoes(leadSuit: number, includeCount = true): Domino[] {
  const suitDominoes = getDominoesBySuit(leadSuit);
  const trick: Domino[] = [];
  
  // Add lead domino
  trick.push(suitDominoes[0]);
  
  // Add follow dominoes
  for (let i = 1; i < 4 && i < suitDominoes.length; i++) {
    trick.push(suitDominoes[i]);
  }
  
  // If we need more dominoes, add some off-suit
  while (trick.length < 4) {
    const offSuit = fullDominoSet.dominoes.find(
      d => !trick.includes(d) && d.high !== leadSuit && d.low !== leadSuit
    );
    if (offSuit) trick.push(offSuit);
  }
  
  // Ensure we have a count domino if requested
  if (includeCount && !trick.some(d => d.pointValue > 0)) {
    trick[1] = allCountDominoes[0];
  }
  
  return trick;
}