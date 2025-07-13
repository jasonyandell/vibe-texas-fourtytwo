/**
 * State Persistence Utilities for Texas 42
 * Handles saving and loading game state to/from various storage mechanisms
 */

import { GameState, LobbyState, isValidGameState, isValidLobbyState } from '@/types/texas42';
import { serializeGameStateToUrl, parseGameStateFromUrl } from './urlSerialization';

// Storage keys
const STORAGE_KEYS = {
  GAME_STATE: 'texas42_game_state',
  LOBBY_STATE: 'texas42_lobby_state',
  PLAYER_PREFERENCES: 'texas42_player_preferences',
  GAME_HISTORY: 'texas42_game_history'
} as const;

// Storage types
export type StorageType = 'localStorage' | 'sessionStorage' | 'indexedDB' | 'memory';

// Storage interface
interface StorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}

// Memory storage for fallback
class MemoryStorage implements StorageAdapter {
  private storage = new Map<string, string>();

  async getItem(key: string): Promise<string | null> {
    return this.storage.get(key) || null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.storage.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this.storage.delete(key);
  }

  async clear(): Promise<void> {
    this.storage.clear();
  }
}

// Browser storage adapters
class BrowserStorageAdapter implements StorageAdapter {
  constructor(private storage: Storage) {}

  async getItem(key: string): Promise<string | null> {
    try {
      return this.storage.getItem(key);
    } catch (error) {
      console.warn('Failed to get item from storage:', error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      this.storage.setItem(key, value);
    } catch (error) {
      console.warn('Failed to set item in storage:', error);
      throw error;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      this.storage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove item from storage:', error);
    }
  }

  async clear(): Promise<void> {
    try {
      this.storage.clear();
    } catch (error) {
      console.warn('Failed to clear storage:', error);
    }
  }
}

// Storage manager
class StorageManager {
  private adapters: Map<StorageType, StorageAdapter> = new Map();
  private defaultAdapter: StorageAdapter;

  constructor() {
    // Initialize storage adapters
    this.adapters.set('memory', new MemoryStorage());
    
    if (typeof window !== 'undefined') {
      try {
        this.adapters.set('localStorage', new BrowserStorageAdapter(localStorage));
        this.adapters.set('sessionStorage', new BrowserStorageAdapter(sessionStorage));
      } catch (error) {
        console.warn('Browser storage not available:', error);
      }
    }

    // Set default adapter (prefer localStorage, fallback to memory)
    this.defaultAdapter = this.adapters.get('localStorage') || this.adapters.get('memory')!;
  }

  getAdapter(type?: StorageType): StorageAdapter {
    if (!type) return this.defaultAdapter;
    return this.adapters.get(type) || this.defaultAdapter;
  }

  async isStorageAvailable(type: StorageType): Promise<boolean> {
    try {
      const adapter = this.adapters.get(type);
      if (!adapter) return false;

      const testKey = '__storage_test__';
      const testValue = 'test';
      
      await adapter.setItem(testKey, testValue);
      const retrieved = await adapter.getItem(testKey);
      await adapter.removeItem(testKey);
      
      return retrieved === testValue;
    } catch {
      return false;
    }
  }
}

// Global storage manager instance
const storageManager = new StorageManager();

/**
 * Persistence options
 */
export interface PersistenceOptions {
  storageType?: StorageType;
  compress?: boolean;
  encrypt?: boolean;
  ttl?: number; // Time to live in milliseconds
}

/**
 * Persisted data wrapper
 */
interface PersistedData<T> {
  data: T;
  timestamp: number;
  version: number;
  ttl?: number;
}

/**
 * Game state persistence utilities
 */
export class StatePersistence {
  private static readonly CURRENT_VERSION = 1;

  /**
   * Saves game state to storage
   */
  static async saveGameState(
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
  static async loadGameState(
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
      const persistedData: PersistedData<GameState> = JSON.parse(serialized);
      
      // Check TTL
      if (persistedData.ttl && Date.now() - persistedData.timestamp > persistedData.ttl) {
        await this.clearGameState(options);
        return null;
      }

      // Validate the game state
      if (!isValidGameState(persistedData.data)) {
        console.warn('Invalid game state found in storage');
        await this.clearGameState(options);
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
  static async clearGameState(options: PersistenceOptions = {}): Promise<void> {
    const { storageType } = options;
    const adapter = storageManager.getAdapter(storageType);

    try {
      await adapter.removeItem(STORAGE_KEYS.GAME_STATE);
    } catch (error) {
      console.error('Failed to clear game state:', error);
    }
  }

  /**
   * Saves lobby state to storage
   */
  static async saveLobbyState(
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
  static async loadLobbyState(
    options: PersistenceOptions = {}
  ): Promise<LobbyState | null> {
    const { storageType } = options;
    const adapter = storageManager.getAdapter(storageType);

    try {
      const serialized = await adapter.getItem(STORAGE_KEYS.LOBBY_STATE);
      if (!serialized) return null;

      const persistedData: PersistedData<LobbyState> = JSON.parse(serialized);
      
      // Check TTL
      if (persistedData.ttl && Date.now() - persistedData.timestamp > persistedData.ttl) {
        await this.clearLobbyState(options);
        return null;
      }

      // Validate the lobby state
      if (!isValidLobbyState(persistedData.data)) {
        console.warn('Invalid lobby state found in storage');
        await this.clearLobbyState(options);
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
  static async clearLobbyState(options: PersistenceOptions = {}): Promise<void> {
    const { storageType } = options;
    const adapter = storageManager.getAdapter(storageType);

    try {
      await adapter.removeItem(STORAGE_KEYS.LOBBY_STATE);
    } catch (error) {
      console.error('Failed to clear lobby state:', error);
    }
  }

  /**
   * Clears all persisted data
   */
  static async clearAll(options: PersistenceOptions = {}): Promise<void> {
    await Promise.all([
      this.clearGameState(options),
      this.clearLobbyState(options)
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

    const hasGameState = !!(await adapter.getItem(STORAGE_KEYS.GAME_STATE));
    const hasLobbyState = !!(await adapter.getItem(STORAGE_KEYS.LOBBY_STATE));

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
