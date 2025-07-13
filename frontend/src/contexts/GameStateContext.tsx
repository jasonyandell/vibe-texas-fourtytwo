import React, { createContext, useContext, useReducer, useCallback, useRef, useEffect } from 'react';
import { GameState, Player, isValidGameState } from '@/types/texas42';
import { serializeGameStateToUrl, parseGameStateFromUrl } from '@/utils/urlSerialization';
import { StatePersistence } from '@/utils/statePersistence';

// Optimistic update metadata
interface OptimisticUpdate {
  id: string;
  timestamp: number;
  originalState: GameState;
  description?: string;
  timeout?: number;
}

// Action types for the reducer
type GameStateAction =
  | { type: 'SET_GAME_STATE'; payload: GameState }
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
  | { type: 'CLEAR_ERROR' };

// State interface
interface GameStateContextState {
  gameState: GameState | null;
  isLoading: boolean;
  error: Error | null;
  optimisticUpdates: Map<string, OptimisticUpdate>;
  baseState: GameState | null;
  lastPersisted: number | null;
  autoSave: boolean;
}

// Context interface
interface GameStateContextValue extends GameStateContextState {
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

// Initial state
const initialState: GameStateContextState = {
  gameState: null,
  isLoading: false,
  error: null,
  optimisticUpdates: new Map(),
  baseState: null,
  lastPersisted: null,
  autoSave: true
};

// Reducer function
function gameStateReducer(state: GameStateContextState, action: GameStateAction): GameStateContextState {
  switch (action.type) {
    case 'SET_GAME_STATE':
      return {
        ...state,
        gameState: action.payload,
        baseState: action.payload,
        error: null,
        optimisticUpdates: new Map()
      };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };

    case 'ADD_PLAYER':
      if (!state.gameState) return state;
      return {
        ...state,
        gameState: {
          ...state.gameState,
          players: [...state.gameState.players, action.payload]
        }
      };

    case 'REMOVE_PLAYER':
      if (!state.gameState) return state;
      return {
        ...state,
        gameState: {
          ...state.gameState,
          players: state.gameState.players.filter(p => p.id !== action.payload)
        }
      };

    case 'UPDATE_PLAYER_READY':
      if (!state.gameState) return state;
      return {
        ...state,
        gameState: {
          ...state.gameState,
          players: state.gameState.players.map(p =>
            p.id === action.payload.playerId
              ? { ...p, isReady: action.payload.isReady }
              : p
          )
        }
      };

    case 'UPDATE_PLAYER_CONNECTION':
      if (!state.gameState) return state;
      return {
        ...state,
        gameState: {
          ...state.gameState,
          players: state.gameState.players.map(p =>
            p.id === action.payload.playerId
              ? { ...p, isConnected: action.payload.isConnected }
              : p
          )
        }
      };

    case 'START_GAME':
      if (!state.gameState) return state;
      return {
        ...state,
        gameState: { ...state.gameState, phase: 'playing' }
      };

    case 'END_GAME':
      if (!state.gameState) return state;
      return {
        ...state,
        gameState: { ...state.gameState, phase: 'finished' }
      };

    case 'RESET_GAME':
      return {
        ...initialState,
        optimisticUpdates: new Map()
      };

    case 'APPLY_OPTIMISTIC_UPDATE':
      if (!state.gameState) return state;
      const updatedState = action.payload.update(state.gameState);
      const newOptimisticUpdates = new Map(state.optimisticUpdates);
      newOptimisticUpdates.set(action.payload.id, state.gameState);
      return {
        ...state,
        gameState: updatedState,
        optimisticUpdates: newOptimisticUpdates
      };

    case 'REVERT_OPTIMISTIC_UPDATE':
      const originalState = state.optimisticUpdates.get(action.payload);
      if (!originalState) return state;
      const revertedOptimisticUpdates = new Map(state.optimisticUpdates);
      revertedOptimisticUpdates.delete(action.payload);
      return {
        ...state,
        gameState: originalState,
        optimisticUpdates: revertedOptimisticUpdates
      };

    case 'CONFIRM_OPTIMISTIC_UPDATE':
      const confirmedOptimisticUpdates = new Map(state.optimisticUpdates);
      confirmedOptimisticUpdates.delete(action.payload);
      return {
        ...state,
        baseState: state.gameState,
        optimisticUpdates: confirmedOptimisticUpdates
      };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    default:
      return state;
  }
}

