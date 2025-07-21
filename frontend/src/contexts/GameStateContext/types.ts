import { GameState, Player } from '@texas42/shared-types';

// Optimistic update metadata
export interface OptimisticUpdate {
  id: string;
  timestamp: number;
  originalState: GameState;
  description?: string;
  timeout?: number;
}

// Action types for the reducer
export type GameStateAction =
  | { type: 'SET_GAME_STATE'; payload: GameState | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: Error | null }
  | { type: 'ADD_PLAYER'; payload: Player }
  | { type: 'REMOVE_PLAYER'; payload: string }
  | { type: 'UPDATE_PLAYER_READY'; payload: { playerId: string; isReady: boolean } }
  | { type: 'UPDATE_PLAYER_CONNECTION'; payload: { playerId: string; isConnected: boolean } }
  | { type: 'START_GAME' }
  | { type: 'END_GAME' }
  | { type: 'RESET_GAME' }
  | { type: 'APPLY_OPTIMISTIC_UPDATE'; payload: { id: string; update: (state: GameState) => GameState; description?: string; timeout?: number } }
  | { type: 'REVERT_OPTIMISTIC_UPDATE'; payload: string }
  | { type: 'CONFIRM_OPTIMISTIC_UPDATE'; payload: string }
  | { type: 'CLEANUP_EXPIRED_UPDATES' }
  | { type: 'PERSIST_STATE' }
  | { type: 'RESTORE_STATE'; payload: GameState }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_AUTO_SAVE'; payload: boolean };

// State interface
export interface GameStateContextState {
  gameState: GameState | null;
  isLoading: boolean;
  error: Error | null;
  optimisticUpdates: Map<string, OptimisticUpdate>;
  baseState: GameState | null;
  lastPersisted: number | null;
  autoSave: boolean;
}

// Context interface
export interface GameStateContextValue extends GameStateContextState {
  updateGameState: (gameState: GameState) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  updatePlayerReady: (playerId: string, isReady: boolean) => void;
  updatePlayerConnection: (playerId: string, isConnected: boolean) => void;
  startGame: () => void;
  endGame: () => void;
  resetGame: () => void;
  applyOptimisticUpdate: (id: string, update: (state: GameState) => GameState, description?: string, timeout?: number) => void;
  revertOptimisticUpdate: (id: string) => void;
  confirmOptimisticUpdate: (id: string) => void;
  clearError: () => void;
  serializeToUrl: () => string | null;
  loadFromUrl: (urlParams: string) => void;
  retryOperation: (operation: () => Promise<GameState>) => Promise<void>;
  persistState: () => Promise<void>;
  restoreState: () => Promise<void>;
  setAutoSave: (enabled: boolean) => void;
  getOptimisticUpdates: () => OptimisticUpdate[];
}