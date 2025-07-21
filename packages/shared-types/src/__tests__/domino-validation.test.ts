/**
 * Domino Validation Tests
 * Tests for domino type validation functions
 */

import { describe, it, expect } from 'vitest';
import { isValidDomino, createDomino } from '../type-guards';

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