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
  static saveGameState(...args: Parameters<typeof GameStatePersistence.save>) {
    return GameStatePersistence.save(...args);
  }
  
  static loadGameState(...args: Parameters<typeof GameStatePersistence.load>) {
    return GameStatePersistence.load(...args);
  }
  
  static clearGameState(...args: Parameters<typeof GameStatePersistence.clear>) {
    return GameStatePersistence.clear(...args);
  }

  /**
   * Lobby state methods
   */
  static saveLobbyState(...args: Parameters<typeof LobbyStatePersistence.save>) {
    return LobbyStatePersistence.save(...args);
  }
  
  static loadLobbyState(...args: Parameters<typeof LobbyStatePersistence.load>) {
    return LobbyStatePersistence.load(...args);
  }
  
  static clearLobbyState(...args: Parameters<typeof LobbyStatePersistence.clear>) {
    return LobbyStatePersistence.clear(...args);
  }

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