// Create context
const GameStateContext = createContext<GameStateContextValue | undefined>(undefined);

// Provider component
export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameStateReducer, initialState);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();

  const updateGameState = useCallback((gameState: GameState) => {
    if (!isValidGameState(gameState)) {
      dispatch({ type: 'SET_ERROR', payload: new Error('Invalid game state') });
      return;
    }
    dispatch({ type: 'SET_GAME_STATE', payload: gameState });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setError = useCallback((error: Error | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const addPlayer = useCallback((player: Player) => {
    dispatch({ type: 'ADD_PLAYER', payload: player });
  }, []);

  const removePlayer = useCallback((playerId: string) => {
    dispatch({ type: 'REMOVE_PLAYER', payload: playerId });
  }, []);

  const updatePlayerReady = useCallback((playerId: string, isReady: boolean) => {
    dispatch({ type: 'UPDATE_PLAYER_READY', payload: { playerId, isReady } });
  }, []);

  const updatePlayerConnection = useCallback((playerId: string, isConnected: boolean) => {
    dispatch({ type: 'UPDATE_PLAYER_CONNECTION', payload: { playerId, isConnected } });
  }, []);

  const startGame = useCallback(() => {
    dispatch({ type: 'START_GAME' });
  }, []);

  const endGame = useCallback(() => {
    dispatch({ type: 'END_GAME' });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  const applyOptimisticUpdate = useCallback((id: string, update: (state: GameState) => GameState) => {
    dispatch({ type: 'APPLY_OPTIMISTIC_UPDATE', payload: { id, update } });
  }, []);

  const revertOptimisticUpdate = useCallback((id: string) => {
    dispatch({ type: 'REVERT_OPTIMISTIC_UPDATE', payload: id });
  }, []);

  const confirmOptimisticUpdate = useCallback((id: string) => {
    dispatch({ type: 'CONFIRM_OPTIMISTIC_UPDATE', payload: id });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const serializeToUrl = useCallback(() => {
    if (!state.gameState) return null;
    try {
      return serializeGameStateToUrl(state.gameState);
    } catch (error) {
      console.error('Failed to serialize game state to URL:', error);
      return null;
    }
  }, [state.gameState]);

  const loadFromUrl = useCallback((urlParams: string) => {
    try {
      const gameState = parseGameStateFromUrl(urlParams);
      if (gameState) {
        updateGameState(gameState);
      }
    } catch (error) {
      console.error('Failed to load game state from URL:', error);
      setError(error as Error);
    }
  }, [updateGameState, setError]);

  const retryOperation = useCallback(async (operation: () => Promise<GameState>) => {
    const maxRetries = 3;
    let retries = 0;

    while (retries < maxRetries) {
      try {
        setLoading(true);
        const result = await operation();
        updateGameState(result);
        setLoading(false);
        return;
      } catch (error) {
        retries++;
        if (retries >= maxRetries) {
          setError(error as Error);
          setLoading(false);
          throw error;
        }
        // For testing, we'll retry immediately. In production, add delay here.
        if (process.env.NODE_ENV !== 'test') {
          const delay = Math.pow(2, retries) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
  }, [updateGameState, setError, setLoading]);

  const value: GameStateContextValue = {
    ...state,
    updateGameState,
    setLoading,
    setError,
    addPlayer,
    removePlayer,
    updatePlayerReady,
    updatePlayerConnection,
    startGame,
    endGame,
    resetGame,
    applyOptimisticUpdate,
    revertOptimisticUpdate,
    confirmOptimisticUpdate,
    clearError,
    serializeToUrl,
    loadFromUrl,
    retryOperation
  };

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
};

// Hook to use the context
export const useGameStateContext = () => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameStateContext must be used within a GameStateProvider');
  }
  return context;
};
