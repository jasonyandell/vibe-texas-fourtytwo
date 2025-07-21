/**
 * Storage Manager
 * Manages different storage adapters and provides unified interface
 */

import { StorageAdapter, MemoryStorage, BrowserStorageAdapter } from './storageAdapters';

// Storage types
export type StorageType = 'localStorage' | 'sessionStorage' | 'indexedDB' | 'memory';

// Storage manager
export class StorageManager {
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
export const storageManager = new StorageManager();