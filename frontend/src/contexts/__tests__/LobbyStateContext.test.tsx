import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { LobbyStateProvider } from '../LobbyStateContext';
import { useLobbyStateContext } from '@/hooks/useLobbyStateContext';
import React from 'react';

// Test component that uses the context
const TestComponent = () => {
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

describe('LobbyStateContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('provides initial state values', () => {
    render(
      <LobbyStateProvider>
        <TestComponent />
      </LobbyStateProvider>
    );
    
    expect(screen.getByTestId('connected-players').textContent).toBe('0');
    expect(screen.getByTestId('games-count').textContent).toBe('0');
    expect(screen.getByTestId('loading-state').textContent).toBe('Not Loading');
    expect(screen.getByTestId('error-message').textContent).toBe('No Error');
  });

  it('adds a new game to the state', () => {
    render(
      <LobbyStateProvider>
        <TestComponent />
      </LobbyStateProvider>
    );
    
    act(() => {
      screen.getByTestId('add-game-btn').click();
    });
    
    expect(screen.getByTestId('games-count').textContent).toBe('1');
  });

  it('updates connected players count', () => {
    render(
      <LobbyStateProvider>
        <TestComponent />
      </LobbyStateProvider>
    );
    
    act(() => {
      screen.getByTestId('update-connected-players-btn').click();
    });
    
    expect(screen.getByTestId('connected-players').textContent).toBe('20');
  });

  it('sets and clears errors', () => {
    render(
      <LobbyStateProvider>
        <TestComponent />
      </LobbyStateProvider>
    );
    
    // Set an error
    act(() => {
      screen.getByTestId('set-error-btn').click();
    });
    expect(screen.getByTestId('error-message').textContent).toBe('Test error');
    
    // Clear the error
    act(() => {
      screen.getByTestId('clear-error-btn').click();
    });
    expect(screen.getByTestId('error-message').textContent).toBe('No Error');
  });

  it('throws an error when context is used outside provider', () => {
    // Suppress console.error for this test
    const originalConsoleError = console.error;
    console.error = vi.fn();
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useLobbyStateContext must be used within a LobbyStateProvider');
    
    // Restore console.error
    console.error = originalConsoleError;
  });
});