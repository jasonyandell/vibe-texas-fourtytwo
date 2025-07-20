/**
 * Types and Constants for State Persistence
 */

// Storage keys
export const STORAGE_KEYS = {
  GAME_STATE: 'texas42_game_state',
  LOBBY_STATE: 'texas42_lobby_state',
  PLAYER_PREFERENCES: 'texas42_player_preferences',
  GAME_HISTORY: 'texas42_game_history'
} as const;

/**
 * Persistence options
 */
export interface PersistenceOptions {
  storageType?: import('./storageManager').StorageType;
  compress?: boolean;
  encrypt?: boolean;
  ttl?: number; // Time to live in milliseconds
}

/**
 * Persisted data wrapper
 */
export interface PersistedData<T> {
  data: T;
  timestamp: number;
  version: number;
  ttl?: number;
}