/**
 * Lobby State Persistence
 * Handles saving and loading lobby state
 */

import { LobbyState } from '@texas42/shared-types';
import { isValidLobbyState } from '@/types/texas42';
import { storageManager } from './storageManager';
import { STORAGE_KEYS, PersistenceOptions, PersistedData } from './types';

export class LobbyStatePersistence {
  private static readonly CURRENT_VERSION = 1;

  /**
   * Saves lobby state to storage
   */
  static async save(
    lobbyState: LobbyState,
    options: PersistenceOptions = {}
  ): Promise<void> {
    const { storageType, ttl } = options;
    const adapter = storageManager.getAdapter(storageType);

    try {
      const persistedData: PersistedData<LobbyState> = {
        data: lobbyState,
        timestamp: Date.now(),
        version: this.CURRENT_VERSION,
        ttl
      };

      const serialized = JSON.stringify(persistedData);
      await adapter.setItem(STORAGE_KEYS.LOBBY_STATE, serialized);
    } catch (error) {
      console.error('Failed to save lobby state:', error);
      throw new Error('Failed to save lobby state to storage');
    }
  }

  /**
   * Loads lobby state from storage
   */
  static async load(
    options: PersistenceOptions = {}
  ): Promise<LobbyState | null> {
    const { storageType } = options;
    const adapter = storageManager.getAdapter(storageType);

    try {
      const serialized = await adapter.getItem(STORAGE_KEYS.LOBBY_STATE);
      if (!serialized) return null;

      const persistedData: PersistedData<LobbyState> = JSON.parse(serialized) as PersistedData<LobbyState>;
      
      // Check TTL
      if (persistedData.ttl && Date.now() - persistedData.timestamp > persistedData.ttl) {
        await this.clear(options);
        return null;
      }

      // Validate the lobby state
      if (!isValidLobbyState(persistedData.data)) {
        console.warn('Invalid lobby state found in storage');
        await this.clear(options);
        return null;
      }

      return persistedData.data;
    } catch (error) {
      console.error('Failed to load lobby state:', error);
      return null;
    }
  }

  /**
   * Clears lobby state from storage
   */
  static async clear(options: PersistenceOptions = {}): Promise<void> {
    const { storageType } = options;
    const adapter = storageManager.getAdapter(storageType);

    try {
      await adapter.removeItem(STORAGE_KEYS.LOBBY_STATE);
    } catch (error) {
      console.error('Failed to clear lobby state:', error);
    }
  }
}