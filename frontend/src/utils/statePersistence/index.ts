/**
 * State Persistence Utilities for Texas 42
 * Main entry point for persistence functionality
 */

import { GameStatePersistence } from './gameStatePersistence';
import { LobbyStatePersistence } from './lobbyStatePersistence';
import { storageManager, StorageType } from './storageManager';
import { PersistenceOptions } from './types';

export { StorageType } from './storageManager';
export { PersistenceOptions } from './types';

/**
 * Main State Persistence API
 */
export class StatePersistence {
  /**
   * Game state methods
   */
  static saveGameState = GameStatePersistence.save;
  static loadGameState = GameStatePersistence.load;
  static clearGameState = GameStatePersistence.clear;

  /**
   * Lobby state methods
   */
  static saveLobbyState = LobbyStatePersistence.save;
  static loadLobbyState = LobbyStatePersistence.load;
  static clearLobbyState = LobbyStatePersistence.clear;

  /**
   * Clears all persisted data
   */
  static async clearAll(options: PersistenceOptions = {}): Promise<void> {
    await Promise.all([
      GameStatePersistence.clear(options),
      LobbyStatePersistence.clear(options)
    ]);
  }

  /**
   * Gets storage information
   */
  static async getStorageInfo(storageType?: StorageType): Promise<{
    available: boolean;
    type: StorageType;
    hasGameState: boolean;
    hasLobbyState: boolean;
  }> {
    const type = storageType || 'localStorage';
    const available = await storageManager.isStorageAvailable(type);
    const adapter = storageManager.getAdapter(type);

    const hasGameState = !!(await adapter.getItem('texas42_game_state'));
    const hasLobbyState = !!(await adapter.getItem('texas42_lobby_state'));

    return {
      available,
      type,
      hasGameState,
      hasLobbyState
    };
  }
}

// Export storage manager for advanced usage
export { storageManager };