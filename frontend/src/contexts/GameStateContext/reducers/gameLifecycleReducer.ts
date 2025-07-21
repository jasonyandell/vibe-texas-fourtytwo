import { GameStateAction, GameStateContextState } from '../types';

export function handleGameLifecycleActions(
  state: GameStateContextState,
  action: GameStateAction,
  initialState: GameStateContextState
): GameStateContextState | null {
  if (!state.gameState) {
    switch (action.type) {
      case 'START_GAME':
      case 'END_GAME':
        return state;
      case 'RESET_GAME':
        return {
          ...initialState,
          optimisticUpdates: new Map()
        };
      default:
        return null;
    }
  }

  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        gameState: { ...state.gameState, phase: 'playing' }
      };

    case 'END_GAME':
      return {
        ...state,
        gameState: { ...state.gameState, phase: 'finished' }
      };

    case 'RESET_GAME':
      return {
        ...initialState,
        optimisticUpdates: new Map()
      };

    default:
      return null;
  }
}