/**
 * Player Validation Tests
 * Tests for player type validation functions
 */

import { describe, it, expect } from 'vitest';
import { isValidPlayer, createDomino } from '../type-guards';

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