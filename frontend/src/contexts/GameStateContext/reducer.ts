import { GameStateAction, GameStateContextState } from './types';

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

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    case 'SET_AUTO_SAVE':
      return { ...state, autoSave: action.payload };

    default:
      return state;
  }
}