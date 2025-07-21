import { useCallback } from 'react';
import { GameState, isValidGameState } from '@texas42/shared-types';
import { GameStateAction } from '../types';

export function useGameStateActions(dispatch: React.Dispatch<GameStateAction>) {
  const updateGameState = useCallback((gameState: GameState) => {
    if (!isValidGameState(gameState)) {
      dispatch({ type: 'SET_ERROR', payload: new Error('Invalid game state') });
      dispatch({ type: 'SET_GAME_STATE', payload: null });
      return;
    }
    dispatch({ type: 'SET_GAME_STATE', payload: gameState });
  }, [dispatch]);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, [dispatch]);

  const setError = useCallback((error: Error | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, [dispatch]);

  const startGame = useCallback(() => {
    dispatch({ type: 'START_GAME' });
  }, [dispatch]);

  const endGame = useCallback(() => {
    dispatch({ type: 'END_GAME' });
  }, [dispatch]);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, [dispatch]);

  const setAutoSave = useCallback((enabled: boolean) => {
    dispatch({ type: 'SET_AUTO_SAVE', payload: enabled });
  }, [dispatch]);

  return {
    updateGameState,
    setLoading,
    setError,
    startGame,
    endGame,
    resetGame,
    clearError,
    setAutoSave
  };
}