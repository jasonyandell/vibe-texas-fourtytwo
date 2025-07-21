import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { GameStateProvider } from '@/contexts/GameStateContext';
import { LobbyStateProvider } from '@/contexts/LobbyStateContext';
import type { GameState, LobbyState } from '@/types/texas42';

// Enhanced Router wrapper with future flags to prevent warnings
export const TestRouter = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

interface TestProvidersProps {
  children: React.ReactNode;
  gameState?: Partial<GameState>;
  lobbyState?: Partial<LobbyState>;
  includeRouter?: boolean;
}

// Test wrapper component that provides all necessary contexts
export function TestProviders({
  children,
  gameState: _gameState = {},
  lobbyState: _lobbyState = {},
  includeRouter = true
}: TestProvidersProps) {
  // Note: Context providers will use their own initial state management
  // The gameState and lobbyState props are for future enhancement
  const content = (
    <GameStateProvider>
      <LobbyStateProvider>
        {children}
      </LobbyStateProvider>
    </GameStateProvider>
  );

  if (includeRouter) {
    return <TestRouter>{content}</TestRouter>;
  }

  return content;
}

// All-in-one wrapper for tests that need routing and contexts
export const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <TestProviders>
      {children}
    </TestProviders>
  );
};