import { vi } from 'vitest';

export interface MockHandlers {
  onStartGame: ReturnType<typeof vi.fn>;
  onGameStarted: ReturnType<typeof vi.fn>;
  onError: ReturnType<typeof vi.fn>;
}

export function setupMockHandlers(): MockHandlers {
  return {
    onStartGame: vi.fn(),
    onGameStarted: vi.fn(),
    onError: vi.fn()
  };
}