import { useCallback } from 'react';
import { serializeGameStateToUrl, parseGameStateFromUrl } from '@/utils/urlSerialization';
import { GameStateContextState } from '../types';
import { GameState } from '@texas42/shared-types';

interface GameStateActions {
  updateGameState: (gameState: GameState) => void;
  setError: (error: Error | null) => void;
}

export function useSerializationActions(
  state: GameStateContextState,
  { updateGameState, setError }: GameStateActions
) {
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

  return {
    serializeToUrl,
    loadFromUrl
  };
}