/**
 * Type Guards and Validation Functions Tests
 * Tests for runtime type validation functions
 */

import { describe, it, expect } from 'vitest';
import {
  isValidDomino,
  isValidPlayer,
  isValidGameState,
  isValidLobbyState,
  isValidBiddingState,
  isValidScoringState,
  isValidTrick,
  isValidBid,
  validatePlayerPosition,
  validateGamePhase,
  validateDominoSuit,
  createDomino,
  createEmptyGameState,
  createEmptyLobbyState,
  createEmptyBiddingState,
  createEmptyScoringState
} from '../type-guards';

import {
  createCompatibleBid,
  createCompatiblePlayedDomino,
  createCompatibleTrick
} from '../frontend-compat';

describe('Type Guards - Domino Validation', () => {
  it('should validate a correct domino', () => {
    const validDomino = createDomino(6, 4);
    expect(isValidDomino(validDomino)).toBe(true);
  });

  it('should reject invalid domino objects', () => {
    expect(isValidDomino(null)).toBe(false);
    expect(isValidDomino(undefined)).toBe(false);
    expect(isValidDomino({})).toBe(false);
    expect(isValidDomino({ id: '', high: 6, low: 4 })).toBe(false);
    expect(isValidDomino({ id: '6-4', high: 'six', low: 4 })).toBe(false);
    expect(isValidDomino({ id: '6-4', high: 6, low: 7 })).toBe(false); // out of range
    expect(isValidDomino({ id: '6-4', high: 4, low: 6 })).toBe(false); // low > high
  });
});

describe('Type Guards - Player Validation', () => {
  it('should validate a correct player', () => {
    const validPlayer = {
      id: 'player1',
      name: 'Test Player',
      position: 'north' as const,
      hand: [createDomino(6, 4)],
      isConnected: true,
      isReady: false
    };
    expect(isValidPlayer(validPlayer)).toBe(true);
  });

  it('should reject invalid player objects', () => {
    expect(isValidPlayer(null)).toBe(false);
    expect(isValidPlayer({})).toBe(false);
    expect(isValidPlayer({ id: '', name: 'Test' })).toBe(false);
    expect(isValidPlayer({ id: 'test', name: '', position: 'north' })).toBe(false);
    expect(isValidPlayer({ id: 'test', name: 'Test', position: 'invalid' })).toBe(false);
  });
});

describe('Type Guards - Enum Validators', () => {
  it('should validate player positions', () => {
    expect(validatePlayerPosition('north')).toBe(true);
    expect(validatePlayerPosition('east')).toBe(true);
    expect(validatePlayerPosition('south')).toBe(true);
    expect(validatePlayerPosition('west')).toBe(true);
    expect(validatePlayerPosition('invalid')).toBe(false);
    expect(validatePlayerPosition(null)).toBe(false);
  });

  it('should validate game phases', () => {
    expect(validateGamePhase('bidding')).toBe(true);
    expect(validateGamePhase('playing')).toBe(true);
    expect(validateGamePhase('scoring')).toBe(true);
    expect(validateGamePhase('finished')).toBe(true);
    expect(validateGamePhase('invalid')).toBe(false);
  });

  it('should validate domino suits', () => {
    expect(validateDominoSuit('blanks')).toBe(true);
    expect(validateDominoSuit('ones')).toBe(true);
    expect(validateDominoSuit('doubles')).toBe(true);
    expect(validateDominoSuit('invalid')).toBe(false);
  });
});

describe('Type Guards - Bid Validation', () => {
  it('should validate correct bids', () => {
    const passBid = { playerId: 'player1', amount: 0 };
    const regularBid = { playerId: 'player1', amount: 35, trump: 'doubles' as const };
    
    expect(isValidBid(passBid)).toBe(true);
    expect(isValidBid(regularBid)).toBe(true);
  });

  it('should reject invalid bids', () => {
    expect(isValidBid(null)).toBe(false);
    expect(isValidBid({ playerId: '', amount: 35 })).toBe(false);
    expect(isValidBid({ playerId: 'player1', amount: 25 })).toBe(false); // too low
    expect(isValidBid({ playerId: 'player1', amount: 45 })).toBe(false); // too high
    expect(isValidBid({ playerId: 'player1', amount: 35 })).toBe(false); // missing trump
  });
});

describe('Type Guards - Lobby State Validation', () => {
  it('should validate correct lobby state', () => {
    const validLobby = createEmptyLobbyState();
    expect(isValidLobbyState(validLobby)).toBe(true);
  });

  it('should reject invalid lobby states', () => {
    expect(isValidLobbyState(null)).toBe(false);
    expect(isValidLobbyState({ availableGames: 'not-array' })).toBe(false);
    expect(isValidLobbyState({ availableGames: [], connectedPlayers: -1 })).toBe(false);
  });
});

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
