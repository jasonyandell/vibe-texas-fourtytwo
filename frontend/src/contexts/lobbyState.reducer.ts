import { LobbyStateContextState, LobbyStateAction } from './lobbyState.types';

// Reducer function
export function lobbyStateReducer(state: LobbyStateContextState, action: LobbyStateAction): LobbyStateContextState {
  switch (action.type) {
    case 'SET_LOBBY_STATE':
      return {
        ...state,
        lobbyState: action.payload,
        error: null
      };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };

    case 'ADD_GAME':
      return {
        ...state,
        lobbyState: {
          ...state.lobbyState,
          availableGames: [...state.lobbyState.availableGames, action.payload]
        }
      };

    case 'REMOVE_GAME':
      return {
        ...state,
        lobbyState: {
          ...state.lobbyState,
          availableGames: state.lobbyState.availableGames.filter(g => g.id !== action.payload)
        }
      };

    case 'UPDATE_GAME_STATUS':
      return {
        ...state,
        lobbyState: {
          ...state.lobbyState,
          availableGames: state.lobbyState.availableGames.map(g =>
            g.id === action.payload.gameId
              ? { ...g, status: action.payload.status }
              : g
          )
        }
      };

    case 'UPDATE_GAME_PLAYER_COUNT':
      return {
        ...state,
        lobbyState: {
          ...state.lobbyState,
          availableGames: state.lobbyState.availableGames.map(g =>
            g.id === action.payload.gameId
              ? { ...g, playerCount: action.payload.playerCount }
              : g
          )
        }
      };

    case 'UPDATE_CONNECTED_PLAYERS':
      return {
        ...state,
        lobbyState: {
          ...state.lobbyState,
          connectedPlayers: Math.max(0, action.payload)
        }
      };

    case 'INCREMENT_CONNECTED_PLAYERS':
      return {
        ...state,
        lobbyState: {
          ...state.lobbyState,
          connectedPlayers: state.lobbyState.connectedPlayers + 1
        }
      };

    case 'DECREMENT_CONNECTED_PLAYERS':
      return {
        ...state,
        lobbyState: {
          ...state.lobbyState,
          connectedPlayers: Math.max(0, state.lobbyState.connectedPlayers - 1)
        }
      };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    default:
      return state;
  }
}