import React, { createContext, useReducer, useRef } from 'react';
import { GameStateContextValue } from './types';
import { gameStateReducer, initialState } from './reducer';
import { useGameStateActions } from './hooks/useGameStateActions';
import { usePlayerActions } from './hooks/usePlayerActions';
import { useOptimisticUpdateActions } from './hooks/useOptimisticUpdateActions';
import { useSerializationActions } from './hooks/useSerializationActions';
import { usePersistenceActions } from './hooks/usePersistenceActions';
import { useRetryOperation } from './hooks/useRetryOperation';

// Create context
const GameStateContext = createContext<GameStateContextValue | undefined>(undefined);

// Provider component
export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameStateReducer, initialState);
  const _retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const gameStateActions = useGameStateActions(dispatch);
  const playerActions = usePlayerActions(dispatch);
  const optimisticUpdateActions = useOptimisticUpdateActions(state, dispatch);
  const serializationActions = useSerializationActions(state, gameStateActions);
  const persistenceActions = usePersistenceActions(state, gameStateActions);
  const retryOperation = useRetryOperation(gameStateActions);

  const value: GameStateContextValue = {
    ...state,
    ...gameStateActions,
    ...playerActions,
    ...optimisticUpdateActions,
    ...serializationActions,
    ...persistenceActions,
    retryOperation
  };

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
};

// Export the context for testing and direct access
export { GameStateContext };