import React from 'react';
import { useLobbyStateContext } from '@/hooks/useLobbyStateContext';

// Test component that uses the context
export const TestComponent = () => {
  const {
    lobbyState,
    isLoading,
    error,
    addGame,
    updateConnectedPlayers,
    clearError,
    setError
  } = useLobbyStateContext();

  return (
    <div>
      <div data-testid="connected-players">{lobbyState.connectedPlayers}</div>
      <div data-testid="games-count">{lobbyState.availableGames.length}</div>
      <div data-testid="loading-state">{isLoading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="error-message">{error ? error.message : 'No Error'}</div>
      
      <button 
        data-testid="add-game-btn" 
        onClick={() => addGame({
          id: 'new-game',
          name: 'New Game',
          playerCount: 0,
          maxPlayers: 4,
          status: 'waiting',
          createdAt: new Date().toISOString()
        })}
      >
        Add Game
      </button>
      
      <button 
        data-testid="update-connected-players-btn" 
        onClick={() => updateConnectedPlayers(20)}
      >
        Update Connected Players
      </button>
      
      <button 
        data-testid="set-error-btn" 
        onClick={() => setError(new Error('Test error'))}
      >
        Set Error
      </button>
      
      <button 
        data-testid="clear-error-btn" 
        onClick={() => clearError()}
      >
        Clear Error
      </button>
    </div>
  );
};