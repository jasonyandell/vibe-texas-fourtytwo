/**
 * Enum Validators Tests
 * Tests for enum validation functions
 */

import { describe, it, expect } from 'vitest';
import {
  validatePlayerPosition,
  validateGamePhase,
  validateDominoSuit
} from '../type-guards';

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