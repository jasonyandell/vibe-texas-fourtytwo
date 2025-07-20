import React, { createContext, useReducer, useCallback } from 'react';
import { LobbyState, LobbyGame, isValidLobbyState } from '@/types/texas42';
import { LobbyStateContextValue, initialState } from './lobbyState.types';
import { lobbyStateReducer } from './lobbyState.reducer';
import { filterGamesByStatus, filterJoinableGames, sortGames } from './lobbyState.utils';

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
    return filterGamesByStatus(state.lobbyState.availableGames, status);
  }, [state.lobbyState.availableGames]);

  const getJoinableGames = useCallback(() => {
    return filterJoinableGames(state.lobbyState.availableGames);
  }, [state.lobbyState.availableGames]);

  const getSortedGames = useCallback((sortBy: 'newest' | 'oldest' | 'playerCount' | 'name') => {
    return sortGames(state.lobbyState.availableGames, sortBy);
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