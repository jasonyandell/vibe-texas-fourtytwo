/**
 * Bid Validation Tests
 * Tests for bid type validation functions
 */

import { describe, it, expect } from 'vitest';
import { isValidBid } from '../type-guards';

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