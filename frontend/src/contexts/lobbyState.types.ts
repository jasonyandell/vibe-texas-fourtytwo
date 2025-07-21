import { LobbyState, LobbyGame } from '@/types/texas42';

// Action types for the reducer
export type LobbyStateAction =
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
export interface LobbyStateContextState {
  lobbyState: LobbyState;
  isLoading: boolean;
  error: Error | null;
}

// Context interface
export interface LobbyStateContextValue extends LobbyStateContextState {
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
export const initialState: LobbyStateContextState = {
  lobbyState: {
    availableGames: [],
    connectedPlayers: 0
  },
  isLoading: false,
  error: null
};