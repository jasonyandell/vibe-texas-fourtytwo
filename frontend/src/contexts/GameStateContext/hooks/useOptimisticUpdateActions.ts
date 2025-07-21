import { useCallback } from 'react';
import { GameState } from '@texas42/shared-types';
import { GameStateAction, GameStateContextState } from '../types';

export function useOptimisticUpdateActions(
  state: GameStateContextState,
  dispatch: React.Dispatch<GameStateAction>
) {
  const applyOptimisticUpdate = useCallback((
    id: string,
    update: (state: GameState) => GameState,
    description?: string,
    timeout?: number
  ) => {
    dispatch({ type: 'APPLY_OPTIMISTIC_UPDATE', payload: { id, update, description, timeout } });
  }, [dispatch]);

  const revertOptimisticUpdate = useCallback((id: string) => {
    dispatch({ type: 'REVERT_OPTIMISTIC_UPDATE', payload: id });
  }, [dispatch]);

  const confirmOptimisticUpdate = useCallback((id: string) => {
    dispatch({ type: 'CONFIRM_OPTIMISTIC_UPDATE', payload: id });
  }, [dispatch]);

  const getOptimisticUpdates = useCallback(() => {
    return Array.from(state.optimisticUpdates.values());
  }, [state.optimisticUpdates]);

  return {
    applyOptimisticUpdate,
    revertOptimisticUpdate,
    confirmOptimisticUpdate,
    getOptimisticUpdates
  };
}