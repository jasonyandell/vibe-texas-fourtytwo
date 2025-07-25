/**
 * Lobby Type Guards
 * Runtime validation for lobby-related types
 */

import { LobbyState, createEmptyLobbyState } from '../lobby';

/**
 * Validates if a value is a valid lobby state
 */
export function isValidLobbyState(value: unknown): value is LobbyState {
  if (!value || typeof value !== 'object') return false;

  const { availableGames, connectedPlayers } = value as Record<string, unknown>;

  // Check required fields
  if (!Array.isArray(availableGames)) return false;
  if (typeof connectedPlayers !== 'number' || connectedPlayers < 0) return false;

  // Validate each game in the lobby
  for (const game of availableGames) {
    if (!game || typeof game !== 'object') return false;

    const gameObj = game as Record<string, unknown>;
    const { id, name, playerCount, maxPlayers, status, createdAt } = gameObj;

    if (typeof id !== 'string' || id.length === 0) return false;
    if (typeof name !== 'string' || name.length === 0) return false;
    if (typeof playerCount !== 'number' || playerCount < 0) return false;
    if (typeof maxPlayers !== 'number' || maxPlayers < 1) return false;
    if (playerCount > maxPlayers) return false;
    if (!['waiting', 'playing', 'finished'].includes(status as string)) return false;
    if (typeof createdAt !== 'string') return false;
  }

  return true;
}

// Re-export factory function
export { createEmptyLobbyState };