import { GameStateAction, GameStateContextState } from '../types';

export function handleOptimisticUpdateActions(
  state: GameStateContextState,
  action: GameStateAction
): GameStateContextState | null {
  switch (action.type) {
    case 'APPLY_OPTIMISTIC_UPDATE': {
      if (!state.gameState) return state;
      const updatedState = action.payload.update(state.gameState);
      const newOptimisticUpdates = new Map(state.optimisticUpdates);
      newOptimisticUpdates.set(action.payload.id, {
        id: action.payload.id,
        timestamp: Date.now(),
        originalState: state.gameState
      });
      return {
        ...state,
        gameState: updatedState,
        optimisticUpdates: newOptimisticUpdates
      };
    }

    case 'REVERT_OPTIMISTIC_UPDATE': {
      const optimisticUpdate = state.optimisticUpdates.get(action.payload);
      if (!optimisticUpdate) return state;
      const revertedOptimisticUpdates = new Map(state.optimisticUpdates);
      revertedOptimisticUpdates.delete(action.payload);
      return {
        ...state,
        gameState: optimisticUpdate.originalState,
        optimisticUpdates: revertedOptimisticUpdates
      };
    }

    case 'CONFIRM_OPTIMISTIC_UPDATE': {
      const confirmedOptimisticUpdates = new Map(state.optimisticUpdates);
      confirmedOptimisticUpdates.delete(action.payload);
      return {
        ...state,
        baseState: state.gameState,
        optimisticUpdates: confirmedOptimisticUpdates
      };
    }

    default:
      return null;
  }
}