/**
 * Lobby State Validation Tests
 * Tests for lobby state validation functions
 */

import { describe, it, expect } from 'vitest';
import { isValidLobbyState, createEmptyLobbyState } from '../type-guards';

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