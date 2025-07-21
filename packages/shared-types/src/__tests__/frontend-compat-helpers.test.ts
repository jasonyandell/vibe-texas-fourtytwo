/**
 * Frontend Compatibility Helpers Tests
 * Tests for frontend compatibility helper functions
 */

import { describe, it, expect } from 'vitest';
import { createDomino } from '../type-guards';
import {
  createCompatibleBid,
  createCompatiblePlayedDomino,
  createCompatibleTrick
} from '../frontend-compat';

describe('Frontend Compatibility Helpers', () => {
  it('should create compatible bid objects', () => {
    // This test should fail initially - we need to import the helper
    const passBid = createCompatibleBid('player1', 0);
    expect(passBid.playerId).toBe('player1');
    expect(passBid.amount).toBe(0);
    expect(passBid.isSpecialContract).toBe(false);
    expect(passBid.timestamp).toBeDefined();
    expect(passBid.trump).toBeUndefined();

    const regularBid = createCompatibleBid('player1', 35, 'doubles');
    expect(regularBid.trump).toBe('doubles');
  });

  it('should create compatible played domino objects', () => {
    const domino = createDomino(6, 4);
    const playedDomino = createCompatiblePlayedDomino(domino, 'player1', 'north', 1);

    expect(playedDomino.domino).toBe(domino);
    expect(playedDomino.playerId).toBe('player1');
    expect(playedDomino.position).toBe('north');
    expect(playedDomino.playOrder).toBe(1);
    expect(playedDomino.timestamp).toBeDefined();
  });

  it('should create compatible trick objects', () => {
    const domino1 = createDomino(6, 4);
    const domino2 = createDomino(5, 0);
    const playedDomino1 = createCompatiblePlayedDomino(domino1, 'player1', 'north', 1);
    const playedDomino2 = createCompatiblePlayedDomino(domino2, 'player2', 'east', 2);

    const trick = createCompatibleTrick('trick1', [playedDomino1, playedDomino2], 1);

    expect(trick.id).toBe('trick1');
    expect(trick.dominoes).toHaveLength(2);
    expect(trick.pointValue).toBe(15); // 10 + 5 points
    expect(trick.countDominoes).toHaveLength(2); // both are count dominoes
    expect(trick.trickNumber).toBe(1);
    expect(trick.isComplete).toBe(false); // only 2 dominoes, need 4
  });
});