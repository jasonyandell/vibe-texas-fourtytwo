import { GameStateAction, GameStateContextState } from '../types';

export function handleCoreStateActions(
  state: GameStateContextState,
  action: GameStateAction
): GameStateContextState | null {
  switch (action.type) {
    case 'SET_GAME_STATE':
      return {
        ...state,
        gameState: action.payload,
        baseState: action.payload,
        error: action.payload === null ? state.error : null,
        optimisticUpdates: new Map()
      };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    case 'SET_AUTO_SAVE':
      return { ...state, autoSave: action.payload };

    default:
      return null;
  }
}