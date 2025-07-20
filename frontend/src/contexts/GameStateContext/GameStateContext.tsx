import React, { createContext, useReducer, useCallback, useRef } from 'react';
import { GameState, Player, isValidGameState } from '@texas42/shared-types';
import { serializeGameStateToUrl, parseGameStateFromUrl } from '@/utils/urlSerialization';
import { StatePersistence } from '@/utils/statePersistence';
import { GameStateContextValue, OptimisticUpdate } from './types';
import { gameStateReducer, initialState } from './reducer';

// Create context
const GameStateContext = createContext<GameStateContextValue | undefined>(undefined);

// Provider component
export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameStateReducer, initialState);
  const _retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateGameState = useCallback((gameState: GameState) => {
    if (!isValidGameState(gameState)) {
      dispatch({ type: 'SET_ERROR', payload: new Error('Invalid game state') });
      dispatch({ type: 'SET_GAME_STATE', payload: null });
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

  const persistState = useCallback(async () => {
    if (state.gameState) {
      await StatePersistence.saveGameState(state.gameState);
    }
  }, [state.gameState]);

  const restoreState = useCallback(async () => {
    const savedState = await StatePersistence.loadGameState();
    if (savedState) {
      updateGameState(savedState);
    }
  }, [updateGameState]);

  const setAutoSave = useCallback((enabled: boolean) => {
    dispatch({ type: 'SET_AUTO_SAVE', payload: enabled });
  }, []);

  const getOptimisticUpdates = useCallback(() => {
    return Array.from(state.optimisticUpdates.values());
  }, [state.optimisticUpdates]);

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
    retryOperation,
    persistState,
    restoreState,
    setAutoSave,
    getOptimisticUpdates
  };

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
};

// Export the context for testing and direct access
export { GameStateContext };