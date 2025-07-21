import React from 'react';
import { render } from '@testing-library/react';
import { LobbyStateProvider } from '@/contexts/LobbyStateContext';

// Re-export all mocks for backward compatibility
export { mockGames } from './lobby.mockData';
export { 
  mockAddGame,
  mockClearError,
  mockGetAvailableGames,
  mockGetJoinableGames,
  mockGetSortedGames,
  mockHookState,
  resetMockHookState
} from './lobby.mockFunctions';

// Import mock components to ensure they're loaded
import './lobby.mockComponents';

// Helper function to render the component with context
import { Lobby } from '../Lobby';

export const renderLobby = () => {
  return render(
    <LobbyStateProvider>
      <Lobby />
    </LobbyStateProvider>
  );
};