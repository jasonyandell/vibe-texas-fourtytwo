import { useCallback } from 'react';
import { StatePersistence } from '@/utils/statePersistence';
import { GameStateContextState } from '../types';

interface GameStateActions {
  updateGameState: (gameState: any) => void;
}

export function usePersistenceActions(
  state: GameStateContextState,
  { updateGameState }: GameStateActions
) {
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

  return {
    persistState,
    restoreState
  };
}