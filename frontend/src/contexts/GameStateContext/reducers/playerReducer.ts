import { GameStateAction, GameStateContextState } from '../types';

export function handlePlayerActions(
  state: GameStateContextState,
  action: GameStateAction
): GameStateContextState | null {
  if (!state.gameState) {
    switch (action.type) {
      case 'ADD_PLAYER':
      case 'REMOVE_PLAYER':
      case 'UPDATE_PLAYER_READY':
      case 'UPDATE_PLAYER_CONNECTION':
        return state;
      default:
        return null;
    }
  }

  switch (action.type) {
    case 'ADD_PLAYER':
      return {
        ...state,
        gameState: {
          ...state.gameState,
          players: [...state.gameState.players, action.payload]
        }
      };

    case 'REMOVE_PLAYER':
      return {
        ...state,
        gameState: {
          ...state.gameState,
          players: state.gameState.players.filter(p => p.id !== action.payload)
        }
      };

    case 'UPDATE_PLAYER_READY':
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

    default:
      return null;
  }
}