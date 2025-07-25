import { create } from 'zustand';
import { GameState, Player, Domino } from '@texas42/shared-types';

interface GameStore {
  // State
  currentGame: GameState | null;
  currentPlayer: Player | null;
  isConnected: boolean;
  
  // Actions
  setCurrentGame: (game: GameState | null) => void;
  setCurrentPlayer: (player: Player | null) => void;
  setConnected: (connected: boolean) => void;
  updateGameState: (updates: Partial<GameState>) => void;
  
  // Game actions
  joinGame: (gameId: string, playerName: string) => Promise<boolean>;
  leaveGame: () => Promise<void>;
  playDomino: (domino: Domino) => Promise<boolean>;
  placeBid: (amount: number, trump?: string) => Promise<boolean>;
}

export const useGameStore = create<GameStore>((set) => ({
  // Initial state
  currentGame: null,
  currentPlayer: null,
  isConnected: false,
  
  // State setters
  setCurrentGame: (game) => set({ currentGame: game }),
  setCurrentPlayer: (player) => set({ currentPlayer: player }),
  setConnected: (connected) => set({ isConnected: connected }),
  
  updateGameState: (updates) => set((state) => ({
    currentGame: state.currentGame ? { ...state.currentGame, ...updates } : null
  })),
  
  // Game actions (TODO: implement API calls)
  joinGame: (gameId: string, playerName: string) => {
    // TODO: Implement API call to join game
    console.log(`Joining game ${gameId} as ${playerName}`);
    return Promise.resolve(true);
  },

  leaveGame: () => {
    // TODO: Implement API call to leave game
    console.log('Leaving game');
    set({ currentGame: null, currentPlayer: null });
    return Promise.resolve();
  },

  playDomino: (domino: Domino) => {
    // TODO: Implement API call to play domino
    console.log(`Playing domino ${domino.high}-${domino.low}`);
    return Promise.resolve(true);
  },

  placeBid: (amount: number, trump?: string) => {
    // TODO: Implement API call to place bid
    console.log(`Placing bid: ${amount} ${trump || ''}`);
    return Promise.resolve(true);
  },
}));
