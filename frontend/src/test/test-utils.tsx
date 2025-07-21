/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import type { GameState, LobbyState } from '@/types/texas42';
import { TestProviders, AllTheProviders } from './test-providers';

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

// Re-export mock data for backward compatibility
export { createMockGameState as defaultMockGameState } from './mock-data';
export const defaultMockLobbyState: LobbyState = {
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
