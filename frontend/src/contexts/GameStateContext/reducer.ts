import { GameStateAction, GameStateContextState } from './types';
import { handlePlayerActions } from './reducers/playerReducer';
import { handleOptimisticUpdateActions } from './reducers/optimisticUpdateReducer';
import { handleCoreStateActions } from './reducers/coreStateReducer';
import { handleGameLifecycleActions } from './reducers/gameLifecycleReducer';

// Initial state
export const initialState: GameStateContextState = {
  gameState: null,
  isLoading: false,
  error: null,
  optimisticUpdates: new Map(),
  baseState: null,
  lastPersisted: null,
  autoSave: true
};

// Reducer function
export function gameStateReducer(state: GameStateContextState, action: GameStateAction): GameStateContextState {
  // Check each reducer module
  const playerResult = handlePlayerActions(state, action);
  if (playerResult !== null) return playerResult;

  const optimisticResult = handleOptimisticUpdateActions(state, action);
  if (optimisticResult !== null) return optimisticResult;

  const coreResult = handleCoreStateActions(state, action);
  if (coreResult !== null) return coreResult;

  const lifecycleResult = handleGameLifecycleActions(state, action, initialState);
  if (lifecycleResult !== null) return lifecycleResult;

  return state;
}