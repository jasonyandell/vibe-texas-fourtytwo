import React, { createContext, useReducer, useCallback } from 'react';
import { LobbyState, LobbyGame, isValidLobbyState } from '@/types/texas42';

// Action types for the reducer
type LobbyStateAction =
  | { type: 'SET_LOBBY_STATE'; payload: LobbyState }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: Error | null }
  | { type: 'ADD_GAME'; payload: LobbyGame }
  | { type: 'REMOVE_GAME'; payload: string }
  | { type: 'UPDATE_GAME_STATUS'; payload: { gameId: string; status: LobbyGame['status'] } }
  | { type: 'UPDATE_GAME_PLAYER_COUNT'; payload: { gameId: string; playerCount: number } }
  | { type: 'UPDATE_CONNECTED_PLAYERS'; payload: number }
  | { type: 'INCREMENT_CONNECTED_PLAYERS' }
  | { type: 'DECREMENT_CONNECTED_PLAYERS' }
  | { type: 'CLEAR_ERROR' };

// State interface
interface LobbyStateContextState {
  lobbyState: LobbyState;
  isLoading: boolean;
  error: Error | null;
}

// Context interface
interface LobbyStateContextValue extends LobbyStateContextState {
  updateLobbyState: (lobbyState: LobbyState) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  addGame: (game: LobbyGame) => void;
  removeGame: (gameId: string) => void;
  updateGameStatus: (gameId: string, status: LobbyGame['status']) => void;
  updateGamePlayerCount: (gameId: string, playerCount: number) => void;
  updateConnectedPlayers: (count: number) => void;
  incrementConnectedPlayers: () => void;
  decrementConnectedPlayers: () => void;
  getAvailableGames: (status?: LobbyGame['status']) => LobbyGame[];
  getJoinableGames: () => LobbyGame[];
  getSortedGames: (sortBy: 'newest' | 'oldest' | 'playerCount' | 'name') => LobbyGame[];
  handlePlayerJoinGame: (gameId: string) => void;
  handlePlayerLeaveGame: (gameId: string) => void;
  clearError: () => void;
  refreshLobby: (fetchFn: () => Promise<LobbyState>) => Promise<void>;
}

// Initial state
const initialState: LobbyStateContextState = {
  lobbyState: {
    availableGames: [],
    connectedPlayers: 0
  },
  isLoading: false,
  error: null
};

// Reducer function
function lobbyStateReducer(state: LobbyStateContextState, action: LobbyStateAction): LobbyStateContextState {
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

// Create context
const LobbyStateContext = createContext<LobbyStateContextValue | undefined>(undefined);

// Provider component
export const LobbyStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(lobbyStateReducer, initialState);

  const updateLobbyState = useCallback((lobbyState: LobbyState) => {
    if (!isValidLobbyState(lobbyState)) {
      dispatch({ type: 'SET_ERROR', payload: new Error('Invalid lobby state') });
      return;
    }
    dispatch({ type: 'SET_LOBBY_STATE', payload: lobbyState });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setError = useCallback((error: Error | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const addGame = useCallback((game: LobbyGame) => {
    dispatch({ type: 'ADD_GAME', payload: game });
  }, []);

  const removeGame = useCallback((gameId: string) => {
    dispatch({ type: 'REMOVE_GAME', payload: gameId });
  }, []);

  const updateGameStatus = useCallback((gameId: string, status: LobbyGame['status']) => {
    dispatch({ type: 'UPDATE_GAME_STATUS', payload: { gameId, status } });
  }, []);

  const updateGamePlayerCount = useCallback((gameId: string, playerCount: number) => {
    dispatch({ type: 'UPDATE_GAME_PLAYER_COUNT', payload: { gameId, playerCount } });
  }, []);

  const updateConnectedPlayers = useCallback((count: number) => {
    dispatch({ type: 'UPDATE_CONNECTED_PLAYERS', payload: count });
  }, []);

  const incrementConnectedPlayers = useCallback(() => {
    dispatch({ type: 'INCREMENT_CONNECTED_PLAYERS' });
  }, []);

  const decrementConnectedPlayers = useCallback(() => {
    dispatch({ type: 'DECREMENT_CONNECTED_PLAYERS' });
  }, []);

  const getAvailableGames = useCallback((status?: LobbyGame['status']) => {
    if (!status) return state.lobbyState.availableGames;
    return state.lobbyState.availableGames.filter(game => game.status === status);
  }, [state.lobbyState.availableGames]);

  const getJoinableGames = useCallback(() => {
    return state.lobbyState.availableGames.filter(
      game => game.status === 'waiting' && game.playerCount < game.maxPlayers
    );
  }, [state.lobbyState.availableGames]);

  const getSortedGames = useCallback((sortBy: 'newest' | 'oldest' | 'playerCount' | 'name') => {
    const games = [...state.lobbyState.availableGames];
    
    switch (sortBy) {
      case 'newest':
        return games.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'oldest':
        return games.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'playerCount':
        return games.sort((a, b) => b.playerCount - a.playerCount);
      case 'name':
        return games.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return games;
    }
  }, [state.lobbyState.availableGames]);

  const handlePlayerJoinGame = useCallback((gameId: string) => {
    const game = state.lobbyState.availableGames.find(g => g.id === gameId);
    if (game && game.playerCount < game.maxPlayers) {
      updateGamePlayerCount(gameId, game.playerCount + 1);
    }
  }, [state.lobbyState.availableGames, updateGamePlayerCount]);

  const handlePlayerLeaveGame = useCallback((gameId: string) => {
    const game = state.lobbyState.availableGames.find(g => g.id === gameId);
    if (game) {
      const newPlayerCount = game.playerCount - 1;
      if (newPlayerCount <= 0) {
        removeGame(gameId);
      } else {
        updateGamePlayerCount(gameId, newPlayerCount);
      }
    }
  }, [state.lobbyState.availableGames, updateGamePlayerCount, removeGame]);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const refreshLobby = useCallback(async (fetchFn: () => Promise<LobbyState>) => {
    try {
      setLoading(true);
      const newLobbyState = await fetchFn();
      updateLobbyState(newLobbyState);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, updateLobbyState, setError]);

  const value: LobbyStateContextValue = {
    ...state,
    updateLobbyState,
    setLoading,
    setError,
    addGame,
    removeGame,
    updateGameStatus,
    updateGamePlayerCount,
    updateConnectedPlayers,
    incrementConnectedPlayers,
    decrementConnectedPlayers,
    getAvailableGames,
    getJoinableGames,
    getSortedGames,
    handlePlayerJoinGame,
    handlePlayerLeaveGame,
    clearError,
    refreshLobby
  };

  return (
    <LobbyStateContext.Provider value={value}>
      {children}
    </LobbyStateContext.Provider>
  );
};

// Export the context for testing and direct access
export { LobbyStateContext };