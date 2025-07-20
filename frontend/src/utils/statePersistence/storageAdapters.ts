/**
 * Storage Adapters for State Persistence
 * Provides different storage mechanism implementations
 */

// Storage interface
export interface StorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}

// Memory storage for fallback
export class MemoryStorage implements StorageAdapter {
  private storage = new Map<string, string>();

  getItem(key: string): Promise<string | null> {
    return Promise.resolve(this.storage.get(key) || null);
  }

  setItem(key: string, value: string): Promise<void> {
    this.storage.set(key, value);
    return Promise.resolve();
  }

  removeItem(key: string): Promise<void> {
    this.storage.delete(key);
    return Promise.resolve();
  }

  clear(): Promise<void> {
    this.storage.clear();
    return Promise.resolve();
  }
}

// Browser storage adapters
export class BrowserStorageAdapter implements StorageAdapter {
  constructor(private storage: Storage) {}

  getItem(key: string): Promise<string | null> {
    try {
      return Promise.resolve(this.storage.getItem(key));
    } catch (error) {
      console.warn('Failed to get item from storage:', error);
      return Promise.resolve(null);
    }
  }

  setItem(key: string, value: string): Promise<void> {
    try {
      this.storage.setItem(key, value);
      return Promise.resolve();
    } catch (error) {
      console.warn('Failed to set item in storage:', error);
      return Promise.reject(error instanceof Error ? error : new Error(String(error)));
    }
  }

  removeItem(key: string): Promise<void> {
    try {
      this.storage.removeItem(key);
      return Promise.resolve();
    } catch (error) {
      console.warn('Failed to remove item from storage:', error);
      return Promise.resolve();
    }
  }

  clear(): Promise<void> {
    try {
      this.storage.clear();
      return Promise.resolve();
    } catch (error) {
      console.warn('Failed to clear storage:', error);
      return Promise.resolve();
    }
  }
}