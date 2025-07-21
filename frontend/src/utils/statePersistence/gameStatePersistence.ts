/**
 * Game State Persistence
 * Handles saving and loading game state
 */

import { GameState } from '@texas42/shared-types';
import { serializeGameStateToUrl, parseGameStateFromUrl } from '../urlSerialization';
import { storageManager } from './storageManager';
import { STORAGE_KEYS, PersistenceOptions, PersistedData } from './types';

// Temporary workaround for build issue - simplified validation
function isValidGameState(value: unknown): value is GameState {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  return typeof obj.id === 'string' && typeof obj.phase === 'string';
}

export class GameStatePersistence {
  private static readonly CURRENT_VERSION = 1;

  /**
   * Saves game state to storage
   */
  static async save(
    gameState: GameState, 
    options: PersistenceOptions = {}
  ): Promise<void> {
    const { storageType, compress = false, ttl } = options;
    const adapter = storageManager.getAdapter(storageType);

    try {
      const persistedData: PersistedData<GameState> = {
        data: gameState,
        timestamp: Date.now(),
        version: this.CURRENT_VERSION,
        ttl
      };

      let serialized: string;
      
      if (compress) {
        // Use URL serialization for compression
        serialized = serializeGameStateToUrl(gameState, { useCompression: true });
      } else {
        serialized = JSON.stringify(persistedData);
      }

      await adapter.setItem(STORAGE_KEYS.GAME_STATE, serialized);
    } catch (error) {
      console.error('Failed to save game state:', error);
      throw new Error('Failed to save game state to storage');
    }
  }

  /**
   * Loads game state from storage
   */
  static async load(
    options: PersistenceOptions = {}
  ): Promise<GameState | null> {
    const { storageType } = options;
    const adapter = storageManager.getAdapter(storageType);

    try {
      const serialized = await adapter.getItem(STORAGE_KEYS.GAME_STATE);
      if (!serialized) return null;

      // Try to parse as URL-serialized data first
      const urlParsed = parseGameStateFromUrl(serialized);
      if (urlParsed && isValidGameState(urlParsed)) {
        return urlParsed;
      }

      // Try to parse as JSON
      const persistedData: PersistedData<GameState> = JSON.parse(serialized) as PersistedData<GameState>;
      
      // Check TTL
      if (persistedData.ttl && Date.now() - persistedData.timestamp > persistedData.ttl) {
        await this.clear(options);
        return null;
      }

      // Validate the game state
      if (!isValidGameState(persistedData.data)) {
        console.warn('Invalid game state found in storage');
        await this.clear(options);
        return null;
      }

      return persistedData.data;
    } catch (error) {
      console.error('Failed to load game state:', error);
      return null;
    }
  }

  /**
   * Clears game state from storage
   */
  static async clear(options: PersistenceOptions = {}): Promise<void> {
    const { storageType } = options;
    const adapter = storageManager.getAdapter(storageType);

    try {
      await adapter.removeItem(STORAGE_KEYS.GAME_STATE);
    } catch (error) {
      console.error('Failed to clear game state:', error);
    }
  }
}