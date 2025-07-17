/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { GameStateProvider } from '@/contexts/GameStateContext';
import { LobbyStateProvider } from '@/contexts/LobbyStateContext';
import type { GameState, LobbyState } from '@/types/texas42';

// Default mock game state for testing
const defaultMockGameState: GameState = {
  id: 'test-game-123',
  phase: 'playing',
  players: [
    {
      id: 'player1',
      name: 'Player 1',
      position: 'north',
      hand: [
        { high: 6, low: 6, id: 'dom-66', pointValue: 10, isCountDomino: true },
        { high: 6, low: 5, id: 'dom-65', pointValue: 5, isCountDomino: true },
        { high: 6, low: 4, id: 'dom-64', pointValue: 0, isCountDomino: false }
      ],
      isConnected: true,
      isReady: true
    },
    {
      id: 'player2',
      name: 'Player 2',
      position: 'east',
      hand: [
        { high: 5, low: 5, id: 'dom-55', pointValue: 5, isCountDomino: true },
        { high: 5, low: 4, id: 'dom-54', pointValue: 0, isCountDomino: false },
        { high: 5, low: 3, id: 'dom-53', pointValue: 0, isCountDomino: false }
      ],
      isConnected: true,
      isReady: true
    },
    {
      id: 'player3',
      name: 'Player 3',
      position: 'south',
      hand: [
        { high: 4, low: 4, id: 'dom-44', pointValue: 0, isCountDomino: false },
        { high: 4, low: 3, id: 'dom-43', pointValue: 0, isCountDomino: false },
        { high: 4, low: 2, id: 'dom-42', pointValue: 0, isCountDomino: false }
      ],
      isConnected: true,
      isReady: true
    },
    {
      id: 'player4',
      name: 'Player 4',
      position: 'west',
      hand: [
        { high: 3, low: 3, id: 'dom-33', pointValue: 0, isCountDomino: false },
        { high: 3, low: 2, id: 'dom-32', pointValue: 0, isCountDomino: false },
        { high: 3, low: 1, id: 'dom-31', pointValue: 0, isCountDomino: false }
      ],
      isConnected: true,
      isReady: true
    }
  ],
  currentPlayer: 'player1',
  dealer: 'player1',
  tricks: [],
  scores: {
    northSouth: 0,
    eastWest: 0
  },
  gameScore: {
    northSouth: 0,
    eastWest: 0
  },
  boneyard: [],
  bidder: 'player1',
  trump: 'sixes',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Default mock lobby state for testing
const defaultMockLobbyState: LobbyState = {
  availableGames: [
    {
      id: 'test-game-123',
      name: 'Test Game',
      playerCount: 2,
      maxPlayers: 4,
      status: 'waiting',
      createdAt: new Date().toISOString()
    }
  ],
  connectedPlayers: 2
};

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
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <TestProviders>
      {children}
    </TestProviders>
  );
};

// Custom render function that includes providers by default
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  gameState?: Partial<GameState>;
  lobbyState?: Partial<LobbyState>;
  includeRouter?: boolean;
  wrapper?: React.ComponentType<{ children: React.ReactNode }>;
}

function renderWithContextProviders(
  ui: React.ReactElement,
  {
    gameState = {},
    lobbyState = {},
    includeRouter = true,
    wrapper,
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  const Wrapper = wrapper || (({ children }: { children: React.ReactNode }) => (
    <TestProviders
      gameState={gameState}
      lobbyState={lobbyState}
      includeRouter={includeRouter}
    >
      {children}
    </TestProviders>
  ));

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Custom render function that includes providers
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything from testing-library/react
export * from '@testing-library/react';

// Re-export user event utilities
export { createUserEvent } from './user-event-utils';

// Override the default render with our custom one
export { customRender as render };

// Export additional utilities
export { renderWithContextProviders as renderWithProviders };
export { defaultMockGameState, defaultMockLobbyState };
