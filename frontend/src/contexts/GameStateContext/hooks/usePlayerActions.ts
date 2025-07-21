import React, { useCallback } from 'react';
import { Player } from '@texas42/shared-types';
import { GameStateAction } from '../types';

export function usePlayerActions(dispatch: React.Dispatch<GameStateAction>) {
  const addPlayer = useCallback((player: Player) => {
    dispatch({ type: 'ADD_PLAYER', payload: player });
  }, [dispatch]);

  const removePlayer = useCallback((playerId: string) => {
    dispatch({ type: 'REMOVE_PLAYER', payload: playerId });
  }, [dispatch]);

  const updatePlayerReady = useCallback((playerId: string, isReady: boolean) => {
    dispatch({ type: 'UPDATE_PLAYER_READY', payload: { playerId, isReady } });
  }, [dispatch]);

  const updatePlayerConnection = useCallback((playerId: string, isConnected: boolean) => {
    dispatch({ type: 'UPDATE_PLAYER_CONNECTION', payload: { playerId, isConnected } });
  }, [dispatch]);

  return {
    addPlayer,
    removePlayer,
    updatePlayerReady,
    updatePlayerConnection
  };
}